/*
 * @Author: zhanglichun 954751293@qq.com
 * @Date: 2026-05-07 18:13:59
 * @LastEditors: zhanglichun 954751293@qq.com
 * @LastEditTime: 2026-06-16 17:03:03
 * @FilePath: \dt-imes\public\config.js
 * @Description: 全局路径配置
 */
let tdtKey = 'd02d48f8326cac3f453e449819ce972d'
window.config = {
  // env: "online",
  //api: "http://192.168.1.88:9357",
  //api: "http://192.168.31.82:19019",
  // api: "http://192.168.189.96:19019",
  //api: "http://192.168.189.96:19019",
  // 'http://192.168.112.179' MM
  // 'http://192.168.31.174'  5G
  api: "http://192.168.31.176:19019/dt-service-manager",
  wsUrl: "http://192.168.31.176:19019/dt-service-manager/ws",
  tokenKey: "dt-view",
  mapUrl: 'http://192.168.31.176:8888/html/Tiles_BIGEMAP/{z}/{x}/{y}.png',
  // mapUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  kmlUrl: "http://192.168.31.176:8888/html/Tiles_BIGEMAP/桃园_卫图.kml",
  // terrainUrl: 'http://192.168.31.176:8888/html/taiwanDEM',
  terrainUrl: 'http://192.168.31.219:9811/taiwanDEM',

  simulationId: 1,  //导条id，后期接口替换，暂时写死
  // mapUrl: 'http://127.0.0.1:9811/{z}/{x}/{y}.png',
  // kmlUrl: "http://127.0.0.1:9811/台湾桃园1-19_范围.kml",
};
