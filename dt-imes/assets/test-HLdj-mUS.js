import{C as e,a as d,L as p,D as u,S as h,b as g,M as f,c as C}from"./DT-C5kOZhxx.js";import"./GoogleImageryProvider-anlfAUpN.js";import{L as w}from"./LayerOceanCurrent-DdppHfeG.js";import{a as v}from"./vendor-BpXvFPYW.js";import{n as D}from"./_plugin-vue2_normalizer-CrCvqmSG.js";const{Cesium:{Cartesian3:I,Cartesian2:V,Color:o,JulianDate:z,Rectangle:F,ReferenceFrame:P,LabelStyle:x,HeightReference:A,HorizontalOrigin:E,PolygonGeometry:N,PolygonHierarchy:O,Appearance:R,Material:W,Primitive:k,GeometryInstance:J,EllipsoidSurfaceAppearance:j,ColorGeometryInstanceAttribute:H,PerInstanceColorAppearance:G,PolylineGeometry:X,PolylineColorAppearance:Y,ArcType:Z,VerticalOrigin:y,Math:B,LinearApproximation:U,TimeInterval:q,ScreenSpaceEventHandler:$,ScreenSpaceEventType:K,Cartographic:Q,DistanceDisplayCondition:b,Transforms:ee,Matrix3:te},Tool:{wgs84ToCartesian3:ie,cartesian3ToWgs84:ae}}=u;let t=null,l=new p;e.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjgwM2VkMy0wOTQxLTRlMDQtOTA3NC02ZDJhNmFlYWI2M2MiLCJpZCI6OTMyNzEsImlhdCI6MTY1MzYxNTc3MX0.PZXaawvZhCgcahjwZFrmfXRtzvgF5_Vq7S1RtHO0sE8";const ne=D({name:"addEnv",props:{visible:{type:Boolean,default:!1}},data(){return{loading:!1,privateVisible:{global:this.visible,card:this.visible},active:0,stepInfo:{name:"",desc:""}}},watch:{visible(i){this.privateVisible.global=i,this.privateVisible.card=i},"privateVisible.card"(i){this.$emit("update:visible",i)}},methods:{addCurrents(){let i=new w({});v({method:"get",url:"/project/dt-imes/demoData/current.json"}).then(n=>{i.load(n.data),i.addToMap(t.cesiumViewer)})},pre(){this.active-=1},next(){this.active+=1,(this.active=1)&&this.$nextTick(()=>{this.initScene()})},async initScene(){let i,n;i=new e.WebMercatorTilingScheme,n=new e.UrlTemplateImageryProvider({url:window.config.mapUrl,tilingScheme:i,minimumLevel:2,maximumLevel:18}),t=new C(this.$refs.rightMap,{imageryProvider:n}),t.cesiumWidget=t.cesiumViewer,t.scene=t.cesiumViewer.scene,t.camera=t.cesiumViewer.camera,t.clock=t.cesiumViewer.clock;for(var a=window.devicePixelRatio;a>=2;)a/=2;t.cesiumViewer.resolutionScale=a,t.cesiumViewer.clock.shouldAnimate=!1,t.addLayer(l),t.cesiumViewer._innerCreditContainer.style.display="none",setTimeout(async()=>{this.addDemo()},1e3)},async loadTerrain(){var a;const i=t.cesiumViewer;(a=i.terrainProvider)!=null&&a.destroy&&i.terrainProvider.destroy();const n=new e.CesiumTerrainProvider({url:"http://data.mars3d.cn/terrain",requestWaterMask:!0,requestVertexNormals:!0});await n.readyPromise,i.terrainProvider=n,i.scene.globe.enableLighting=!0,i.scene.globe.terrainExaggeration=1},waterMaterial(){const i=new e.PostProcessStage({fragmentShader:`
      // ✅ 添加这一行：手动声明 Cesium 后处理传入的纹理坐标
varying vec2 v_textureCoordinates;
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
// ⚠️ 注意：不要声明 v_textureCoordinates，Cesium 后处理框架已自动注入为 varying
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;

// 水面参数 uniform
uniform float u_time;
uniform vec4 u_baseColor;      // 深水色
uniform vec4 u_shallowColor;   // 浅水色
uniform float u_maxDepth;      // 浅水-深水过渡深度(米)

// WebGL 1.0 没有 czm_readNonPerspectiveDepth，需手动线性化深度
float getLinearDepth(vec2 uv) {
    float d = texture2D(depthTexture, uv).r; // 使用 texture2D 而非 texture
    // Cesium 内置 uniform: czm_projection 和 czm_inverseProjection
    // 将非线性深度缓冲值转换为视图空间线性深度
    float zNear = czm_projection[3][2] / (czm_projection[2][2] - 1.0);
    float zFar = czm_projection[3][2] / (czm_projection[2][2] + 1.0);
    return (2.0 * zNear * zFar) / (zFar + zNear - d * (zFar - zNear));
}

void main() {
    // ✅ 使用 gl_FragCoord 或 v_textureCoordinates (已由框架注入)
    vec2 st = v_textureCoordinates; 
    vec4 color = texture2D(colorTexture, st);
    
    // 获取当前像素的线性深度（正值，表示距离相机的距离）
    float pixelDepth = getLinearDepth(st);
    
    // ⭐ 核心逻辑修正：
    // 后处理的 depthTexture 是"相机到地表"的距离，不是海拔高程！
    // 要判断是否在水下，需要结合相机位置和射线方向重建世界坐标，
    // 或者更简单的方法：利用 mars3d 地形自带的 waterMask 或约定海平面高度。
    // 
    // 【临时可行方案】：假设近海区域地表深度 < 某个阈值即为水下
    // 由于 getLinearDepth 返回的是视空间深度，我们需要一个参考基准。
    // 这里改用更稳健的"屏幕空间边缘检测 + 颜色识别"混合方案：
    
    // 1. 通过深度梯度检测岸线（不依赖绝对高程）
    float dx = dFdx(pixelDepth);
    float dy = dFdy(pixelDepth);
    float edge = length(vec2(dx, dy));
    
    // 2. 采样周围深度判断是否处于"低洼区域"（近似水面）
    float center = pixelDepth;
    float avgNeighbor = (
        getLinearDepth(st + vec2(0.001, 0.0)) +
        getLinearDepth(st - vec2(0.001, 0.0)) +
        getLinearDepth(st + vec2(0.0, 0.001)) +
        getLinearDepth(st - vec2(0.0, 0.001))
    ) * 0.25;
    
    // 如果当前像素比周围平均深度"更近"且梯度小 → 可能是平坦水面
    // 如果梯度大 → 岸线
    float isWaterArea = step(abs(center - avgNeighbor), 2.0) * step(edge, 5.0);
    
    // 3. 深浅水模拟（用深度相对值代替绝对高程）
    float depthFactor = clamp((center - avgNeighbor + 2.0) / u_maxDepth, 0.0, 1.0);
    vec3 waterCol = mix(u_shallowColor.rgb, u_baseColor.rgb, depthFactor);
    
    // 4. 岸线泡沫
    float foam = smoothstep(0.5, 3.0, edge) * isWaterArea;
    
    // 5. 波纹
    float wave = sin(st.x * 200.0 + u_time) * 
                 cos(st.y * 200.0 + u_time * 0.7) * 0.02;
    
    // 6. 合成
    vec3 finalColor = mix(waterCol, vec3(1.0), foam * 0.6) + wave;
    float alpha = mix(u_shallowColor.a, u_baseColor.a, depthFactor) * isWaterArea;
    
    // ✅ WebGL 1.0 必须使用 gl_FragColor
    if (isWaterArea > 0.5) {
        gl_FragColor = vec4(finalColor, alpha);
    } else {
        gl_FragColor = color;
    }
}
`,uniforms:{u_time:()=>.001*performance.now(),u_baseColor:new e.Color(0,.15,.35,.92),u_shallowColor:new e.Color(0,.55,.7,.7),u_maxDepth:15}});t.cesiumViewer.scene.postProcessStages.add(i),t.cesiumViewer.scene.globe.depthTestAgainstTerrain=!1,t.cesiumViewer.scene.frameState.context._gl.getExtension("EXT_frag_depth")},addDemo(){t.camera.setView({destination:e.Cartesian3.fromDegrees(120.43632006,27.39102575,1e5),orientation:{heading:e.Math.toRadians(180),pitch:e.Math.toRadians(-30),roll:e.Math.toRadians(0)}});const i=e.JulianDate.now();t.cesiumViewer.clock.currentTime=i,t.cesiumViewer.clock.shouldAnimate=!0,t.cesiumViewer.clock.multiplier=1;const n=new d({id:"station",show:!0,enabled:!0,reference:e.ReferenceFrame.FIXED,modelDisplayDistance:1e3,modelConfig:{url:"/model/station.gltf",minimumPixelSize:64},billboardConfig:{image:"/model/station.png",width:24,height:24},pointConfig:{color:e.Color.RED,pixelSize:10},labelConfig:{text:"地面站",font:"Microsoft YaHei 12px",pixelOffset:new e.Cartesian2(-10,20),verticalOrigin:e.VerticalOrigin.CENTER,outlineColor:e.Color.BLACK,outlineWidth:2,style:e.LabelStyle.FILL_AND_OUTLINE,distanceDisplayCondition:new e.DistanceDisplayCondition(0,1e7)},pathOptions:{show:!1},position:e.Cartesian3.fromDegrees(121.24074407,25.07551621,0),alwaysShowModel:!1});l.add(n);let a=new d({id:"test",show:!0,reference:e.ReferenceFrame.FIXED,enableInertialDirection:!0,enableOrbitSwitch:!0,modelDisplayDistance:1e6,pointToBillBoardDistance:1e10,modelConfig:{url:"/model/sate.gltf",minimumPixelSize:64},billboardConfig:{image:"/model/sate.png",width:24,height:24},pointConfig:{color:o.RED,pixelSize:10,outlineColor:o.WHITE,outlineWidth:2},labelConfig:{text:"卫星",font:"Microsoft YaHei 12px",pixelOffset:new e.Cartesian2(-10,20),fillColor:o.WHITE,outlineColor:o.BLACK,outlineWidth:2,verticalOrigin:y.CENTER,style:x.FILL_AND_OUTLINE,distanceDisplayCondition:new b(0,15e6)},pathOptions:{id:"pol-test",material:e.Color.CYAN,width:1,leadTime:7200,trailTime:7200,resolution:1200},alwaysShowModel:!0});const r=e.JulianDate.now(),s=e.JulianDate.addMinutes(r,1,new e.JulianDate);a.addPositionSample(r,e.Cartesian3.fromDegrees(120.98253071,25.92074929,5e4)),a.addPositionSample(s,e.Cartesian3.fromDegrees(119.49403569,23.92166804,5e4));let c=new h({id:"circle-wave",enabled:!0,halfAngle:e.Math.toRadians(10),length:28e5,material:e.Color.fromCssColorString("rgba(103, 194,58,0.2)")});a.add(c),c.availability.push(new e.TimeInterval({start:r,stop:s})),l.add(a);const m=new g({entityFrom:n,entityTo:a,id:"link1",polylineOptions:{material:new f({image:"static/img/arrow-double-left.png",color:e.Color.fromCssColorString("rgb(0, 255, 0)"),speed:10,dashLength:30}),width:5}});m.availability.push(new e.TimeInterval({start:r,stop:s})),l.add(m)}},mounted(){this.initScene()},beforeDestroy(){t&&(t.destroy(),t=null)}},function(){return(0,this._self._c)("div",{ref:"rightMap",staticClass:"right-map",attrs:{id:"right-map"}})},[],!1,null,"0756ec3e").exports;export{ne as default};
