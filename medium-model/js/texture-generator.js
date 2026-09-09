// texture-generator.js
class TextureGenerator {
    constructor() {
        this.grid = null;
        this.lons = [];
        this.lats = [];
        this.width = 0;
        this.height = 0;
        this.metadata = null;
        this.coordinates = null;
        this.multiLevelData = null;
        this.currentLevel = null;
    }

    async loadData(url) {
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            return this.parseJSON(jsonData);
        } catch (error) {
            console.error('加载JSON数据失败:', error);
            throw error;
        }
    }

    parseJSON(jsonData) {
        // 存储完整的JSON数据
        this.metadata = jsonData.metadata;
        this.coordinates = jsonData.coordinates;
        this.multiLevelData = jsonData.data;
        
        this.lons = this.coordinates.lons;
        this.lats = this.coordinates.lats;
        this.width = this.lons.length;
        this.height = this.lats.length;
        
        // 默认使用第一层数据
        const firstLevel = this.getAvailableLevels()[0];
        debugger
        if (firstLevel) {
            this.switchToLevel(firstLevel);
        }
        
        console.log(`JSON数据加载完成: ${this.width} x ${this.height}, 层数: ${this.getAvailableLevels().length}`);
        return jsonData;
    }

    createGridFromFlattened(flattenedData) {
        // 初始化网格
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(null));
        
        // 将扁平化数据填充到二维网格
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = y * this.width + x;
                const value = flattenedData[index];
                
                // 处理JSON中的null值（无数据区域）
                if (value === null || value === undefined) {
                    this.grid[y][x] = null;
                } else {
                    this.grid[y][x] = value;
                }
            }
        }
    }

    // 获取指定层的数据
    getLevelData(level) {
        const levelKey = level.toString();
        if (this.multiLevelData && this.multiLevelData.values[levelKey]) {
            return this.multiLevelData.values[levelKey];
        }
        return null;
    }

    // 切换到指定层的数据
    switchToLevel(level) {
        const levelData = this.getLevelData(level);
        if (levelData) {
            this.currentLevel = level;
            this.createGridFromFlattened(levelData);
            return true;
        }
        return false;
    }

    // 获取所有可用层
    getAvailableLevels() {
        if (!this.multiLevelData) return [];
        return Object.keys(this.multiLevelData.values)
            .map(level => parseInt(level))
            .sort((a, b) => a - b);
    }

    // 获取元素信息
    getElementInfo() {
        if (!this.metadata || !this.metadata.elements || this.metadata.elements.length === 0) {
            return null;
        }
        return this.metadata.elements[0];
    }

    generateTexture(minVal, maxVal, colorScheme = 'heatmap', opacity) {
        if (!this.grid) {
            throw new Error('请先加载数据');
        }

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(this.width, this.height);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const value = this.grid[this.height - y - 1][x];
                const idx = (y * this.width + x) * 4;

                if (value === null || isNaN(value)) {
                    // 无数据区域设为透明
                    imageData.data[idx] = 0;     // R
                    imageData.data[idx + 1] = 0; // G
                    imageData.data[idx + 2] = 0; // B
                    imageData.data[idx + 3] = 0; // A
                } else {
                    const normalized = (value - minVal) / (maxVal - minVal);
                    const clamped = Math.max(0, Math.min(1, normalized));
                    const color = this.getColor(clamped, colorScheme);

                    imageData.data[idx] = color.r;     // R
                    imageData.data[idx + 1] = color.g; // G
                    imageData.data[idx + 2] = color.b; // B
                    imageData.data[idx + 3] = (1 - opacity) * 255; // A
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }

    getBounds() {
        if (!this.lons.length || !this.lats.length) {
            return null;
        }

        return {
            west: this.lons[0],
            south: this.lats[0],
            east: this.lons[this.lons.length - 1],
            north: this.lats[this.lats.length - 1]
        };
    }

    getColor(value, scheme) {
        switch (scheme) {
            case 'viridis':
                return this.viridisColor(value);
            case 'plasma':
                return this.plasmaColor(value);
            case 'jet':
                return this.jetColor(value);
            case 'heatmap':
            default:
                return this.heatmapColor(value);
        }
    }

    heatmapColor(value) {
        // 热力图配色：蓝->青->绿->黄->红
        let r, g, b;

        if (value < 0.25) {
            // 蓝到青
            r = 0;
            g = Math.floor(value * 4 * 255);
            b = 255;
        } else if (value < 0.5) {
            // 青到绿
            r = 0;
            g = 255;
            b = Math.floor((1 - (value - 0.25) * 4) * 255);
        } else if (value < 0.75) {
            // 绿到黄
            r = Math.floor((value - 0.5) * 4 * 255);
            g = 255;
            b = 0;
        } else {
            // 黄到红
            r = 255;
            g = Math.floor((1 - (value - 0.75) * 4) * 255);
            b = 0;
        }

        return { r, g, b };
    }

    viridisColor(value) {
        // Viridis 配色方案
        const viridis = [
            [68, 1, 84], [72, 35, 116], [65, 68, 135], [52, 104, 94],
            [34, 139, 69], [122, 198, 49], [253, 231, 37]
        ];
        return this.interpolateColor(value, viridis);
    }

    plasmaColor(value) {
        // Plasma 配色方案
        const plasma = [
            [13, 8, 135], [75, 3, 161], [125, 3, 168], [167, 23, 147],
            [202, 52, 118], [229, 80, 88], [248, 120, 51], [252, 167, 25],
            [240, 218, 44]
        ];
        return this.interpolateColor(value, plasma);
    }

    jetColor(value) {
        // Jet 配色方案
        const jet = [
            [0, 0, 143], [0, 0, 255], [0, 127, 255], [0, 255, 255],
            [127, 255, 127], [255, 255, 0], [255, 127, 0], [255, 0, 0],
            [128, 0, 0]
        ];
        return this.interpolateColor(value, jet);
    }

    interpolateColor(value, colors) {
        const n = colors.length - 1;
        const idx = value * n;
        const lowIdx = Math.floor(idx);
        const highIdx = Math.min(lowIdx + 1, n);
        const frac = idx - lowIdx;

        const lowColor = colors[lowIdx];
        const highColor = colors[highIdx];

        return {
            r: Math.floor(lowColor[0] + frac * (highColor[0] - lowColor[0])),
            g: Math.floor(lowColor[1] + frac * (highColor[1] - lowColor[1])),
            b: Math.floor(lowColor[2] + frac * (highColor[2] - lowColor[2]))
        };
    }
}