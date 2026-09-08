function defined(object)
{
	if(object != null && object != undefined)  return true;
	return false;
}

class RadarCustomDrawCommand extends  Cesium.DrawCommand {
	constructor(options,radarRenderObject) {
		super(options)
		this.cull = true;
		this.occlude = true;
		this._radarRenderObject = radarRenderObject;

	}
	 execute(context, passState) {
		const gl = context._gl;
		if (passState.framebuffer)
		{
			passState.framebuffer._bind();
		}

		if(this._radarRenderObject)
		{
			this._radarRenderObject.onAfterRender();
		}

	};

}
RadarCustomDrawCommand.createLogDepthCommand = function (command, context, result) {
	if (!defined(result)) {
		result = {};
	}
	result.command = RadarCustomDrawCommand.shallowClone(command, result.command);
	return result;
};

RadarCustomDrawCommand.shallowClone = function (command, result) {
	if (!defined(command)) {
		return undefined;
	}
	if (!defined(result)) {
		result = new RadarCustomDrawCommand();
	}

	result._boundingVolume = command._boundingVolume;
	result._orientedBoundingBox = command._orientedBoundingBox;
	result._modelMatrix = command._modelMatrix;
	result._primitiveType = command._primitiveType;
	result._vertexArray = command._vertexArray;
	result._count = command._count;
	result._offset = command._offset;
	result._instanceCount = command._instanceCount;
	result._shaderProgram = command._shaderProgram;
	result._uniformMap = command._uniformMap;
	result._renderState = command._renderState;
	result._framebuffer = command._framebuffer;
	result._pass = command._pass;
	result._owner = command._owner;
	result._debugOverlappingFrustums = command._debugOverlappingFrustums;
	result._pickId = command._pickId;
	result._flags = command._flags;
	result._radarRenderObject = command._radarRenderObject;
	result.dirty = true;
	result.lastDirtyTime = 0;
	result._name = command._name;

	return result;
};



 function EarthRadarString(value) {
	var type = typeof value;
	if (type === 'string') {
		this.handle = RadarModule.allocateUTF8(value);
	} else if (type === 'number') {
		this.handle = RadarModule._malloc(value);
	} else {
		this.handle = null;
	}
}
 function degreesToRadiansLongitude(degrees) {
	 return degrees * (Math.PI / 180);
 }

 // 纬度转弧度
 function degreesToRadiansLatitude(degrees) {
	 // const radians = degrees * (Math.PI / 180);
	 // // 对纬度进行拉普拉斯变换
	 // return Math.log(Math.tan(radians / 2 + Math.PI / 4));

	 return degrees * (Math.PI / 180);
 }

Object.assign(EarthRadarString.prototype, {
	getHandle: function () {
		return this.handle;
	},
	dispose: function () {
		if (this.handle !== null) {
			RadarModule._free(this.handle);
			this.handle = null;
		}
	},
	toString: function () {
		if (this.handle !== null) {
			return RadarModule.UTF8ToString(this.handle);
		}
		return null;
	}
});


var EarthRadarArrayType = {
	Int8: 0,
	UInt8: 1,
	UInt16: 2,
	Int16: 3,
	UInt32: 4,
	Int32: 5,
	Float32: 6,
	Float64: 7
};



function EarthRadarArray(value, type) {
	var array = value;
	this.type = type;
	if (Array.isArray(value)) {
		if (type === EarthRadarArrayType.Int8) {
			array = new Int8Array(value);
		} else if (type === EarthRadarArrayType.UInt8) {
			array = new Uint8Array(value);
		} else if (type === EarthRadarArrayType.UInt16) {
			array = new Uint16Array(value);
		} else if (type === EarthRadarArrayType.Int16) {
			array = new Int16Array(value);
		} else if (type === EarthRadarArrayType.UInt32) {
			array = new Uint32Array(value);
		} else if (type === EarthRadarArrayType.Int32) {
			array = new Int32Array(value);
		} else if (type === EarthRadarArrayType.Float32) {
			array = new Float32Array(value);
		} else if (type === EarthRadarArrayType.Float64) {
			array = new Float64Array(value);
		}
	} else if (value instanceof Number || typeof value === "number") {
		if (type === EarthRadarArrayType.Int8) {
			array = new Int8Array(value);
		} else if (type === EarthRadarArrayType.UInt8) {
			array = new Uint8Array(value);
		} else if (type === EarthRadarArrayType.UInt16) {
			array = new Uint16Array(value);
		} else if (type === EarthRadarArrayType.Int16) {
			array = new Int16Array(value);
		} else if (type === EarthRadarArrayType.UInt32) {
			array = new Uint32Array(value);
		} else if (type === EarthRadarArrayType.Int32) {
			array = new Int32Array(value);
		} else if (type === EarthRadarArrayType.Float32) {
			array = new Float32Array(value);
		} else if (type === EarthRadarArrayType.Float64) {
			array = new Float64Array(value);
		}
	}
	if (array !== null) {
		this.array = array;
		this.handle = RadarModule._malloc(this.array.length * this.array.BYTES_PER_ELEMENT);
	}

	if (array instanceof Int8Array) {
		RadarModule.HEAP8.set(this.array, this.handle);
	} else if (array instanceof Uint8Array) {
		RadarModule.HEAPU8.set(this.array, this.handle);
	} else if (array instanceof Int16Array) {
		RadarModule.HEAP16.set(this.array, this.handle >> 1);
	} else if (array instanceof Uint16Array) {
		RadarModule.HEAPU16.set(this.array, this.handle >> 1);
	} else if (array instanceof Int32Array) {
		RadarModule.HEAP32.set(this.array, this.handle >> 2);
	} else if (array instanceof Uint32Array) {
		RadarModule.HEAPU32.set(this.array, this.handle >> 2);
	} else if (array instanceof Float32Array) {
		RadarModule.HEAPF32.set(this.array, this.handle >> 2);
	} else if (array instanceof Float64Array) {
		RadarModule.HEAPF64.set(this.array, this.handle >> 3);
	}
}



Object.assign(EarthRadarArray.prototype, {
	getHandle: function () {
		return this.handle;
	},
	dispose: function () {
		if (this.handle !== null) {
			RadarModule._free(this.handle);
			this.handle = null;
		}
	},
	toArrayBuffer: function () {
		return this.array;
	},
	toArray: function () {
		let array = Array.prototype.slice.call(this.array);
		return array;
	},

	updateData: function () {
		var type = this.type;
		var ptr=null;
		var buffer=null;
		if (type === EarthRadarArrayType.Int8) {
			ptr = this.getHandle();
			buffer = RadarModule.HEAP8.subarray(ptr, ptr + this.array.length);
			this.array = new Int8Array(buffer);
		} else if (type === EarthRadarArrayType.UInt8) {
			ptr = this.getHandle();
			buffer = RadarModule.HEAPU8.subarray(ptr, ptr + this.array.length);
			this.array = new Uint8Array(buffer);
		} else if (type === EarthRadarArrayType.UInt16) {
			ptr = this.getHandle() >> 1;
			buffer = RadarModule.HEAPU16.subarray(ptr, ptr + this.array.length);
			this.array = new Uint16Array(buffer);
		} else if (type == EarthRadarArrayType.Int16) {
			ptr = this.getHandle() >> 1;
			buffer = RadarModule.HEAP16.subarray(ptr, ptr + this.array.length);
			this.array = new Int16Array(buffer);
		} else if (type == EarthRadarArrayType.UInt32) {
			ptr = this.getHandle() >> 2;
			buffer = RadarModule.HEAPU32.subarray(ptr, ptr + this.array.length);
			this.array = new Uint32Array(buffer);
		} else if (type == EarthRadarArrayType.Int32) {
			ptr = this.getHandle() >> 2;
			buffer = RadarModule.HEAP32.subarray(ptr, ptr + this.array.length);
			this.array = new Int32Array(buffer);
		} else if (type == EarthRadarArrayType.Float32) {
			ptr = this.getHandle() >> 3;
			buffer = RadarModule.HEAPF32.subarray(ptr, ptr + this.array.length);
			this.array = new Float32Array(buffer);
		} else if (type == EarthRadarArrayType.Float64) {
			ptr = this.getHandle() >> 3;
			buffer = RadarModule.HEAPF64.subarray(ptr, ptr + this.array.length);
			this.array = new Float64Array(buffer);
		}
	}
});

/**
 * @vuepress
 *
 * ---
 * title: EarthRadar SDK
 * headline: 雷达插件模块
 * ---
 */
/**
   * 创建雷达参数设置
   * @name Radarparam
   * @class Radarparam
   * 雷达参数设置函数
   * @example
   * let radarparam = new Radarparam();
   */
class Radarparam {
	constructor() {
		this.radarHandle  = RadarModule._radar_create();
		this.longitude=0;
		this.latitude=0;
		this.height=1000;
		this.radarColor='rgba(255, 0, 0, 0.8)';//雷达包络主色
		this.radarAlpha = 0.8 ;//包络透明度默认值
		this.antenaColor='rgba(192, 102, 0, 0.8)';//天线主色
		this.viewer = null;
	}
	/**
	 * 更新雷达位置
	 *  @param {Number} longitude 经度 
     * @param {Number} latitude 纬度
     * @param {number} [height=1000] 高度
	 * */
	UpdateRadarPosition(longitude, latitude, height=1000)
	{
		if (this.radarHandle!==null){
			this.longitude=longitude;
			this.latitude=latitude;
			this.height=height;
			let viewer = this.viewer;
			if(viewer == null) return;
			var modelRotation = Cesium.Matrix4.IDENTITY;

			let center ;
			if (viewer.scene.mode === Cesium.SceneMode.SCENE3D)
			{
				center = Cesium.Cartesian3.fromDegrees(this.longitude,this.latitude ,this.height);
				var rotationY = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-this.latitude)), new Cesium.Matrix4());
				var rotationZ = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(this.longitude)), new Cesium.Matrix4());
				modelRotation = Cesium.Matrix4.multiply(rotationZ,rotationY, new Cesium.Matrix4());
			}
			else {
				const projection = viewer.scene.mapProjection;
				let input = new Cesium.Cartographic(degreesToRadiansLongitude(longitude), degreesToRadiansLatitude(latitude),height);
				 center = projection.project(input);

				let x = center.x;
				let y = center.y;
				let z = center.z;

				center.x = z;
				center.y = x;
				center.z = y;
			}

			let modelTranslate = Cesium.Matrix4.fromTranslation(center);
			let modelResult = Cesium.Matrix4.multiply(modelTranslate,modelRotation, new Cesium.Matrix4());
			let modulmatrix = new EarthRadarArray(Cesium.Matrix4.toArray(modelResult), EarthRadarArrayType.Float64);

			RadarModule._radar_set_model_matrix(this.radarHandle,modulmatrix.getHandle());//设置雷达位置矩阵
			RadarModule._radar_set_pos(this.radarHandle,this.longitude,this.latitude ,this.height);//底层也需要一个原始坐标 设置雷达位置
		}
	}
	/**
	 * 设置雷达包络的格网树 此方法弃用
	 *  @param {int} framePickNum
	 * */
	SetRadarGrid(framePickNum=0)
	{
		if (this.radarHandle!==null){
			// RadarModule._radar_set_grid_step_angle(this.radarHandle,5,framePickNum);
		}
	}
	/**
	 * 设置雷达包络的格网显隐
	 *  @param {bool} value
	 * */
	set RadarShowGrid(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_SetIsShowGrid(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达包络的格网显隐状态
	 * @returns {bool}
	 * */
	get RadarShowGrid()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_GetIsShowGrid(this.radarHandle,value);
		}
	}

	/**
	 * 设置雷达显隐
	 *  @param {bool} visible
	 * */
	set RadarVisible(visible)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_visible(this.radarHandle,visible);
		}
	}
	/**
	 * 获取雷达显隐
	 *  @returns {bool}
	 * */
	get RadarVisible()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_visible(this.radarHandle);
		}
	}
	/**
	 * 设置雷达包络显示模式
	 *  @param {bool} value 设置为true时 二维模式下 雷达包络显示为一个空心圆圈
	 * */
	set RadarPlaneModel(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_PlaneModel(this.radarHandle,value)
		}
	}
	/**
	 * 获取雷达包络是否为二维空心圆模式
	 *  @returns {bool}
	 * */
	get RadarPlaneModel()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_planeModel(this.radarHandle);
		}
	}
	/**
	* 设置雷达的发射功率 W 默认值pow(10, 6);
	*  @param {Double} value
	* */
	set RadarPt(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Pt(this.radarHandle,value);
		}
	}
	/**
	* 获取雷达的发射功率 W
    * @returns {Double}
	* */
	get RadarPt()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Pt(this.radarHandle);
		}
	}
	/**
	* 设置雷达的天线主瓣增益 db 默认值40
	*  @param {Double}
	* */
	set RadarGt(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Gt(this.radarHandle,value);
		}
	}
	/**
	* 获取雷达的天线主瓣增益 db
	 * @returns {Double}
	* */
	get RadarGt()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Gt(this.radarHandle);
		}
	}
	/**
	 * 设置信号波长 m 默认值0.056
	 *  @param {Double}
	 * */
	set RadarLanBuda(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_lanBuda(this.radarHandle,value);
		}
	}
	/**
	 * 获取信号波长m
	 * @returns {Double}
	 * */
	get RadarLanBuda()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_lanBuda(this.radarHandle);
		}
	}
	/**
	 * 设置目标的雷达反射截面积 m2 默认值3
	 *  @param {Double}
	 * */
	set RadarThegema(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_thegema(this.radarHandle,value);
		}
	}
	/**
	 * 获取目标的雷达反射截面积 m2 默认值3
	 * @returns {Double}
	 * */
	get RadarThegema()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_thegema(this.radarHandle);
		}
	}
	/**
	 * 设置脉冲积累数 默认值16
	 *  @param {Double}
	 * */
	set RadarN(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_n(this.radarHandle,value);
		}
	}
	/**
	 * 获取脉冲积累数
	 * @returns {Double}
	 * */
	get RadarN()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_n(this.radarHandle);
		}
	}
	/**
	 * 设置玻尔兹曼常数 默认值1.38 * pow(10, -23)
	 *  @param {Double}
	 * */
	set RadarK(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_k(this.radarHandle,value);
		}
	}
	/**
	 * 获取玻尔兹曼常数 默认值1.38 * pow(10, -23)
	 * @returns {Double}
	 * */
	get RadarK()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_k(this.radarHandle);
		}
	}
	/**
	 * 设置接收机通频带宽度  默认值1.6* Math.pow(10, 2)
	 *  @param {Double}
	 * */
	set RadarBn(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Bn(this.radarHandle,value);
		}
	}
	/**
	 * 获取接收机通频带宽度 默认值1.6* Math.pow(10, 2)
	 * @returns {Double}
	 * */
	get RadarBn()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Bn(this.radarHandle);
		}
	}
	/**
	 * 设置雷达接收机噪声系数 默认值10
	 *  @param {Double}
	 * */
	set RadarFn(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Fn(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达接收机噪声系数 默认值10
	 * @returns {Double}
	 * */
	get RadarFn()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Fn(this.radarHandle);
		}
	}
	/**
	 * 设置雷达接收机最小可检测信噪比 默认值13
	 *  @param {Double}
	 * */
	set RadarS_Delta_N(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_S_Delta_N(this.radarHandle,value);
		}
	}
	/**
	 * 获取 雷达接收机最小可检测信噪比
	 * @returns {Double}
	 * */
	get RadarS_Delta_N()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_S_Delta_N(this.radarHandle);
		}
	}
	/**
	 * 设置雷达接收机噪声温度 以绝对温度表示 默认值290
	 *  @param {Double}
	 * */
	set RadarT0(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_T0(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达接收机噪声温度 以绝对温度表示
	 * @returns {Double}
	 * */
	get RadarT0()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_T0(this.radarHandle);
		}
	}
	/**
	 * 设置开始方位角 范围[0,360] 度 默认0°
	 *  @param {Double}
	 * */
	set RadarAz_Start_Angle(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Az_Start_Angle(this.radarHandle,value);
		}
	}
	/**
	 * 获取开始方位角 范围[0,360] 度 默认0°
	 * @returns {Double}
	 * */
	get RadarAz_Start_Angle()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Az_Start_Angle(this.radarHandle);
		}
	}
	/**
	 * 设置结束方位角 范围[0,360] 度 默认360°
	 *  @param {Double}
	 * */
	set RadarAz_End_Angle(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Az_End_Angle(this.radarHandle,value);
		}
	}
	/**
	 * 获取结束方位角 范围[0,360] 度 默认360°
	 * @returns {Double}
	 * */
	get RadarAz_End_Angle()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Az_End_Angle(this.radarHandle);
		}
	}

	// double		EMSCRIPTEN_KEEPALIVE radar_get_param_Pitch_Start_Angle(intptr_t ptr);
	// void		EMSCRIPTEN_KEEPALIVE radar_set_param_Pitch_Start_Angle(intptr_t ptr, double value);
	/**
	 * 设置开始俯仰角 范围(-90, 90)
	 *  @param {Double}
	 * */
	set RadarPitch_Start_Angle(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Pitch_Start_Angle(this.radarHandle,value);
		}
	}
	/**
	 * 获取开始俯仰角 范围(-90, 90)
	 * @returns {Double}
	 * */
	get RadarPitch_Start_Angle()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Pitch_Start_Angle(this.radarHandle);
		}
	}
	/**
	 * 设置结束俯仰角 范围(-90, 90)
	 *  @param {Double} 默认
	 * */
	set RadarPitch_End_Angle(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_Pitch_End_Angle(this.radarHandle,value);
		}
	}
	/**
	 * 获取结束俯仰角 范围(-90, 90)
	 * @returns {Double}
	 * */
	get RadarPitch_End_Angle()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_Pitch_End_Angle(this.radarHandle);
		}
	}
	/**
	 * 设置雷达包络主色 rgba格式  当传入参数为rgb时 默认透明度设为0.8
	 *  @param {string} color  包络颜色 例如 'rgba(255, 0, 0, 0.5)'或者 'rgb(255, 0, 0)'
	 * */
	set RadarColor(color)
	{
		this.radarColor=color;
		if (this.radarHandle!==null){
			if (/^rgba\(/.test(color)){
				// const matchRGBA = color.match(/rgba\((\d+), (\d+), (\d+), (\d*\.?\d+)\)$/);
				const matchRGBA = this.radarColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
				if (matchRGBA){
					RadarModule._radar_set_color(this.radarHandle,matchRGBA[1]/255,  matchRGBA[2]/255,  matchRGBA[3]/255, matchRGBA[4]);
					this.radarAlpha = matchRGBA[4];
				}
			}
			else if (/^rgb\(/.test(color)){
				const matchRGB = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				if (matchRGB){
					RadarModule._radar_set_color(this.radarHandle,matchRGB[1]/255,  matchRGB[2]/255,  matchRGB[3]/255, this.radarAlpha);
					this.radarColor='rgba('+matchRGB[1]+', '+matchRGB[2]+', '+matchRGB[3]+', '+this.radarAlpha+')';
				}
			}

			else if (/^#([0-9a-f]{6})$/i.test(color)){
				let t = {},
					bits = (color.length === 4) ? 4 : 8,//假设是shorthand。 #fff, 那么bits为4位, 每一位代表的个属性, 其他的为8位 每两位代表一个属性 #ffffff00
					mask = (1 << bits) - 1; //表示字节占位符。 向左移4位或8位，var a = (1 << 4 ) - 1 -> 10000 - 1,  a.toString(2); // 1111。或者 8位的 1111 1111
				color = Number("0x" + color.substr(1)); //#ff0000 转变为16进制0xff0000;
				if(isNaN(color)){
					return null; // Color
				}
				["b", "g", "r"].forEach(function(x){
					let c = color & mask;
					color >>= bits;
					t[x] = bits === 4 ? 17 * c : c; // 0xfff ， 一个f应该代表 255, 应该当[0-255]，按15等份划分，每一等份间隔 17。
					//所以获得的值须要乘以17, 才干表示rgb中255的值
				});
				if (t){
					RadarModule._radar_set_color(this.radarHandle,t.r/255,  t.g/255, t.b/255, this.radarAlpha);
					this.radarColor='rgba('+t.r+', '+t.g+', '+t.b+', '+this.radarAlpha+')';
				}
			}
			else {
				console.log('雷达包络颜色设置无效！');
			}

		}
	}
	/**
	 * 获取雷达包络主色
	 * @returns {string}
	 * */
	get RadarColor()
	{
		if (this.radarHandle!==null){
			return this.radarColor;
		}
	}

	/**
	 * 设置雷达包络颜色 hex格式 透明度默认为0.8 此方法会逐渐弃用 请使用 RadarColor代替 2024年9月9日
	 * @param {string} hexCorlor  包络颜色 例 #FFFFFF
	 */
	RadarHexColor(hexColor)
	{
		let t = {},
			bits = (hexColor.length === 4) ? 4 : 8,//假设是shorthand。 #fff, 那么bits为4位, 每一位代表的个属性, 其他的为8位 每两位代表一个属性 #ffffff00
			mask = (1 << bits) - 1; //表示字节占位符。 向左移4位或8位，var a = (1 << 4 ) - 1 -> 10000 - 1,  a.toString(2); // 1111。或者 8位的 1111 1111
		hexColor = Number("0x" + hexColor.substr(1)); //#ff0000 转变为16进制0xff0000;
		if(isNaN(hexColor)){
			return null; // Color
		}
		["b", "g", "r"].forEach(function(x){
			let c = hexColor & mask;
			hexColor >>= bits;
			t[x] = bits === 4 ? 17 * c : c; // 0xfff ， 一个f应该代表 255, 应该当[0-255]，按15等份划分，每一等份间隔 17。
			//所以获得的值须要乘以17, 才干表示rgb中255的值
		});
		if (t){
			RadarModule._radar_set_color(this.radarHandle,t.r/255,  t.g/255, t.b/255, this.radarAlpha);
			this.radarColor='rgba('+t.r+', '+t.g+', '+t.b+', '+this.radarAlpha+')';
		}
	}

	/**
	 * 设置雷达包络透明度
	 *  @param {double}
	 * */
	set RadarAlpha(value)
	{
		this.radarAlpha = value;
		if (this.radarHandle!==null){
			if (/^rgba\(/.test(this.radarColor)){
				const matchRGBA = this.radarColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
				if (matchRGBA){
					RadarModule._radar_set_color(this.radarHandle,matchRGBA[1]/255,  matchRGBA[2]/255,  matchRGBA[3]/255, value);
					this.radarColor='rgba('+matchRGBA[1]+', '+matchRGBA[2]+', '+matchRGBA[3]+','+value+')';
				}
			}
		}
	}
	/**
	 * 获取雷达包络透明度
	 *  @param {bool}
	 * */
	get RadarAlpha()
	{
/*		if (this.radarHandle!==null){
			if (/^rgba\(/.test(this.radarColor)){
				const matchRGBA = this.radarColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
				if (matchRGBA){
					return matchRGBA[4];
				}
			}
		}*/
		return this.radarAlpha;
	}

	/**
	 * 设置雷达包络是否混合色
	 *  @param {bool}
	 * */
	set RadarBlendWithcolorTable(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_blendWithcolorTable(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达包络是否混合色
	 *  @@returns {bool}
	 * */
	get RadarBlendWithcolorTable()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_blendWithcolorTable(this.radarHandle);
		}
	}
	/**
	 * 设置是否雷达包络填充面
	 *  @param {bool}
	 * */
	set RadarFill(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_SetIsShowSolid(this.radarHandle,value);
		}
	}
	/**
	 * 获取是否雷达包络填充面
	 *  @returns {bool}
	 * */
	get RadarFill()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_GetIsShowSolid(this.radarHandle);
		}
	}
	/**
	 * 设置雷达参数失效 用于固定半径时调用该接口 请根据需求调用
	 *  @param {bool}
	 * */
	set RadarParamMissing(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_missing(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达参数失效 与否
	 *  @@returns  {bool}
	 * */
	get RadarParamMissing()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_missing(this.radarHandle);
		}
	}
	/**
	 * 设置雷达半径 单位m 默认值100000
	 *  @param {double}
	 * */
	set RadarRadius(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_radius(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达半径 单位m
	 * @returns {Double}
	 * */
	get RadarRadius()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_radius(this.radarHandle);
		}
	}
	/**
	 * 设置天线图主瓣水平宽度，单位度 默认值15
	 *  @param {Double}
	 * */
	set RadarLobeWidth_h(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_lobeWidth_h(this.radarHandle,value);
		}
	}
	/**
	 * 获取天线图主瓣水平宽度，单位度 默认值15
	 * @returns {Double}
	 * */
	get RadarLobeWidth_h()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_lobeWidth_h(this.radarHandle);
		}
	}
	// double		EMSCRIPTEN_KEEPALIVE radar_get_param_lobeWidth_v(intptr_t ptr);
	// void		EMSCRIPTEN_KEEPALIVE radar_set_param_lobeWidth_v(intptr_t ptr, double value);
	/**
	 * 设置天线图主瓣垂直宽度，单位度 默认10
	 *  @param {Double}
	 * */
	set RadarLobeWidth_v(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_lobeWidth_v(this.radarHandle,value);
		}
	}
	/**
	 * 获取天线图主瓣垂直宽度，单位度 默认10
	 * @returns {Double}
	 * */
	get RadarLobeWidth_v()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_lobeWidth_v(this.radarHandle);
		}
	}
	/**
	 * 设置天线图主瓣半功率水平宽度，单位度 默认值7
	 *  @param {Double}
	 * */
	set RadarLobeWidth_halfPt_h(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_lobeWidth_halfPt_h(this.radarHandle,value);
		}
	}
	/**
	 * 获取天线图主瓣半功率水平宽度，单位度 默认值7
	 * @returns {Double}
	 * */
	get RadarLobeWidth_halfPt_h()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_lobeWidth_halfPt_h(this.radarHandle);
		}
	}
	/**
	 * 设置天线图主瓣半功率垂直宽度，单位度 默认1.5
	 *  @param {Double}
	 * */
	set RadarLobeWidth_halfPt_v(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_lobeWidth_halfPt_v(this.radarHandle,value);
		}
	}
	/**
	 * 获取天线图主瓣半功率垂直宽度，单位度 默认1.5
	 * @returns {Double}
	 * */
	get RadarLobeWidth_halfPt_v()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_lobeWidth_halfPt_v(this.radarHandle);
		}
	}
	/**
	 * 设置 计算天线图的比例常数 默认0.07
	 *  @param {Double}
	 * */
	set RadarLobeK(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_lobeK(this.radarHandle,value);
		}
	}
	/**
	 * 获取计算天线图的比例常数 默认0.07
	 * @returns {Double}
	 * */
	get RadarLobeK()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_lobeK(this.radarHandle);
		}
	}
	/**
	 * 设置雷达天线的速度 默认0.0001
	 *  @param {Double}
	 * */
	set RadarAntenaSpeed(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_RadarAntenaSpeed(this.radarHandle,value);
		}
	}
	/**
	 * 获取设置雷达天线的速度 默认0.0001
	 * @returns {Double}
	 * */
	get RadarAntenaSpeed()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_RadarAntenaSpeed(this.radarHandle);
		}
	}
	/**
	 * 设置雷达天线的方位角 默认值45
	 *  @param {Double}
	 * */
	set RadarAntenaDirAngle(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_RadarAntenaDirAngle(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达天线的方位角 默认值10
	 * @returns {Double}
	 * */
	get RadarAntenaDirAngle()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_RadarAntenaDirAngle(this.radarHandle);
		}
	}
	// double		EMSCRIPTEN_KEEPALIVE radar_get_param_RadarAntenaR_E(intptr_t ptr);
	// void		EMSCRIPTEN_KEEPALIVE radar_set_param_RadarAntenaR_E(intptr_t ptr, double value);
	/**
	 * 设置雷达天线俯仰角 默认0
	 *  @param {Double}
	 * */
	set RadarAntenaPitchAngle(value)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_set_param_RadarAntenaPitchAngle(this.radarHandle,value);
		}
	}
	/**
	 * 获取雷达天线俯仰角 默认0
	 * @returns {Double}
	 * */
	get RadarAntenaPitchAngle()
	{
		if (this.radarHandle!==null){
			return RadarModule._radar_get_param_RadarAntenaPitchAngle(this.radarHandle);
		}
	}
	/**
	 * 设置雷达天线主色 rgba格式  当传入参数为rgb时 默认透明图设为0.8
	 *  @param {string} color  天线颜色 例如 'rgba(255, 0, 0, 0.5)'或者 'rgb(255, 0, 0)' 或者hex格式 #FFFFFF
	 * */
	set RadarAntenaColor(color)
	{
		this.antenaColor=color;
		if (this.radarHandle!==null){
			if (/^rgba\(/.test(color)){
				// const matchRGBA = color.match(/rgba\((\d+), (\d+), (\d+), (\d*\.?\d+)\)$/);
				const matchRGBA = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
				if (matchRGBA){
					RadarModule._radar_set_antena_color(this.radarHandle,matchRGBA[1]/255,  matchRGBA[2]/255,  matchRGBA[3]/255, matchRGBA[4]);
					// tritonObject.SetAmbientLight(match[1],  match[2],  match[3]);
				}
			}
			else if (/^rgb\(/.test(color)){
				const matchRGB = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				if (matchRGB){
					RadarModule._radar_set_antena_color(this.radarHandle,matchRGB[1]/255,  matchRGB[2]/255,  matchRGB[3]/255, 0.8);
					this.antenaColor='rgba('+matchRGB[1]+', '+matchRGB[2]+', '+matchRGB[3]+', 0.8)';;
				}
			}
			else if (/^#([0-9a-f]{6})$/i.test(color)){
				let t = {},
					bits = (color.length === 4) ? 4 : 8,//假设是shorthand。 #fff, 那么bits为4位, 每一位代表的个属性, 其他的为8位 每两位代表一个属性 #ffffff00
					mask = (1 << bits) - 1; //表示字节占位符。 向左移4位或8位，var a = (1 << 4 ) - 1 -> 10000 - 1,  a.toString(2); // 1111。或者 8位的 1111 1111
				color = Number("0x" + color.substr(1)); //#ff0000 转变为16进制0xff0000;
				if(isNaN(color)){
					return null; // Color
				}
				["b", "g", "r"].forEach(function(x){
					let c = color & mask;
					color >>= bits;
					t[x] = bits === 4 ? 17 * c : c; // 0xfff ， 一个f应该代表 255, 应该当[0-255]，按15等份划分，每一等份间隔 17。
					//所以获得的值须要乘以17, 才干表示rgb中255的值
				});
				if (t){
					RadarModule._radar_set_antena_color(this.radarHandle,t.r/255,  t.g/255, t.b/255, 0.8);
					this.antenaColor='rgba('+t.r+', '+t.g+', '+t.b+', 0.8)';
				}
			}
			else {
				console.log('天线颜色设置无效');
			}
			// RadarModule._radar_set_antena_color(this.radarHandle,r,g,b,a);
		}
	}
	/**
	 * 获取雷达天线主色
	 * @returns {string}
	 * */
	get RadarAntenaColor()
	{
		if (this.radarHandle!==null){
			return this.antenaColor;
		}
	}

	/**
	 * 设置雷达天线颜色 hex格式 透明度默认为0.8 此方法弃用 请使用    RadarAntenaColor(color)
	 * @param {string} hexCorlor  组网颜色 #FFFFFF
	 */
	RadarAntenaHexColor(hexColor)
	{
		let t = {},
			bits = (hexColor.length === 4) ? 4 : 8,//假设是shorthand。 #fff, 那么bits为4位, 每一位代表的个属性, 其他的为8位 每两位代表一个属性 #ffffff00
			mask = (1 << bits) - 1; //表示字节占位符。 向左移4位或8位，var a = (1 << 4 ) - 1 -> 10000 - 1,  a.toString(2); // 1111。或者 8位的 1111 1111
		hexColor = Number("0x" + hexColor.substr(1)); //#ff0000 转变为16进制0xff0000;
		if(isNaN(hexColor)){
			return null; // Color
		}
		["b", "g", "r"].forEach(function(x){
			let c = hexColor & mask;
			hexColor >>= bits;
			t[x] = bits === 4 ? 17 * c : c; // 0xfff ， 一个f应该代表 255, 应该当[0-255]，按15等份划分，每一等份间隔 17。
			//所以获得的值须要乘以17, 才干表示rgb中255的值
		});
		if (t){
			RadarModule._radar_set_antena_color(this.radarHandle,t.r/255,  t.g/255, t.b/255, 0.8);
			this.antenaColor='rgba('+t.r+', '+t.g+', '+t.b+', 0.8)';
		}
	}
/*	let Pj = 10;//干扰机发射功率
	double Gj = 10;//干扰机的发射增益
	double Bj = 2 * pow(10, 6);//干扰机进入雷达天线的信号带宽
	double Yj = 0.5;//为雷达天线接收干扰机信号的极化损耗
	double Kj = 2;//为指定的压制系数
	double K = 0.8;//为雷达天线的方向性系数0.04-0.1
	double Theta_Half = 20;// 雷达半功率波束宽度 单位度*/
	// radar_add_disturb(intptr_t ptr, double pj, double gj, double bj, double yj, double kj, double k, double theta)
	/**
	 * 添加雷达压制信息
     * @param {EarthRadar.RadarDisturb} RadarDisturb 
	 * */
	Add_disturb(RadarDisturb)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_disturb_bind(this.radarHandle, RadarDisturb.radarDisturbHandle);
			this.Update();
		}
	}
	/**
	 * 解绑雷达压制信息 注:一个压制对象可以与多个雷达绑定 这里只是解绑这个雷达压制
     * @param {EarthRadar.RadarDisturb} RadarDisturb 
	 * */
	Remove_disturb(RadarDisturb)
	{
		if (this.radarHandle!==null){
			RadarModule._radar_disturb_unbind(this.radarHandle,RadarDisturb.radarDisturbHandle);
		}
	}
	/**
	 * 更新雷达 只要雷达参数或压制参数变化后 都需要调一下这个方法
	 * 2024年9月9日后 此方法弃用 为了兼容之前项目中的应用 暂时保留该接口名称
	 *
	 * */
	Update()
	{
		if (this.radarHandle!==null){
			// RadarModule._radar_update(this.radarHandle);
		}
	}


}

/**
 * @vuepress
 *
 * ---
 * title: EarthRadar SDK
 * headline: 雷达插件模块
 * ---
 */
/**
   * 创建雷达干扰对象
   * @name RadarDisturb
   * @class RadarDisturb
   * 雷达干扰操作函数
   * @example
   * let radardisturb = new EarthRadar.RadarDisturb();
   */

class RadarDisturb {
	constructor() {
		this.radarDisturbHandle = RadarModule._radar_disturb_create();
		this.disturbParam={
			_pj: 10,//干扰机发射功率
			_gj: 10,//干扰机的发射增益
			_bj:  2 * Math.pow(10, 6),//干扰机进入雷达天线的信号带宽
			_yj:  0.5,//为雷达天线接收干扰机信号的极化损耗
			_kj: 2,//为指定的压制系数
			_k:  0.8,//为雷达天线的方向性系数0.04-0.1
			_theta:  20,// 雷达半功率波束宽度 单位度
			_longitude: 1,
			_latitude: 1,
			_height: 1000
		};
		// this.UpdatedisturbPosition(this.disturbParam._longitude,this.disturbParam._latitude,this.disturbParam._height);
	}
	// radar_disturb_set_param(intptr_t ptrDisturb, double pj, double gj, double bj, double yj, double kj, double k, double theta)
	/**
	* 设置雷达干扰机位置
    * @param {Number} [longitude=1]  经度
    * @param {Number} [latitude=1]  纬度
    * @param {Number} [height=1000] 高度
	*/
	UpdatedisturbPosition( longitude=1, latitude=1, height=1000)
	{
		this.disturbParam._longitude=longitude;
		this.disturbParam._latitude=latitude;
		this.disturbParam._height=height;
		if(this.radarDisturbHandle){
			RadarModule._radar_disturb_set_pos(this.radarDisturbHandle,longitude, latitude, height);
		}
	}
	/**
	 * 设置干扰机发射功率 默认10 ;
	 *  @param {Double} 
	 * */
	set DisturbPj(value)
	{
		this.disturbParam._pj=value;
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_set_param(this.radarDisturbHandle, this.disturbParam._pj, this.disturbParam._gj, this.disturbParam._bj, this.disturbParam._yj, this.disturbParam._kj, this.disturbParam._k, this.disturbParam._theta);
		}
	}
	/**
	 * 获取干扰机发射功率 默认10 ;
	 * @returns {Double}
	 * */
	get DisturbPj()
	{
		return this.disturbParam._pj;
	}

	/**
	 * 设置干扰机的发射增益  默认10 ;
	 *  @param {Double}
	 * */
	set DisturbGj(value)
	{
		this.disturbParam._gj=value;
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_set_param(this.radarDisturbHandle, this.disturbParam._pj, this.disturbParam._gj, this.disturbParam._bj, this.disturbParam._yj, this.disturbParam._kj, this.disturbParam._k, this.disturbParam._theta);
		}
	}
	/**
	 * 获取干扰机的发射增益  默认10 ;
	 * @returns {Double}
	 * */
	get DisturbGj()
	{
		return this.disturbParam._gj;
	}
	/**
	 * 设置干扰机进入雷达天线的信号带宽  默认 2 * Math.pow(10, 6) ;
	 *  @param {Double}
	 * */
	set DisturbBj(value)
	{
		this.disturbParam._bj=value;
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_set_param(this.radarDisturbHandle, this.disturbParam._pj, this.disturbParam._gj, this.disturbParam._bj, this.disturbParam._yj, this.disturbParam._kj, this.disturbParam._k, this.disturbParam._theta);
		}
	}
	/**
	 * 获取干扰机进入雷达天线的信号带宽  默认 2 * Math.pow(10, 6) ;
	 * @returns {Double}
	 * */
	get DisturbBj()
	{
		return this.disturbParam._bj;
	}
	/**
	 * 设置雷达天线接收干扰机信号的极化损耗  默认0.5 ;
	 *  @param {Double}
	 * */
	set DisturbYj(value)
	{
		this.disturbParam._yj=value;
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_set_param(this.radarDisturbHandle, this.disturbParam._pj, this.disturbParam._gj, this.disturbParam._bj, this.disturbParam._yj, this.disturbParam._kj, this.disturbParam._k, this.disturbParam._theta);
		}
	}
	/**
	 * 获取雷达天线接收干扰机信号的极化损耗 默认0.5 ;
	 * @returns {Double}
	 * */
	get DisturbYj()
	{
		return this.disturbParam._yj;
	}
	/**
	 * 设置干扰机干扰机的压制系数  默认 2 ;
	 *  @param {Double}
	 * */
	set DisturbKj(value)
	{
		this.disturbParam._kj=value;
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_set_param(this.radarDisturbHandle, this.disturbParam._pj, this.disturbParam._gj, this.disturbParam._bj, this.disturbParam._yj, this.disturbParam._kj, this.disturbParam._k, this.disturbParam._theta);
		}
	}
	/**
	 * 获取干扰机干扰机的压制系数  默认 2 ;
	 * @returns {Double}
	 * */
	get DisturbKj()
	{
		return this.disturbParam._kj;
	}
	/**
	 * 设置干扰机干扰机雷达天线的方向性系数  默认0.8 ;
	 *  @param {Double}
	 * */
	set DisturbK(value)
	{
		this.disturbParam._k=value;
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_set_param(this.radarDisturbHandle, this.disturbParam._pj, this.disturbParam._gj, this.disturbParam._bj, this.disturbParam._yj, this.disturbParam._kj, this.disturbParam._k, this.disturbParam._theta);
		}
	}
	/**
	 * 获取干扰机干扰机雷达天线的方向性系数  默认0.8 ;
	 * @returns {double}
	 * */
	get DisturbK()
	{
		return this.disturbParam._k;
	}
	/**
	 * 设置干扰机干扰机雷达半功率波束宽度 单位度 默认20 ;
	 *  @param {Double}
	 * */
	set DisturbTheta(value)
	{
		this.disturbParam._theta=value;
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_set_param(this.radarDisturbHandle, this.disturbParam._pj, this.disturbParam._gj, this.disturbParam._bj, this.disturbParam._yj, this.disturbParam._kj, this.disturbParam._k, this.disturbParam._theta);
		}
	}
	/**
	 * 获取干扰机干扰机雷达半功率波束宽度 单位度 默认20 ;
	 * @returns {Double}
	 * */
	get DisturbTheta()
	{
		return this.disturbParam._theta;
	}
	/**
	 * 删除压制信息 注:一个压制对象可以与多个雷达绑定 若删除后  使用改对象绑定的雷达 都将失去压制信息  请谨慎使用
	 * */
	Delete_disturb()
	{
		if (this.radarDisturbHandle!==null){
			RadarModule._radar_disturb_release(this.radarDisturbHandle);
		}

	}
}

 /**
  * @vuepress
  *
  * ---
  * title: EarthRadar SDK
  * headline: 雷达插件模块
  * ---
  */
 /**
  * 创建电磁波对象
  * @name DisturbWave
  * @class DisturbWave
  * 电磁波对象操作函数
  * @example
  * let magneticsWave = new EarthRadar.MagneticsWave();
  */
 class MagneticsWave {
	 constructor() {
		 this.magneticsWaveHandle = RadarModule._radar_wave_create();
		 this.magneticsWaveColor = 'rgba(255, 0, 0, 0.8)';//电磁波颜色
		 this.magneticsWaveAlpha = 0.8;//电磁波透明度
		 this.startPosition = {
			 longitude:1,
			 latitude:1,
			 height:0
		 };
		 this.endPosition = {
			 longitude:1,
			 latitude:1,
			 height:0
		 };
		 this.viewer = null;

		 // this.MagneticsWaveParam = {
			//  _pj: 10,//干扰机发射功率
			//  _gj: 10,//干扰机的发射增益
	 }
	 /**
	  * 设置电磁波类型 type 0 圆形，1 扇型
	  *  @param {int} type
	  * */
	 set MagneticsWaveType(type)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_type(this.magneticsWaveHandle,type);
		 }
	 }
	 /**
	  * 获取电磁波 类型 type 0 圆形，1 扇型
	  *  @returns {int}
	  * */
	 get MagneticsWaveType()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_type(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波显隐
	  *  @param {bool} visible
	  * */
	 set MagneticsWaveVisible(visible)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_visible(this.magneticsWaveHandle,visible);
		 }
	 }
	 /**
	  * 获取电磁波显隐
	  *  @returns {bool}
	  * */
	 get MagneticsWaveVisible()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_visible(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波颜色 rgba格式  当传入参数为rgb时 默认透明度设为0.8
	  *  @param {string} color  电磁波 例如 'rgba(255, 0, 0, 0.5)'或者 'rgb(255, 0, 0)'
	  * */
	 set MagneticsWaveColor(color)
	 {
		 this.magneticsWaveColor=color;
		 if (this.magneticsWaveHandle!==null){
			 if (/^rgba\(/.test(color)){
				 // const matchRGBA = color.match(/rgba\((\d+), (\d+), (\d+), (\d*\.?\d+)\)$/);
				 const matchRGBA = this.magneticsWaveColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
				 if (matchRGBA){
					 RadarModule._radar_wave_set_color(this.magneticsWaveHandle,matchRGBA[1]/255,  matchRGBA[2]/255,  matchRGBA[3]/255, matchRGBA[4]);
					 this.magneticsWaveAlpha = matchRGBA[4];
				 }
			 }
			 else if (/^rgb\(/.test(color)){
				 const matchRGB = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				 if (matchRGB){
					 RadarModule._radar_wave_set_color(this.magneticsWaveHandle,matchRGB[1]/255,  matchRGB[2]/255,  matchRGB[3]/255, this.magneticsWaveAlpha);
					 this.magneticsWaveColor='rgba('+matchRGB[1]+', '+matchRGB[2]+', '+matchRGB[3]+', '+this.magneticsWaveAlpha+')';
				 }
			 }

			 else if (/^#([0-9a-f]{6})$/i.test(color)){
				 let t = {},
					 bits = (color.length === 4) ? 4 : 8,//假设是shorthand。 #fff, 那么bits为4位, 每一位代表的个属性, 其他的为8位 每两位代表一个属性 #ffffff00
					 mask = (1 << bits) - 1; //表示字节占位符。 向左移4位或8位，var a = (1 << 4 ) - 1 -> 10000 - 1,  a.toString(2); // 1111。或者 8位的 1111 1111
				 color = Number("0x" + color.substr(1)); //#ff0000 转变为16进制0xff0000;
				 if(isNaN(color)){
					 return null; // Color
				 }
				 ["b", "g", "r"].forEach(function(x){
					 let c = color & mask;
					 color >>= bits;
					 t[x] = bits === 4 ? 17 * c : c; // 0xfff ， 一个f应该代表 255, 应该当[0-255]，按15等份划分，每一等份间隔 17。
					 //所以获得的值须要乘以17, 才干表示rgb中255的值
				 });
				 if (t){
					 RadarModule._radar_wave_set_color(this.magneticsWaveHandle,t.r/255,  t.g/255, t.b/255, this.magneticsWaveAlpha);
					 this.magneticsWaveColor='rgba('+t.r+', '+t.g+', '+t.b+', '+this.magneticsWaveAlpha+')';
				 }
			 }
			 else {
				 console.log('电磁波颜色设置无效！');
			 }

		 }
	 }
	 /**
	  * 获取电磁波颜色
	  * @returns {string}
	  * */
	 get MagneticsWaveColor()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return this.magneticsWaveColor;
		 }
	 }

	 /**
	  * 设置电磁波透明度
	  *  @param {double}
	  * */
	 set MagneticsWaveAlpha(value)
	 {
		 this.magneticsWaveAlpha = value;
		 if (this.magneticsWaveHandle!==null){
			 if (/^rgba\(/.test(this.magneticsWaveColor)){
				 const matchRGBA = this.magneticsWaveColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
				 if (matchRGBA){
					 RadarModule._radar_wave_set_color(this.magneticsWaveHandle,matchRGBA[1]/255,  matchRGBA[2]/255,  matchRGBA[3]/255, value);
					 this.magneticsWaveColor='rgba('+matchRGBA[1]+', '+matchRGBA[2]+', '+matchRGBA[3]+','+value+')';
				 }
			 }
		 }
	 }
	 /**
	  * 获取设置电磁波透明度
	  *  @param {bool}
	  * */
	 get MagneticsWaveAlpha()
	 {
		 return this.magneticsWaveColor;
	 }
	 /**
	  * 设置电磁波起点宽度
	  *  @param {double} value
	  * */
	 set MagneticsWaveStartWidth(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_startWidth(this.magneticsWaveHandle,value);
		 }
	 }
	 /**
	  * 获取电磁波起点宽度
	  *  @returns {double}
	  * */
	 get MagneticsWaveStartWidth()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_startWidth(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波终点宽度
	  *  @param {double} value
	  * */
	 set MagneticsWaveEndWidth(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_endWidth(this.magneticsWaveHandle,value);
		 }
	 }
	 /**
	  * 获取电磁波终点宽度
	  *  @returns {double}
	  * */
	 get MagneticsWaveEndWidth()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_endWidth(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波长度
	  *  @param {double} value
	  * */
	 set MagneticsWaveLength(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_length(this.magneticsWaveHandle, value)
		 }
	 }
	 /**
	  * 获取电磁波长度
	  *  @returns {double}
	  * */
	 get MagneticsWaveLength()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_length(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波是否自动长度
	  *  @param {bool} value
	  * */
	 set MagneticsWaveAutoLength(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_autoLength(this.magneticsWaveHandle, value)
		 }
	 }
	 /**
	  * 获取电磁波是否自动长度
	  *  @returns {bool}
	  * */
	 get MagneticsWaveAutoLength()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_autoLength(this.magneticsWaveHandle);
		 }
	 }

	 /**
	  * 设置电磁波速度
	  *  @param {double} value
	  * */
	 set MagneticsWaveSpeed(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_apertureSpeed(this.magneticsWaveHandle, value)
		 }
	 }
	 /**
	  * 获取电磁波速度
	  *  @returns {double}
	  * */
	 get MagneticsWaveSpeed()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_apertureSpeed(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波间隔
	  *  @param {double} value
	  * */
	 set MagneticsWaveInterval(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_apertureInterval(this.magneticsWaveHandle, value)
		 }
	 }
	 /**
	  * 获取电磁波间隔
	  *  @returns {double}
	  * */
	 get MagneticsWaveInterval()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_apertureInterval(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波半径 为扇形时 既type=1时设置
	  *  @param {double} value
	  * */
	 set MagneticsWaveRadius(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_radius(this.magneticsWaveHandle, value);
		 }
	 }
	 /**
	  * 获取电磁波半径 为扇形时 既type=1时设置
	  *  @returns {double}
	  * */
	 get MagneticsWaveRadius()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule. _radar_wave_get_radius(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波高度角 单位为度 为扇形时 既type=1时设置
	  *  @param {double} value
	  * */
	 set MagneticsWaveHeightAngle(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule._radar_wave_set_heightAngle(this.magneticsWaveHandle, value);
		 }
	 }
	 /**
	  * 获取电磁波高度角 单位为度 为扇形时 既type=1时设置
	  *  @returns {double}
	  * */
	 get MagneticsWaveHeightAngle()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_heightAngle(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波扇形的水平夹角 为扇形时 既type=1时设置
	  *  @param {double} value
	  * */
	 set MagneticsWaveWidthAngle(value)
	 {
		 if (this.magneticsWaveHandle!==null){
			 RadarModule. _radar_wave_set_widthAngle(this.magneticsWaveHandle, value);
		 }
	 }
	 /**
	  * 获取电磁波扇形的水平夹角 为扇形时 既type=1时设置
	  *  @returns {double}
	  * */
	 get MagneticsWaveWidthAngle()
	 {
		 if (this.magneticsWaveHandle!==null){
			 return RadarModule._radar_wave_get_widthAngle(this.magneticsWaveHandle);
		 }
	 }
	 /**
	  * 设置电磁波起点位置
	  * @param {Number} [longitude=1]  经度
	  * @param {Number} [latitude=1]  纬度
	  * @param {Number} [height=1000] 高度
	  */
	 SetMagneticsWaveStartPosition(longitude = 1, latitude = 1, height = 1000) {
		 if (this.magneticsWaveHandle) {
			 this.startPosition = {
				 longitude:longitude,
				 latitude:latitude,
				 height:height
			 };
			 if(this.viewer == null) return;
			 let viewer = this.viewer;
			 let center ;
			 if (viewer.scene.mode === Cesium.SceneMode.SCENE3D)
			 {
				 center = Cesium.Cartesian3.fromDegrees(this.startPosition.longitude,this.startPosition.latitude ,this.startPosition.height);
			 }
			 else {
				 const projection = viewer.scene.mapProjection;
				 let input = new Cesium.Cartographic(degreesToRadiansLongitude(this.startPosition.longitude), degreesToRadiansLatitude(this.startPosition.latitude),this.startPosition.height);
				 center = projection.project(input);
				 let x = center.x;
				 let y = center.y;
				 let z = center.z;
				 center.x = z;
				 center.y = x;
				 center.z = y;
			 }
			 RadarModule._radar_wave_set_startPnt(this.magneticsWaveHandle, center.x, center.y, center.z);
		 }
	 }
	 /**
	  * 设置电磁波终点点位置
	  * @param {Number} [longitude=1]  经度
	  * @param {Number} [latitude=1]  纬度
	  * @param {Number} [height=1000] 高度
	  */
	 SetMagneticsWaveEndPosition(longitude = 1, latitude = 1, height = 1000) {
		 if (this.magneticsWaveHandle) {
			 this.endPosition = {
				 longitude:longitude,
				 latitude:latitude,
				 height:height
			 };
			 if(this.viewer == null) return;
			 let viewer = this.viewer;
			 let center ;
			 if (viewer.scene.mode === Cesium.SceneMode.SCENE3D)
			 {
				 center = Cesium.Cartesian3.fromDegrees(this.endPosition.longitude,this.endPosition.latitude ,this.endPosition.height);
			 }
			 else {
				 const projection = viewer.scene.mapProjection;
				 let input = new Cesium.Cartographic(degreesToRadiansLongitude(this.endPosition.longitude), degreesToRadiansLatitude(this.endPosition.latitude),this.endPosition.height);
				 center = projection.project(input);
				 let x = center.x;
				 let y = center.y;
				 let z = center.z;
				 center.x = z;
				 center.y = x;
				 center.z = y;
			 }
			 RadarModule._radar_wave_set_endPnt(this.magneticsWaveHandle, center.x, center.y, center.z);
		 }
	 }
 }


 /**
  * @vuepress
  *
  * ---
  * title: EarthRadar SDK
  * headline: 雷达插件模块
  * ---
  */
 /**
  * 创建雷达组网对象
  * @name RadarGroup
  * @class RadarGroup
  * 雷达组网操作函数
  * @example
  * let radarGroup = new EarthRadar.RadarGroup();
  */

 class RadarGroup {
	 constructor() {
		 this.radarGroupHandle = RadarModule._radar_group_create();
	 }
	 /**
	  * 设置雷达组网颜色 当传入参数为rgb时 默认透明图设为0.8
	  * @param {string} color  组网颜色 'rgba(255, 0, 0, 0.5)'或者 'rgb(255, 0, 0)'
	  */
	 SetGroupColor(color)
	 {
		 if (this.radarGroupHandle!==null){
			 if (/^rgba\(/.test(color)){
				 // const matchRGBA = color.match(/rgba\((\d+), (\d+), (\d+), (\d*\.?\d+)\)$/);
				 const matchRGBA = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
				 if (matchRGBA){
					 RadarModule._radar_group_set_color(this.radarGroupHandle,matchRGBA[1]/255,  matchRGBA[2]/255,  matchRGBA[3]/255, matchRGBA[4]);
				 }
			 }
			 else if (/^rgb\(/.test(color)){
				 const matchRGB = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				 if (matchRGB){
					 RadarModule._radar_group_set_color(this.radarGroupHandle,matchRGB[1]/255,  matchRGB[2]/255,  matchRGB[3]/255, 0.8);
				 }
			 }
			 else if (/^#([0-9a-f]{6})$/i.test(color)){
				 let rgbCorlor=this.fromHex(color);
				 RadarModule._radar_group_set_color(this.radarGroupHandle, rgbCorlor.r/255,  rgbCorlor.g/255,  rgbCorlor.b/255,0.8);
			 }
			 else {
				 console.log('组网颜色设置无效！');
			 }
			 // RadarModule._radar_group_set_color(this.radarGroupHandle,r,g,b,a);
		 }
	 }
	 /**
	  * 设置雷达组网颜色 hex格式 透明度默认为0.8  此方法弃用 请使用SetGroupColor(color)
	  * @param {string} hexCorlor  组网颜色 #FFFFFF
	  */
	 SetGroupColorFromHex(hexCorlor)
	 {
		 if (this.radarGroupHandle!==null){
			 let rgbCorlor=this.fromHex(hexCorlor);
			 RadarModule._radar_group_set_color(this.radarGroupHandle, rgbCorlor.r/255,  rgbCorlor.g/255,  rgbCorlor.b/255,0.8);
		 }
	 }

	 /**
	  * 雷达对象添加组网
	  * @param {object} radarParam  雷达对象
	  */
	 AddRadarGroup(radarParam)
	 {
		 if (this.radarGroupHandle!==null && radarParam.radarHandle!==null){
			 RadarModule._radar_group_bind(this.radarGroupHandle,radarParam.radarHandle);
			 RadarModule._radar_group_update(this.radarGroupHandle);
		 }
	 }
	 /**
	  * 雷达对象移除组网
	  * @param {object} radarParam  雷达对象
	  */
	 RemoveRadarGroup(radarParam)
	 {
		 if (this.radarGroupHandle!==null && radarParam.radarHandle!==null){
			 RadarModule._radar_group_unbind(this.radarGroupHandle,radarParam.radarHandle);
			 RadarModule._radar_group_update(this.radarGroupHandle);
		 }
	 }
	 
	 Refresh()
	 {
	     if (this.radarGroupHandle!==null){
			 RadarModule._radar_group_update(this.radarGroupHandle);
		 }
	}
	 
	 /**
	  * 雷达对象数组添加组网
	  * @param {Arrobject} radarParam  雷达对象 [radarParam1,radarParam2,...]
	  */
	 AddRadarArrGroup(radarParamArr)
	 {
		 if (this.radarGroupHandle!==null){
			 if (radarParamArr&&radarParamArr.length>0){
				 for (let i=0;i<radarParamArr.length;i++)
				 {
					  if (radarParamArr[i].radarHandle!==null) {
						  RadarModule._radar_group_bind(this.radarGroupHandle, radarParamArr[i].radarHandle);
					  }
				 }
				 RadarModule._radar_group_update(this.radarGroupHandle);
			 }
		 }
	 }
	 /**
	  * 雷达对象数组移除组网
	  * @param {Arrobject} radarParam  雷达对象 [radarParam1,radarParam2,...]
	  */
	 RemoveRadarArrGroup(radarParamArr)
	 {
		 if (this.radarGroupHandle!==null){
			 if (radarParamArr&&radarParamArr.length>0){
				 for (let i=0;i<radarParamArr.length;i++)
				 {
					 if (radarParamArr[i].radarHandle!==null) {
						 RadarModule._radar_group_unbind(this.radarGroupHandle, radarParamArr[i].radarHandle);
						 RadarModule._radar_group_update(this.radarGroupHandle);
					 }
				 }
				 // RadarModule._radar_group_update(this.radarGroupHandle);
			 }
		 }
	 }
	 /**
	  * 删除雷达组网对象 这会删除已经组网得所有雷达组网信息 请慎用
	  * */
	 DeleteRadarGroup()
	 {
		 if (this.radarGroupHandle!==null){
			 RadarModule._radar_group_release(this.radarGroupHandle);
		 }

	 }

	 //hex颜色变rgb类型颜色 内部函数 外部无需调用
	 fromHex(hexColor){

		 let t = {},
			 bits = (hexColor.length === 4) ? 4 : 8,//假设是shorthand。 #fff, 那么bits为4位, 每一位代表的个属性, 其他的为8位 每两位代表一个属性 #ffffff00
			 mask = (1 << bits) - 1; //表示字节占位符。 向左移4位或8位，var a = (1 << 4 ) - 1 -> 10000 - 1,  a.toString(2); // 1111。或者 8位的 1111 1111
		 hexColor = Number("0x" + hexColor.substr(1)); //#ff0000 转变为16进制0xff0000;
		 if(isNaN(hexColor)){
			 return null; // Color
		 }
		 ["b", "g", "r"].forEach(function(x){
			 let c = hexColor & mask;
			 hexColor >>= bits;
			 t[x] = bits === 4 ? 17 * c : c; // 0xfff ， 一个f应该代表 255, 应该当[0-255]，按15等份划分，每一等份间隔 17。
			 //所以获得的值须要乘以17, 才干表示rgb中255的值
		 });

		 return t;	// RGB Color
	 }
 }
/**
   * 创建雷达对象
   * @name EarthRadarObject
   * @param {Cesium.Viewer} cesiumViewer
   * @class EarthRadarObject
   * 雷达、包络等对象操作函数
   * @example
   *  var viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayer: new Cesium.ImageryLayer(
            new Cesium.UrlTemplateImageryProvider({
                url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            })
        ),
        timeline: true,
        animation: false,
        useDefaultRenderLoop: false,
    });
     const tritonObject = new EarthRadar.EarthRadarObject(viewer);
    * @extends THREE.Mesh
   */


class EarthRadarObject  extends Cesium.Primitive  {

	constructor(cesiumViewer,options){
	    super(options)
		this.cesiumViewer = cesiumViewer;
		this.handle = null;

		//初始化
		if (cesiumViewer) {
			const canvas = cesiumViewer.canvas;
			if (!canvas.id) {
				canvas.id = "canvas";
			}

			//扩充包围盒，用来解决，当前对象，在three 中被裁切的问题；
			// var primitive = new EarthRadarBoxPrimitive();
			// cesiumViewer.scene.primitives.add(primitive);
			let strCanvas = new EarthRadarString(canvas.id);
			var gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
			if (gl)
			{
				gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
			}
			RadarModule._init(strCanvas.getHandle(), true, true);

			if (gl)
			{
				gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			}
			strCanvas.dispose();
			this.cesiumViewer = cesiumViewer;
		}
	}
	/**
	 * 设置雷达坐标系
	 * @param {coordsys} coordsys
	 *                 WGS84_ZUP = 0,   //cesium 立体模式
	 *                 WGS84_YUP,
	 *                 SPHERICAL_ZUP,
	 *                 SPHERICAL_YUP,
	 *                 FLAT_ZUP = 4,    //cesium 平面模式 SCENE2D
	 *                 FLAT_YUP,
	 * */
	SetRadarCoordsys(coordsys= 0){
		this.coordsys = coordsys;
		RadarModule._set_coordsys(coordsys);
	}

	/**
	 * 创建一个雷达
     * @param {EarthRadar.radarParam} radarParam 
	 * */
	CreateRadar(radarParam){
        let viewer = this.cesiumViewer;
        radarParam.viewer = viewer;
		const projection = viewer.scene.mapProjection;
		if (radarParam.radarHandle!==null){
			this.handle=radarParam.radarHandle;
			var modelRotation = Cesium.Matrix4.IDENTITY;

			let center ;
			if (viewer.scene.mode === Cesium.SceneMode.SCENE3D)
			{
				center = Cesium.Cartesian3.fromDegrees(radarParam.longitude,radarParam.latitude ,radarParam.height);
				var rotationY = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-radarParam.latitude)), new Cesium.Matrix4());
				var rotationZ = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(radarParam.longitude)), new Cesium.Matrix4());
				modelRotation = Cesium.Matrix4.multiply(rotationZ,rotationY, new Cesium.Matrix4());
			}
			else {
				let input = new Cesium.Cartographic(degreesToRadiansLongitude(radarParam.longitude), degreesToRadiansLatitude(radarParam.latitude), radarParam.height);
				 center = projection.project(input);
				let x = center.x;
				let y = center.y;
				let z = center.z;

				center.x = z;
				center.y = x;
				center.z = y;
			}

			let modelTranslate = Cesium.Matrix4.fromTranslation(center);
			let modelResult = Cesium.Matrix4.multiply(modelTranslate,modelRotation, new Cesium.Matrix4());
			let modulmatrix = new EarthRadarArray(Cesium.Matrix4.toArray(modelResult), EarthRadarArrayType.Float64);
			RadarModule._radar_set_model_matrix(radarParam.radarHandle,modulmatrix.getHandle());
			RadarModule._radar_set_pos(radarParam.radarHandle,radarParam.longitude,radarParam.latitude ,radarParam.height);
		}
	}
	/**
	 * 删除一个雷达
     * @param {EarthRadar.radarParam} radarParam 
	 * */
	DeleteRadar(radarParam){
		if (radarParam.radarHandle!==null){
			RadarModule._radar_release(radarParam.radarHandle);
			radarParam.radarHandle=null;
			// this.handle=null;
		}
	}
	/**
	 * 创建一个电磁波
	 * @param {MagneticsWave} magneticsWave
	 * */
	CreateMagneticsWave(magneticsWave){

		let viewer = this.cesiumViewer;
		magneticsWave.viewer = viewer;
		const projection = viewer.scene.mapProjection;
		if (magneticsWave.magneticsWaveHandle!==null){
			magneticsWave.SetMagneticsWaveStartPosition(magneticsWave.startPosition.longitude,magneticsWave.startPosition.latitude ,magneticsWave.startPosition.height);
			magneticsWave.SetMagneticsWaveEndPosition(magneticsWave.endPosition.longitude,magneticsWave.endPosition.latitude ,magneticsWave.endPosition.height);
		}
	}
	/**
	 * 删除一个电磁波
	 * @param {magneticsWave} magneticsWave
	 * */
	DeleteMagneticsWave(magneticsWave){
		if (magneticsWave.magneticsWaveHandle!==null){
			RadarModule._radar_wave_release(magneticsWave.magneticsWaveHandle);
			magneticsWave.magneticsWaveHandle=null;
		}
	}
	/**
	 * 删除所有雷达模块信息 释放所有资源 请谨慎使用
	 * */
	RemoveAll()
	{
		RadarModule._uninit();
	}
	//无需调用
	onAfterRender () {

		if (this.cesiumViewer) {
			let height = this.cesiumViewer.camera.positionCartographic.height;
			// if(height > 1143873.9349457726) return;
			if(height > 5143873.9349457726  && this.cesiumViewer.scene.mode ==3) return;

			let uniformState = this.cesiumViewer.scene.context.uniformState;
			var projectionMatrix = this.cesiumViewer.scene.camera.frustum.projectionMatrix;
			var viewMatrix0 = this.cesiumViewer.scene.camera.viewMatrix;

			//设置对数深度参数
			if (this.cesiumViewer.scene.logarithmicDepthBuffer) {
				const currentFrustum = uniformState.currentFrustum;
				const farDepthFromNearPlusOne = uniformState.farDepthFromNearPlusOne;
				const oneOverLog2FarDepthFromNearPlusOne = uniformState.oneOverLog2FarDepthFromNearPlusOne;
				// RadarModule._radar_set_log_depth(this.handle,true, currentFrustum.x, currentFrustum.y,
				// 	farDepthFromNearPlusOne, oneOverLog2FarDepthFromNearPlusOne);
				RadarModule._set_log_depth(true, currentFrustum.x, currentFrustum.y,
					farDepthFromNearPlusOne, oneOverLog2FarDepthFromNearPlusOne);
			}

			let viewMatrix = viewMatrix0;
			let projMatrix = projectionMatrix;
			// let inViewProjection = uniformState.inverseViewProjection;
			let mv = new EarthRadarArray(Cesium.Matrix4.toArray(viewMatrix), EarthRadarArrayType.Float64);
			let proj = new EarthRadarArray(Cesium.Matrix4.toArray(projMatrix), EarthRadarArrayType.Float64);
			// let inMvProj = new EarthRadarArray(Cesium.Matrix4.toArray(inViewProjection), EarthRadarArrayType.Float64);

			//设置太阳位置及颜色
			var now = Cesium.JulianDate.now();
			if(this.cesiumViewer.timeline){
				now = this.cesiumViewer.timeline._clock._currentTime;
			}
			// const date = Cesium.JulianDate.toDate(now);
			//太阳光颜色位置  现在不需要了
			const date=now;
			// let date2=this.cesiumViewer.timeline._clock._currentTime;
			let transforMatrix=Cesium.Transforms.computeTemeToPseudoFixedMatrix(date);
			let sunpos=Cesium.Simon1994PlanetaryPositions.computeSunPositionInEarthInertialFrame(date);
			Cesium.Matrix3.multiplyByVector(transforMatrix,sunpos,sunpos);
			const dir=new Cesium.Cartesian3();
			let suninitpos=Cesium.Cartesian3.fromDegrees(0, 0, 0);
			Cesium.Cartesian3.subtract(sunpos, suninitpos, dir);
			Cesium.Cartesian3.normalize(dir, dir);
			RadarModule._set_light(dir.x,dir.y,dir.z,0.8, 0.8, 0.0, 0.8);

			const canvas = this.cesiumViewer.canvas;
			var gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
			if (gl)
			{
				gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
			}
			RadarModule._render_all(mv.getHandle(), proj.getHandle());
			if (gl)
			{
				gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			}

			mv.dispose();
			proj.dispose();

		}
	}

	createCommand (frameState, modelMatrix) {
		const context = frameState.context
		const vertexShaderSource = `
              in vec3 position;
              void main() {
                gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
              }
            `
		const fragmentShaderSource = `
              void main(){
                out_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
              }
          `
		const attributeLocations = {
			"position": 0,
		}
		const shaderProgram = Cesium.ShaderProgram.fromCache({
			context: context,
			vertexShaderSource: vertexShaderSource,
			fragmentShaderSource: fragmentShaderSource,
			attributeLocations: attributeLocations,
		});

		const renderState = Cesium.RenderState.fromCache({
			depthTest: {
				enabled: true
			},
			depthMask: true // 关闭深度可写
		});

		let command = new RadarCustomDrawCommand({
			shaderProgram: shaderProgram,
			renderState: renderState,
			pass: Cesium.Pass.OPAQUE,
		},this)

		const useLogDepth = frameState.useLogDepth;
		const derivedCommands = command.derivedCommands;
		const hasLogDepthDerivedCommands = defined(derivedCommands.logDepth);
		const needsLogDepthDerivedCommands =
			useLogDepth && !hasLogDepthDerivedCommands;

		if (command.dirty) {
			command.dirty = false;
			if (hasLogDepthDerivedCommands || needsLogDepthDerivedCommands) {
				derivedCommands.logDepth = RadarCustomDrawCommand.createLogDepthCommand(
					command,
					context,
					derivedCommands.logDepth
				);
			}
		}
		return command;
	}
	update (frameState) {
		const command = this.createCommand(frameState, this._modelMatrix)
		frameState.commandList.push(command)
	}

}

 export { EarthRadarObject,Radarparam,RadarDisturb,MagneticsWave,RadarGroup};

