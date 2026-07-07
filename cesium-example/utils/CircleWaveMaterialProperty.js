/**
 * 水波纹扩散材质 (修复版)
 */
function CircleWaveMaterialProperty(options) {
    options = options || {}; // 【修复 1】防止 options 未定义报错
    this._definitionChanged = new Cesium.Event();
    
    // 【修复 2】更安全的颜色解析
    let colorObj = Cesium.Color.RED;
    if (options.color) {
        try {
            colorObj = Cesium.Color.fromCssColorString(options.color);
        } catch (e) {
            console.warn("Invalid color string, using default red", e);
        }
    }
    this.color = Cesium.defaultValue(colorObj, Cesium.Color.RED);
    
    this.duration = Cesium.defaultValue(options.duration, 1000);
    this.count = Cesium.defaultValue(options.count, 2);
    if (this.count <= 0) this.count = 1;
    // 限制最大数量，防止 Shader 循环过大（虽然下面写死了 9）
    if (this.count > 9) this.count = 9; 
    
    this.gradient = Cesium.defaultValue(options.gradient, 0.1);
    if (this.gradient > 1) this.gradient = 1;
    if (this.gradient < 0.01) this.gradient = 0.01; // 防止 pow 出错
    
    this.time = new Date().getTime();
}

Object.defineProperties(CircleWaveMaterialProperty.prototype, {
    isConstant: { get: function () { return false; } },
    definitionChanged: { get: function () { return this._definitionChanged; } },
    color: Cesium.createPropertyDescriptor('color'),
    gradient: Cesium.createPropertyDescriptor('gradient'),
    duration: Cesium.createPropertyDescriptor('duration'),
    count: Cesium.createPropertyDescriptor('count'),
});

CircleWaveMaterialProperty.prototype.getType = function () {
    return Cesium.Material.CircleWaveMaterialType;
};

CircleWaveMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color);
    result.time = ((new Date().getTime() - this.time) % this.duration) / this.duration;
    result.count = this.count;
    // 调整 gradient 算法，避免除以零或过大
    result.gradient = 1.0 + 10.0 * (1.0 - this.gradient);
    return result;
};

CircleWaveMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof CircleWaveMaterialProperty &&
            Cesium.Property.equals(this.color, other.color) &&
            Cesium.Property.equals(this.duration, other.duration) &&
            Cesium.Property.equals(this.count, other.count) &&
            Cesium.Property.equals(this.gradient, other.gradient));
};

Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty;
Cesium.Material.CircleWaveMaterialType = 'CircleWaveMaterial';

// 【核心修复】重写 Shader，兼容 GLSL 1.0
Cesium.Material.CircleWaveSource = `
    czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        material.diffuse = 1.5 * color.rgb;
        
        vec2 st = materialInput.st;
        vec3 str = materialInput.str;
        
        // 计算到中心的距离 (0.0 - 0.707)
        float dis = distance(st, vec2(0.5, 0.5));
        
        // 只在圆形区域内渲染
        if (dis > 0.5) {
            discard;
        }
        
        // 如果法线 Z 分量很小，说明是侧面或垂直面，丢弃（可选）
        if (abs(str.z) < 0.001) {
             // 注意：原代码是 > 0.001 丢弃，这通常意味着只渲染垂直于 Z 轴的面？
             // 原逻辑：if (abs(str.z) > 0.001) discard; 
             // 这意味着只有当法线几乎平行于 XY 平面 (str.z 接近 0) 时才显示？
             // 通常水面法线是 (0,0,1)，str.z 应该是 1.0。
             // 原代码逻辑可能是反的，或者是为了剔除侧面。
             // 这里保持原逻辑，但需注意：如果是地面 polygon，str.z 通常是 1.0，不会被 discard。
             // 如果原意是“如果不是水平面则丢弃”，那应该是 abs(str.z) < 0.9 之类的。
             // 暂且保留原逻辑，但注释提醒。
        }
        // 修正：通常我们希望在地面 (法线 0,0,1) 上显示。
        // 如果原代码是 if (abs(str.z) > 0.001) discard; 那么法线为 (0,0,1) 时 (z=1) 会被丢弃！
        // 这会导致地面上什么都看不到！
        // **强烈怀疑原代码这里写反了**，应该是如果法线不朝上才丢弃，或者根本不需要这行。
        // 暂时注释掉这行，否则地面不显示：
        // if (abs(str.z) > 0.001) { discard; } 
        
        float per = fract(time);
        float perDis = 0.5 / count;
        float bl = 0.0;
        
        // 【修复 3】优化循环，避免复杂的 float/int 混用比较
        // 既然 count 最大是 9，我们直接展开或用简单的 int 循环
        for (int i = 0; i < 9; i++) {
            float fi = float(i);
            if (fi >= count) {
                break; 
            }
            
            // 计算当前波环的距离偏移
            float currentRingDis = perDis * fi;
            // 波纹移动逻辑
            float wavePos = currentRingDis - dis + (per / count);
            
            // 简化波纹算法
            if (wavePos > 0.0 && wavePos < perDis) {
                bl = 1.0 - (wavePos / perDis);
            } else if (wavePos >= perDis && wavePos < (perDis * 2.0)) {
                 // 处理波峰后的衰减，模拟双峰或更平滑过渡
                 float extra = wavePos - perDis;
                 if (extra < perDis) {
                     bl = max(bl, 1.0 - abs(1.0 - (extra / perDis)));
                 }
            }
        }
        
        if (bl > 0.001) {
            material.alpha = pow(bl, gradient);
        } else {
            material.alpha = 0.0;
        }
        
        return material;
    }
`;

// 注册材质
if (!Cesium.Material._materialCache.getMaterial(Cesium.Material.CircleWaveMaterialType)) {
    Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleWaveMaterialType, {
        fabric: {
            type: Cesium.Material.CircleWaveMaterialType,
            uniforms: {
                color: new Cesium.Color(0.7, 0.9, 1.0, 1.0), // 修正颜色值 (0-1 之间)
                time: 0.0,
                count: 2.0,
                gradient: 2.0, // 对应 JS 的计算逻辑
            },
            source: Cesium.Material.CircleWaveSource,
        },
        translucent: function () {
            return true;
        },
    });
}