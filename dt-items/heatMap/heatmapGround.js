import * as Cesium from 'cesium'

class HeatmapGround{
    constructor(viewer,opt){
        this.viewer = viewer;
        this.opt = opt || {};
        this.list = this.opt.list || [];
        if(!this.list || this.list.length < 2){
            console.log("热力图点位不得少于3个");
            return;
        }

        this.canvasSize = this.opt.canvasSize || 800;

        this.canvas = this.createCanvas(this.canvasSize);

        let config = {
            container:this.canvas,
            radius:this.opt.radius || 30,
            maxOpacity:this.opt.maxOpacity || 0.9,
            minOpacity:this.opt.minOpacity || 0.3,
            blur:0.75,
            gradient:this.opt.gradient || {
                "1":"white",
                ".25":"green",
                ".50":"yellow",
                ".75":"orange",
                ".99":"red"
            }
        };
        this.heatmapInstance = h337.create(config);
        this.bounds = this.getBounds(this.list);
        this.drawHeatmap();

    }

    createCanvas(size){
        const container = window.document.createElement("div");
        container.style.width = size + "px";
        container.style.height = size+ "px";
        container.style.display = "none";
        document.body.appendChild(container);
        return container;
    }

    getBounds(list){
        const lons = list.map(p => p.lnglat[0]);
        const lats = list.map(p => p.lnglat[1]);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);

        const paddingLon = (maxLon - minLon) * 0.1;
        const paddingLat = (maxLat - minLat) * 0.1;

        return{
            minLon:minLon - paddingLon,
            maxLon:maxLon + paddingLon,
            minLat:minLat - paddingLat,
            maxLat:maxLat + paddingLat,
        }
    }

    lnglatToCanvasXY(lon,lat){
        const {minLon,maxLon,minLat,maxLat} = this.bounds;
        const x = ((lon-minLon) / (maxLon - minLon)) * this.canvasSize;
        const y = ((maxLat - lat) / (maxLat - minLat)) * this.canvasSize;
        return {x,y};
    }

    drawHeatmap(){
        const points = this.list.map(p => {
            const {x,y} = this.lnglatToCanvasXY(p.lnglat[0],p.lnglat[1]);
            return {
                x:Math.round(x),
                y:Math.round(y),
                value:p.value || 1,
            }
        })
        const maxValue = Math.max(...points.map(p => p.value));
        this.heatmapInstance.setData({
            max:maxValue,
            data:points
        })
        this.addTileLayer();
    }

    addTileLayer(){
        const dataUrl = this.heatmapInstance.getDataURL();
        const {minLon,maxLon,minLat,maxLat} = this.bounds;
        const rectangle = Cesium.Rectangle.fromDegrees(minLon,minLat,maxLon,maxLat);
        this.imagerLayer = this.viewer.imageryLayers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
                url:dataUrl,
                rectangle:rectangle
            })
        )
    }

    destroy(){
        if(this.entity){
            this.viewer.entities.remove(this.entity);
            this.entity = null;
        }
        if(this.imagerLayer){
            this.viewer.imageryLayers.remove(this.imagerLayer);
            this.imagerLayer = null;
        }
        if(this.canvas && this.canvas.parentNode){
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
        }
    }

}

export {HeatmapGround}