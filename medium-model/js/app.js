


class QSTextureApp {
    constructor() {
        this.viewer = null;
        this.textureGenerator = new TextureGenerator();
        this.rectangleEntities = []; // 存储所有矩形实体
        this.heightLayers = []; // 存储所有高度层数据
        this.currentTextureUrls = new Map(); // 存储每个高度的纹理URL
        this.isLoading = false;
        // this.dataFilePath = './data/test.json'; // 单个JSON文件路径
        this.dataFilePath = './data/DSurfTomo.json'; // 单个JSON文件路径
        this.profileWalls = []; // 存储边界剖面墙实体
        this.showBoundsProfiles = false; // 边界剖面显示状态
        this.longitudinalProfile = null; // 纵向剖面
        this.latitudinalProfile = null;  // 横向剖面
        this.showLongitudinalProfile = true; // 纵向剖面显示状态
        this.showLatitudinalProfile = true;  // 横向剖面显示状态
        this.longitudinalIndicator = null;
        this.latitudinalIndicator = null;
        this.height = 'all';
        // this.underHeight = 12000   地下高度  this.underHeight  用（12 * this.interval）替换
        this.interval = 1000  //间隔
        this.init();
    }


    async init () {

        MEarth.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1MTAzNy1mZmZiLTQzZjctODAyYy01YjBiMDA3Yzc0YzgiLCJpZCI6MTc0MzM1LCJpYXQiOjE3MDA2ODU3ODF9.3vUmixeCI7_QD5nYxq9Nq7cGdRLqQ1E-0TIpOy7C3k4';
        window.CESIUM_BASE_URL = "/medium-model/MEarth";
        // window.CESIUM_BASE_URL = "../MEarth";

        // 初始化 MEarth
        this.viewer = new MEarth.Viewer("mearthContainer", {
            selectionIndicator: false,

            baseLayer: MEarth.ImageryLayer.fromProviderAsync(
                MEarth.ArcGisMapServerImageryProvider.fromBasemapType(
                    MEarth.ArcGisBaseMapType.SATELLITE //设置底图
                )
            ),

            // terrain: new MEarth.Terrain(
            //     MEarth.CesiumTerrainProvider.fromUrl(
            //         '//data.mars3d.cn/terrain'
            //     )
            // ),
            terrainProvider: await MEarth.CesiumTerrainProvider.fromUrl(
                '//data.mars3d.cn/terrain', {
                requestWaterMask: true,
                requestVertexNormals: true,
            }),
            // useDefaultRenderLoop: false, //关闭cesium的默认渲染
            // shouldAnimate: true, //视图自动进行动画渲染
            // timeline: false,  //不显示时间轴控件
        });


        this.viewer.scene.skyAtmosphere.show = false; // 关闭大气层效果
        this.viewer.scene.backgroundColor = MEarth.Color.TRANSPARENT; // 或者选择其他颜色


        // // 启用地下模式
        this.viewer.scene.globe.depthTestAgainstTerrain = false;
        this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;

        // // 允许相机进入地下
        // this.viewer.scene.globe.translucency.enabled = true;
        // this.viewer.scene.globe.translucency.frontFaceAlpha = 0.5; // 地球表面透明度
        // this.viewer.scene.globe.translucency.backFaceAlpha = 0.2; // 地球背面透明度


        this.viewer.scene.globe.depthTestAgainstTerrain = true
        // 设置初始视图
        this.viewer.camera.setView({
            destination: MEarth.Rectangle.fromDegrees(110, 30, 135, 50),
            orientation: {
                heading: 0,
                pitch: -MEarth.Math.PI_OVER_TWO,
                roll: 0
            }
        });

        this.levelScale = parseFloat(document.getElementById('levelScale').value);

        // 绑定事件
        this.bindEvents();


        // 确保只执行一次
        let isExecuted = false;

        this.viewer.scene.globe.tileLoadProgressEvent.addEventListener(async (numberTilesLoading) => {
            if (numberTilesLoading === 0 && !isExecuted) {
                isExecuted = true;
                console.log('地形加载完成，准备获取高度');
                // 在这里执行你需要的操作，比如获取某个点的高度
                const position = MEarth.Cartesian3.fromDegrees(118.481500, 30.769100);
                const height = this.viewer.scene.globe.getHeight(MEarth.Ellipsoid.WGS84.cartesianToCartographic(position));
                console.log(`获取到的高度为：${height}`);
                this.excavationTerrain()
                // // 加载所有高度层数据
                await this.loadMultiLevelData();

                this.resetView();

            }
        });

    }
    excavationTerrain () {
        // 地形开挖
        // let data = {
        //     "lons": [118.481500, 118.501500, 118.521500, 118.541500, 118.561500, 118.581500, 118.601500, 118.621500, 118.641500, 118.661500, 118.681500, 118.701500, 118.721500, 118.741500, 118.761500, 118.781500, 118.801500, 118.821500, 118.841500, 118.861500, 118.881500, 118.901500, 118.921500, 118.941500, 118.961500, 118.981500, 119.001500],
        //     "lats": [30.769100, 30.789100, 30.809100, 30.829100, 30.849100, 30.869100, 30.889100, 30.909100, 30.929100, 30.949100, 30.969100, 30.989100, 31.009100, 31.029100, 31.049100, 31.069100, 31.089100, 31.109100, 31.129100, 31.149100, 31.169100, 31.189100, 31.209100]
        // }
        // const coordinations = [];
        // for (let i = 0; i < data.lons.length; ++i) {
        //     coordinations.push(data.lons[i], data.lats[i]);
        // }

        let coordinations = [
            118.4615, 30.7491,
            118.4615, 31.2291,
            119.0215, 31.2291,
            119.0215, 30.7491
        ]
        this.viewer.scene.globe.setExcavation(coordinations, (12.5 * this.interval * this.levelScale), {

            // 可自定义侧边和底边纹理    
            // excavationSideImage: '../images/globe_excavation/excavate_side_min.jpg',
            // excavationBottomImage: '../images/globe_excavation/excavate_bottom_min.jpg',

            // 根据开挖范围调整侧边和底边纹理的重复次数  (水平重复次数, 竖直重复次数)
            excavationSideImageRepeat: new MEarth.Cartesian2(8.0, 1.0),
            // excavationSideImageRepeat: new MEarth.Cartesian2(8.0, 1.0),
            excavationBottomImageRepeat: new MEarth.Cartesian2(0.0, 0.0)
            // excavationBottomImageRepeat: new MEarth.Cartesian2(1.0, 1.0)
        });
    }

    bindEvents () {
        // document.getElementById('updateTexture').addEventListener('click', () => {
        //     this.updateAllTextures();
        // });

        document.getElementById('resetView').addEventListener('click', () => {
            this.resetView();
        });

        document.getElementById('toggleBoundsProfiles').addEventListener('click', () => {
            this.toggleBoundsProfiles();
        });

        // 实时更新
        ['minValue', 'maxValue', 'colorScheme', 'globalOpacity', 'profileOpacity', 'levelScale'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                if (!this.isLoading) {
                    this.updateAllTextures();

                    this.levelScale = parseFloat(document.getElementById('levelScale').value);
                    document.getElementById('levelScaleValue').textContent = this.levelScale.toFixed(1);

                    const globalOpacity = parseFloat(document.getElementById('globalOpacity').value);
                    document.getElementById('opacityValue').textContent = globalOpacity.toFixed(1);

                    const profileOpacity = parseFloat(document.getElementById('profileOpacity').value);
                    document.getElementById('profileOpacityValue').textContent = profileOpacity.toFixed(1);
                }
                if (id == 'levelScale') {
                    this.viewer.scene.globe.clearExcavation()

                    setTimeout(() => {
                        this.excavationTerrain()
                    }, 0);
                }
            });
        });

        // 高度选择器
        document.getElementById('heightSelector').addEventListener('change', (e) => {
            this.toggleHeightLayer(e.target.value);
        });

        // 纵向剖面滑块
        document.getElementById('longitudinalSlider').addEventListener('input', (e) => {
            const longitude = parseFloat(e.target.value);
            if (this.showLongitudinalProfile)
                this.updateLongitudinalProfile(longitude);
            // 更新显示值
            document.getElementById('longitudinalValue').textContent = longitude.toFixed(2) + '°';
        });

        // 横向剖面滑块
        document.getElementById('latitudinalSlider').addEventListener('input', (e) => {
            const latitude = parseFloat(e.target.value);
            if (this.showLatitudinalProfile)
                this.updateLatitudinalProfile(latitude);
            // 更新显示值
            document.getElementById('latitudinalValue').textContent = latitude.toFixed(2) + '°';
        });

        // 纵向剖面显隐控制
        document.getElementById('longitudinalVisible').addEventListener('change', (e) => {
            this.toggleLongitudinalProfile(e.target.checked);
        });

        // 横向剖面显隐控制
        document.getElementById('latitudinalVisible').addEventListener('change', (e) => {
            this.toggleLatitudinalProfile(e.target.checked);
        });
    }

    // 加载多层数据
    async loadMultiLevelData () {
        this.showLoading(true);

        try {
            console.log('开始加载多层JSON数据...');

            // 加载单个JSON文件
            await this.textureGenerator.loadData(this.dataFilePath);

            // 获取所有可用层
            const availableLevels = this.textureGenerator.getAvailableLevels();
            console.log(`找到 ${availableLevels.length} 个高度层:`, availableLevels);

            // 为每个高度层创建数据对象
            this.createHeightLayersFromMultiLevelData(availableLevels);

            // 创建高度选择器
            this.createHeightSelector(availableLevels);

            // 设置基于全局数据范围的默认值
            this.setDefaultValueRange();

            // 初始化剖面滑块
            this.initializeLonLatProfileSliders();

            // 创建所有纹理
            await this.createAllTextures();

            console.log('多层JSON数据加载完成');

        } catch (error) {
            console.error('加载多层JSON数据失败:', error);
            alert('JSON数据加载失败，请检查控制台输出');
        } finally {
            this.showLoading(false);
        }
    }

    // 从多层数据创建高度层
    createHeightLayersFromMultiLevelData (availableLevels) {
        this.heightLayers = [];

        availableLevels.forEach(level => {
            // 切换到该层以获取数据范围
            this.textureGenerator.switchToLevel(level);

            this.heightLayers.push({
                height: level,
                generator: this.textureGenerator, // 共享同一个generator
                bounds: this.textureGenerator.getBounds(),
                metadata: this.textureGenerator.metadata,
                visible: true
            });
        });

        // 设置最大最小高度
        this.maxHeight = Math.max(...availableLevels);
        this.minHeight = Math.min(...availableLevels);

        console.log(`创建了 ${this.heightLayers.length} 个高度层，高度范围: ${this.minHeight} - ${this.maxHeight} km`);
    }

    // 创建高度选择器
    createHeightSelector (availableLevels) {
        const selector = document.getElementById('heightSelector');
        selector.innerHTML = '<option value="none">隐藏所有高度层</option>';
        selector.innerHTML += '<option value="all" selected>显示所有高度层</option>';

        availableLevels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = `${level} 公里`;
            selector.appendChild(option);
        });
    }

    // 从元数据设置默认值范围
    setDefaultValueRange () {
        const elementInfo = this.textureGenerator.getElementInfo();

        if (elementInfo) {
            const minInput = document.getElementById('minValue');
            const maxInput = document.getElementById('maxValue');

            // 直接使用元数据中的最小最大值
            minInput.value = elementInfo.minValue.toFixed(3);
            maxInput.value = elementInfo.maxValue.toFixed(3);

            console.log('使用元数据范围:', {
                min: elementInfo.minValue,
                max: elementInfo.maxValue,
                unit: elementInfo.unit,
                dataType: elementInfo.dataType,
                precision: elementInfo.precision
            });
        }
    }

    // 初始化纵横剖面滑块
    initializeLonLatProfileSliders () {
        if (this.heightLayers.length === 0) return;

        const bounds = this.heightLayers[0].bounds;

        // 设置滑块范围和初始值
        const lonSlider = document.getElementById('longitudinalSlider');
        const latSlider = document.getElementById('latitudinalSlider');
        const lonValue = document.getElementById('longitudinalValue');
        const latValue = document.getElementById('latitudinalValue');

        // 纵向剖面：固定纬度，调节经度 (东西方向)
        lonSlider.min = bounds.west.toFixed(2);
        lonSlider.max = bounds.east.toFixed(2);
        lonSlider.step = (bounds.east - bounds.west) / 100;
        lonSlider.value = ((bounds.west + bounds.east) / 2).toFixed(2);
        lonValue.textContent = lonSlider.value + '°';

        // 横向剖面：固定经度，调节纬度 (南北方向)
        latSlider.min = bounds.south.toFixed(2);
        latSlider.max = bounds.north.toFixed(2);
        latSlider.step = (bounds.north - bounds.south) / 100;
        latSlider.value = ((bounds.south + bounds.north) / 2).toFixed(2);
        latValue.textContent = latSlider.value + '°';

        if (this.showLongitudinalProfile) {
            // 创建初始纵向剖面
            this.updateLongitudinalProfile(parseFloat(lonSlider.value));
        }

        if (this.showLatitudinalProfile) {
            // 创建初始横向剖面
            this.updateLatitudinalProfile(parseFloat(latSlider.value));
        }
    }

    // 更新横向剖面（东西方向，固定纬度）
    updateLatitudinalProfile (latitude) {
        if (this.heightLayers.length === 0) return;

        // 移除旧的横向剖面
        if (this.latitudinalProfile) {
            this.viewer.entities.remove(this.latitudinalProfile);
        }

        const bounds = this.heightLayers[0].bounds;
        const minVal = parseFloat(document.getElementById('minValue').value);
        const maxVal = parseFloat(document.getElementById('maxValue').value);
        const colorScheme = document.getElementById('colorScheme').value;
        const profileOpacity = parseFloat(document.getElementById('profileOpacity').value);

        // 更新显示值
        document.getElementById('latitudinalValue').textContent = latitude.toFixed(2) + '°';

        // 创建横向剖面墙（东西方向，固定纬度）
        this.latitudinalProfile = this.createProfileWall({
            name: '横向剖面',
            lat: latitude,
            lonStart: bounds.west,
            lonEnd: bounds.east,
            horizontal: true
        }, minVal, maxVal, colorScheme, profileOpacity);

        // 添加剖面位置指示线
        // this.addProfileIndicator('latitudinal', latitude, false);
    }

    // 更新纵向剖面（南北方向，固定经度）
    updateLongitudinalProfile (longitude) {
        if (this.heightLayers.length === 0) return;

        // 移除旧的纵向剖面
        if (this.longitudinalProfile) {
            this.viewer.entities.remove(this.longitudinalProfile);
        }

        const bounds = this.heightLayers[0].bounds;
        const minVal = parseFloat(document.getElementById('minValue').value);
        const maxVal = parseFloat(document.getElementById('maxValue').value);
        const colorScheme = document.getElementById('colorScheme').value;
        const profileOpacity = parseFloat(document.getElementById('profileOpacity').value);

        // 更新显示值
        document.getElementById('longitudinalValue').textContent = longitude.toFixed(2) + '°';

        // 创建纵向剖面墙（南北方向，固定经度）
        this.longitudinalProfile = this.createProfileWall({
            name: '纵向剖面',
            lon: longitude,
            latStart: bounds.south,
            latEnd: bounds.north,
            horizontal: false
        }, minVal, maxVal, colorScheme, profileOpacity);

        // 添加剖面位置指示线
        // this.addProfileIndicator('longitudinal', longitude, true);
    }

    // 创建剖面墙
    createProfileWall (profile, minVal, maxVal, colorScheme, opacity) {
        try {
            // 收集剖面数据
            const profileData = this.collectProfileData(profile);
            if (!profileData) return null;
            debugger
            // 生成剖面纹理
            const textureUrl = this.generateProfileTexture(profileData, minVal, maxVal, colorScheme, opacity);

            // 创建墙的位置
            const positions = this.calculateWallPositions(profile);
            debugger
            const wallEntity = this.viewer.entities.add({
                name: profile.name,
                description: this.createProfileDescription(profile, profileData),
                wall: {
                    positions: positions,
                    // maximumHeights: this.calculateWallHeights(profile),
                    // minimumHeights: new Array(positions.length).fill((this.maxHeight - this.minHeight) * this.interval * this.levelScale - (12 * this.interval)),


                    // maximumHeights: new Array(positions.length).fill(0),
                    // minimumHeights: new Array(positions.length).fill((this.maxHeight - this.minHeight) * this.interval * this.levelScale - (12 * this.interval)),
                    maximumHeights: this.calculateWallHeights(profile),
                    // minimumHeights: new Array(positions.length).fill((this.maxHeight - this.minHeight) * this.interval * this.levelScale - (12 * this.interval)),
                    minimumHeights: new Array(positions.length).fill(0),

                    material: new MEarth.ImageMaterialProperty({
                        image: textureUrl,
                        transparent: opacity > 0,
                        opacity: opacity
                    }),
                    outline: false,
                    outlineColor: MEarth.Color.WHITE.withAlpha(0.8),
                    outlineWidth: 2
                }
            });

            return wallEntity;

        } catch (error) {
            console.error(`创建${profile.name}失败:`, error);
            return null;
        }
    }

    // 添加剖面位置指示线
    addProfileIndicator (type, value, isLongitudinal) {
        const bounds = this.heightLayers[0].bounds;
        const maxHeightMeters = (this.maxHeight - this.minHeight) * 1000 * this.levelScale;

        let positions;
        if (isLongitudinal) {
            // 纵向剖面指示线（垂直线）
            positions = MEarth.Cartesian3.fromDegreesArrayHeights([
                value, bounds.south, maxHeightMeters,
                value, bounds.north, maxHeightMeters
            ]);

        } else {
            // 横向剖面指示线（水平线）
            positions = MEarth.Cartesian3.fromDegreesArrayHeights([
                bounds.west, value, maxHeightMeters,
                bounds.east, value, maxHeightMeters
            ]);
        }

        const indicator = this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 3,
                material: isLongitudinal ? MEarth.Color.RED : MEarth.Color.BLUE,
                clampToGround: false
            }
        });

        // 存储指示线引用以便后续删除
        if (isLongitudinal) {
            if (this.longitudinalIndicator) {
                this.viewer.entities.remove(this.longitudinalIndicator);
            }
            this.longitudinalIndicator = indicator;
        } else {
            if (this.latitudinalIndicator) {
                this.viewer.entities.remove(this.latitudinalIndicator);
            }
            this.latitudinalIndicator = indicator;
        }
    }

    // 创建剖面描述
    createProfileDescription (profile, profileData) {
        let positionInfo;
        if (profile.horizontal) {
            positionInfo = `纬度: ${profile.lat.toFixed(2)}°<br>经度范围: ${profile.lonStart.toFixed(2)}° - ${profile.lonEnd.toFixed(2)}°`;
        } else {
            positionInfo = `经度: ${profile.lon.toFixed(2)}°<br>纬度范围: ${profile.latStart.toFixed(2)}° - ${profile.latEnd.toFixed(2)}°`;
        }

        return `
            <div style="max-width: 300px;">
                <h3>${profile.name}</h3>
                <p>${positionInfo}</p>
                <p>高度范围: ${this.minHeight}km - ${this.maxHeight}km</p>
                <p>拖动滑块调整剖面位置</p>
            </div>
        `;
    }

    // 收集剖面数据
    collectProfileData (profile) {
        const profileData = [];

        this.heightLayers.forEach(layer => {
            const dataPoints = [];
            const generator = layer.generator;

            if (profile.horizontal) {
                // 横向剖面：固定纬度，遍历经度
                for (let x = 0; x < generator.width; x++) {
                    const lon = generator.lons[x];
                    const lat = profile.lat;
                    const latIndex = this.findClosestIndex(generator.lats, lat);
                    if (latIndex !== -1 && generator.grid[latIndex][x] !== null) {
                        dataPoints.push({
                            position: x / (generator.width - 1),
                            value: generator.grid[latIndex][x],
                            height: layer.height
                        });
                    }
                }
            } else {
                // 纵向剖面：固定经度，遍历纬度
                for (let y = 0; y < generator.height; y++) {
                    const lat = generator.lats[y];
                    const lon = profile.lon;
                    const lonIndex = this.findClosestIndex(generator.lons, lon);
                    if (lonIndex !== -1 && generator.grid[y][lonIndex] !== null) {
                        dataPoints.push({
                            position: y / (generator.height - 1),
                            value: generator.grid[y][lonIndex],
                            height: layer.height
                        });
                    }
                }
            }

            if (dataPoints.length > 0) {
                profileData.push({
                    height: layer.height,
                    points: dataPoints
                });
            }
        });

        return profileData.length > 0 ? profileData : null;
    }

    // 查找最接近的索引
    findClosestIndex (array, target) {
        let closestIndex = -1;
        let minDiff = Infinity;

        for (let i = 0; i < array.length; i++) {
            const diff = Math.abs(array[i] - target);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }

        return closestIndex;
    }

    // 创建所有纹理
    async createAllTextures () {
        const minVal = parseFloat(document.getElementById('minValue').value);
        const maxVal = parseFloat(document.getElementById('maxValue').value);
        const colorScheme = document.getElementById('colorScheme').value;
        const globalOpacity = parseFloat(document.getElementById('globalOpacity').value);
        this.levelScale = parseFloat(document.getElementById('levelScale').value);

        // 清除现有实体
        this.clearAllEntities();
        debugger
        // let layer = this.heightLayers[this.heightLayers.length - 1]

        // await this.createHeightLayerTexture(layer, minVal, maxVal, colorScheme, globalOpacity, this.levelScale);

        // 为每个高度层创建纹理
        for (const layer of this.heightLayers) {
            await this.createHeightLayerTexture(layer, minVal, maxVal, colorScheme, globalOpacity, this.levelScale);
        }

        console.log('所有高度层纹理创建完成');
    }

    // 创建单个高度层纹理
    async createHeightLayerTexture (layer, minVal, maxVal, colorScheme, globalOpacity, levelScale) {
        try {
            // 切换到该层数据
            this.textureGenerator.switchToLevel(layer.height);

            // 生成纹理
            const textureUrl = this.textureGenerator.generateTexture(minVal, maxVal, colorScheme, globalOpacity);
            this.currentTextureUrls.set(layer.height, textureUrl);
            // 计算高度（公里转换为米）
            const heightInMeters = - (layer.height * this.interval * levelScale);
            debugger
            // const heightInMeters = (this.maxHeight - layer.height) * this.interval * levelScale - (12 * this.interval);

            // 创建矩形实体
            const rectangleEntity = this.viewer.entities.add({
                name: `高度层 ${layer.height}km`,
                // description: this.createLayerDescription(layer),
                rectangle: {
                    coordinates: MEarth.Rectangle.fromDegrees(
                        layer.bounds.west, layer.bounds.south,
                        layer.bounds.east, layer.bounds.north
                    ),
                    height: heightInMeters,
                    material: new MEarth.ImageMaterialProperty({
                        image: textureUrl,
                        transparent: globalOpacity > 0,
                        opacity: globalOpacity
                    }),
                    outline: false,
                    outlineColor: MEarth.Color.YELLOW.withAlpha(0.3),
                    outlineWidth: 1
                }
            });

            this.rectangleEntities.push({
                height: layer.height,
                entities: [rectangleEntity],
                visible: true
            });

            console.log(`高度层 ${layer.height}km 纹理创建完成`);

        } catch (error) {
            console.error(`创建高度层 ${layer.height}km 纹理失败:`, error);
        }
    }

    // 创建层描述信息
    createLayerDescription (layer) {
        return `
            <div style="max-width: 300px;">
                <h3>高度层 ${layer.height}km</h3>
                <p>数据范围: ${layer.levelRange.min.toFixed(3)} - ${layer.levelRange.max.toFixed(3)}</p>
                <p>经纬度范围: <br>
                   ${layer.bounds.west.toFixed(2)}° - ${layer.bounds.east.toFixed(2)}° E<br>
                   ${layer.bounds.south.toFixed(2)}° - ${layer.bounds.north.toFixed(2)}° N
                </p>
                <p>网格大小: ${this.textureGenerator.width} × ${this.textureGenerator.height}</p>
            </div>
        `;
    }

    // 创建边界剖面墙
    createBoundsProfileWalls () {
        if (this.heightLayers.length === 0) return;

        // 清除现有边界剖面墙
        this.clearBoundsProfileWalls();

        const bounds = this.heightLayers[0].bounds;
        const minVal = parseFloat(document.getElementById('minValue').value);
        const maxVal = parseFloat(document.getElementById('maxValue').value);
        const colorScheme = document.getElementById('colorScheme').value;
        const profileOpacity = parseFloat(document.getElementById('profileOpacity').value);

        // 四个边界：北、南、东、西
        const profiles = [
            { name: '北边界', lat: bounds.north, lonStart: bounds.west, lonEnd: bounds.east, horizontal: true },
            { name: '南边界', lat: bounds.south, lonStart: bounds.west, lonEnd: bounds.east, horizontal: true },
            { name: '东边界', lon: bounds.east, latStart: bounds.south, latEnd: bounds.north, horizontal: false },
            { name: '西边界', lon: bounds.west, latStart: bounds.south, latEnd: bounds.north, horizontal: false }
        ];

        profiles.forEach(profile => {
            const wall = this.createSingleProfileWall(profile, minVal, maxVal, colorScheme, profileOpacity);
            if (wall) {
                this.profileWalls.push(wall);
            }
        });

        console.log('四个边界剖面墙创建完成');
    }

    // 创建单个剖面墙
    createSingleProfileWall (profile, minVal, maxVal, colorScheme, opacity) {
        try {
            // 收集该边界上所有高度层的数据
            const profileData = this.collectProfileData(profile);
            if (!profileData) return null;

            // 生成剖面纹理
            const textureUrl = this.generateProfileTexture(profileData, minVal, maxVal, colorScheme, opacity);

            // 创建墙的位置
            const positions = this.calculateWallPositions(profile);

            const wallEntity = this.viewer.entities.add({
                name: `${profile.name}剖面`,
                wall: {
                    positions: positions,
                    // maximumHeights: this.calculateWallHeights(profile),
                    // minimumHeights: new Array(positions.length).fill(0),

                    // maximumHeights: this.calculateWallHeights(profile),
                    // minimumHeights: new Array(positions.length).fill((this.maxHeight - this.minHeight) * this.interval * this.levelScale - (12 * this.interval)),

                    maximumHeights: this.calculateWallHeights(profile),
                    // minimumHeights: new Array(positions.length).fill((this.maxHeight - this.minHeight) * this.interval * this.levelScale - (12 * this.interval)),
                    minimumHeights: new Array(positions.length).fill(0),
                    material: new MEarth.ImageMaterialProperty({
                        image: textureUrl,
                        transparent: opacity > 0,
                        opacity: opacity
                    }),
                    outline: false,
                    outlineColor: MEarth.Color.WHITE.withAlpha(0.5)
                }
            });

            return wallEntity;

        } catch (error) {
            console.error(`创建${profile.name}剖面失败:`, error);
            return null;
        }
    }

    // 生成剖面纹理
    generateProfileTexture (profileData, minVal, maxVal, colorScheme, opacity) {
        const heightLevels = profileData.map(d => d.height);
        const numHeights = heightLevels.length;
        const numPoints = profileData[0].points.length;

        const canvas = document.createElement('canvas');
        canvas.width = numPoints;
        canvas.height = numHeights;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(numPoints, numHeights);

        // 按高度排序（从低到高）
        profileData.sort((a, b) => a.height - b.height);

        for (let h = 0; h < numHeights; h++) {
            const layer = profileData[h];
            for (let p = 0; p < numPoints; p++) {
                const point = layer.points[p];
                const idx = (h * numPoints + p) * 4;

                if (point && point.value !== null && !isNaN(point.value)) {
                    const normalized = (point.value - minVal) / (maxVal - minVal);
                    const clamped = Math.max(0, Math.min(1, normalized));
                    const color = this.textureGenerator.getColor(clamped, colorScheme);

                    imageData.data[idx] = color.r;
                    imageData.data[idx + 1] = color.g;
                    imageData.data[idx + 2] = color.b;
                    imageData.data[idx + 3] = (1 - opacity) * 255;
                } else {
                    // 无数据区域设为透明
                    imageData.data[idx] = 0;
                    imageData.data[idx + 1] = 0;
                    imageData.data[idx + 2] = 0;
                    imageData.data[idx + 3] = 0;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }

    // 计算墙的位置
    calculateWallPositions (profile) {
        debugger
        if (profile.horizontal) {
            // 横向剖面墙（东西方向）
            return MEarth.Cartesian3.fromDegreesArray([
                profile.lonStart, profile.lat,
                profile.lonEnd, profile.lat,
            ]);
            // return MEarth.Cartesian3.fromDegreesArrayHeights([
            //     profile.lonStart, profile.lat, -10000,
            //     profile.lonEnd, profile.lat, -10000
            // ]);
        } else {
            // 纵向剖面墙（南北方向）
            return MEarth.Cartesian3.fromDegreesArray([
                profile.lon, profile.latStart,
                profile.lon, profile.latEnd,
            ]);
            // return MEarth.Cartesian3.fromDegreesArrayHeights([
            //     profile.lon, profile.latStart, -10000,
            //     profile.lon, profile.latEnd, -10000
            // ]);
        }

    }

    // 计算墙的高度
    calculateWallHeights (profile) {
        const maxHeightMeters = (this.maxHeight - this.minHeight) * this.interval * this.levelScale - (12 * this.interval);
        return [- (12 * this.interval * this.levelScale), - (12 * this.interval * this.levelScale)];
        // return [maxHeightMeters, maxHeightMeters];
    }

    // 添加层边框
    addLayerBorders (layer, heightInMeters) {
        const bounds = layer.bounds;
        const positions = MEarth.Cartesian3.fromRadiansArray([
            MEarth.Math.toRadians(bounds.west), MEarth.Math.toRadians(bounds.south),
            MEarth.Math.toRadians(bounds.east), MEarth.Math.toRadians(bounds.south),
            MEarth.Math.toRadians(bounds.east), MEarth.Math.toRadians(bounds.north),
            MEarth.Math.toRadians(bounds.west), MEarth.Math.toRadians(bounds.north),
            MEarth.Math.toRadians(bounds.west), MEarth.Math.toRadians(bounds.south)
        ]);

        // 底部边框
        const bottomBorder = this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 2,
                material: MEarth.Color.CYAN.withAlpha(0.6),
                height: heightInMeters,
                clampToGround: false
            }
        });

        // 顶部边框
        const topBorder = this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 2,
                material: MEarth.Color.CYAN.withAlpha(0.6),
                height: heightInMeters + 1000, // 稍微高于层高，便于区分
                clampToGround: false
            }
        });

        // 找到对应的实体组并添加边框实体
        const entityGroup = this.rectangleEntities.find(e => e.height === layer.height);
        if (entityGroup) {
            entityGroup.entities.push(bottomBorder, topBorder);
        }
    }

    // 添加高度标签
    addHeightLabel (layer, heightInMeters) {
        const bounds = layer.bounds;
        const centerLon = (bounds.west + bounds.east) / 2;
        const centerLat = (bounds.south + bounds.north) / 2;

        const label = this.viewer.entities.add({
            position: MEarth.Cartesian3.fromDegrees(centerLon, centerLat, heightInMeters + 500),
            label: {
                text: `${layer.height}km`,
                font: '14pt Arial',
                fillColor: MEarth.Color.WHITE,
                outlineColor: MEarth.Color.BLACK,
                outlineWidth: 2,
                pixelOffset: new MEarth.Cartesian2(0, -20),
                showBackground: true,
                backgroundColor: new MEarth.Color(0.1, 0.1, 0.1, 0.7),
                horizontalOrigin: MEarth.HorizontalOrigin.CENTER,
                verticalOrigin: MEarth.VerticalOrigin.BOTTOM
            }
        });

        const entityGroup = this.rectangleEntities.find(e => e.height === layer.height);
        if (entityGroup) {
            entityGroup.entities.push(label);
        }
    }

    // 更新所有纹理（包括剖面墙）
    async updateAllTextures () {
        if (this.isLoading) return;

        this.showLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.createAllTextures();
            this.toggleHeightLayer(this.height);

            // 如果边界剖面墙正在显示，也更新它们
            if (this.showBoundsProfiles) {
                this.createBoundsProfileWalls();
            }

            // 如果纵向剖面正在显示，也更新它们
            if (this.showLongitudinalProfile) {
                const lonValue = parseFloat(document.getElementById('longitudinalSlider').value);
                this.updateLongitudinalProfile(lonValue);
            }

            // 如果横向剖面正在显示，也更新它们
            if (this.showLatitudinalProfile) {
                const latValue = parseFloat(document.getElementById('latitudinalSlider').value);
                this.updateLatitudinalProfile(latValue);
            }
        } catch (error) {
            console.error('更新纹理失败:', error);
        } finally {
            this.showLoading(false);
        }
    }

    // 切换高度层显示
    toggleHeightLayer (height) {
        this.height = height;
        if (height === 'none') {
            // 显示所有层
            this.rectangleEntities.forEach(entityGroup => {
                entityGroup.entities.forEach(entity => {
                    entity.show = false;
                });
                entityGroup.visible = false;
            });
        }
        if (height === 'all') {
            // 显示所有层
            this.rectangleEntities.forEach(entityGroup => {
                entityGroup.entities.forEach(entity => {
                    entity.show = true;
                });
                entityGroup.visible = true;
            });
        } else {
            // 只显示指定高度层
            this.rectangleEntities.forEach(entityGroup => {
                const show = entityGroup.height === parseFloat(height);
                entityGroup.entities.forEach(entity => {
                    entity.show = show;
                });
                entityGroup.visible = show;
            });
        }
    }

    // 切换边界剖面墙显示
    toggleBoundsProfiles () {
        this.showBoundsProfiles = !this.showBoundsProfiles;
        const button = document.getElementById('toggleBoundsProfiles');

        if (this.showBoundsProfiles) {
            this.createBoundsProfileWalls();
            button.textContent = '隐藏边界剖面墙';
        } else {
            this.clearBoundsProfileWalls();
            button.textContent = '显示边界剖面墙';
        }
    }

    // 切换纵向剖面显示
    toggleLongitudinalProfile () {
        this.showLongitudinalProfile = !this.showLongitudinalProfile;

        if (this.showLongitudinalProfile) {
            // 重新创建当前剖面
            const lonValue = parseFloat(document.getElementById('longitudinalSlider').value);
            this.updateLongitudinalProfile(lonValue);
        } else {
            this.clearLongitudinalProfileWalls();
        }
    }

    // 切换横向剖面显示
    toggleLatitudinalProfile () {
        this.showLatitudinalProfile = !this.showLatitudinalProfile;

        if (this.showLatitudinalProfile) {
            // 重新创建当前剖面
            const latValue = parseFloat(document.getElementById('latitudinalSlider').value);
            this.updateLatitudinalProfile(latValue);
        } else {
            this.clearLatitudinalProfileWalls();
        }
    }

    // 清除边界剖面墙
    clearBoundsProfileWalls () {
        this.profileWalls.forEach(wall => {
            this.viewer.entities.remove(wall);
        });
        this.profileWalls = [];
    }

    // 清除纵向剖面墙
    clearLongitudinalProfileWalls () {
        if (this.longitudinalProfile) {
            this.viewer.entities.remove(this.longitudinalProfile);
            this.longitudinalProfile = null;
        }
        if (this.longitudinalIndicator) {
            this.viewer.entities.remove(this.longitudinalIndicator);
            this.longitudinalIndicator = null;
        }
    }

    // 清除横向剖面墙
    clearLatitudinalProfileWalls () {
        if (this.latitudinalProfile) {
            this.viewer.entities.remove(this.latitudinalProfile);
            this.latitudinalProfile = null;
        }
        if (this.latitudinalIndicator) {
            this.viewer.entities.remove(this.latitudinalIndicator);
            this.latitudinalIndicator = null;
        }
    }

    // 清除所有实体
    clearAllEntities () {
        this.rectangleEntities.forEach(entityGroup => {
            entityGroup.entities.forEach(entity => {
                this.viewer.entities.remove(entity);
            });
        });
        this.rectangleEntities = [];
    }

    resetView () {
        if (this.heightLayers.length > 0) {
            const firstLayer = this.heightLayers[0];
            const bounds = firstLayer.bounds;

            this.viewer.camera.setView({
                destination: MEarth.Rectangle.fromDegrees(
                    bounds.west - 1, bounds.south - 1,
                    bounds.east + 1, bounds.north + 1
                ),
                orientation: {
                    heading: 0,
                    pitch: -MEarth.Math.PI_OVER_TWO,
                    roll: 0
                }
            });
        }
    }

    showLoading (show) {
        this.isLoading = show;
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    new QSTextureApp();
});