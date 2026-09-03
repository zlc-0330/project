/*
 * @Author: zhanglichun 954751293@qq.com
 * @Date: 2026-05-07 18:13:59
 * @LastEditors: zhanglichun 954751293@qq.com
 * @LastEditTime: 2026-07-21 15:18:44
 * @FilePath: \dt-imes\public\config.js
 * @Description: 全局路径配置
 */
(function () {

  let tdtKey = 'd02d48f8326cac3f453e449819ce972d'
  // 外网
  // window.config = {
  //   // env: "online",
  //   //api: "http://192.168.1.88:9357",
  //   //api: "http://111.198.53.155.82:19019",
  //   // api: "http://192.168.189.96:19019",
  //   //api: "http://192.168.189.96:19019",
  //   // 'http://192.168.112.179' MM
  //   // 'http://111.198.53.155.174'  5G
  //   api: "http://111.198.53.155:8200/dt-service-manager",
  //   wsUrl: "http://111.198.53.155:8200/dt-service-manager/ws",
  //   tokenKey: "dt-view",
  //   // mapUrl: 'http://127.0.0.1:9811/Tiles_BIGEMAP/{z}/{x}/{y}.png',  // 测试用, 打包时换成线上
  //   // mapUrl: 'http://111.198.53.155:8201/html/Tiles_BIGEMAP/{z}/{x}/{y}.png',   // 测试用, 打包时换成线上
  //   mapUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  //   // kmlUrl: "http://192.168.31.176:8888/html/Tiles_BIGEMAP/桃园_卫图.kml",  //测试用后端本地kml,打包时换成线上
  //   kmlUrl: "http://111.198.53.155:8201/html/Tiles_BIGEMAP/桃园_卫图.kml",  //测试用后端本地kml,打包时换成线上
  //   terrainUrl: 'http://111.198.53.155:8201/html/taiwanDEM',
  //   simulationId: 1,  //导条id，后期接口替换，暂时写死
  //   // mapUrl: 'http://127.0.0.1:9811/{z}/{x}/{y}.png',
  //   // kmlUrl: "http://127.0.0.1:9811/台湾桃园1-19_范围.kml",
  // };
  // let base = "http://localhost"
  // ========= 本地固定后端地址 =========
  const LOCAL_BASE = "http://192.168.1.92"

  const location = window.location;
  const host = location.hostname;
  const protocol = location.protocol;

  let base;
  // 判断本地环境：localhost、127.0.0.1 视为本地开发
  const isLocalEnv = ["localhost", "127.0.0.1"].includes(host);

  if (isLocalEnv) {
    // 本地开发，使用写死内网地址
    base = LOCAL_BASE;
  } else {
    // 部署环境：自动获取当前访问域名/IP
    base = `${protocol}//${host}`;
  }
  // 内网
  window.config = {
    // env: "online",
    //api: "http://192.168.1.88:9357",
    //api: "http://111.198.53.155.82:19019",
    // api: "http://192.168.189.96:19019",
    //api: "http://192.168.189.96:19019",
    // 'http://192.168.112.179' MM
    // 'http://111.198.53.155.174'  5G
    api: `${base}:8200/dt-service-manager`,
    wsUrl: `${base}:8200/dt-service-manager/ws`,
    tokenKey: "dt-view",
    // mapUrl: 'http://127.0.0.1:9811/Tiles_BIGEMAP/{z}/{x}/{y}.png',  // 测试用, 打包时换成线上
    // mapUrl: 'http://111.198.53.155:8201/html/Tiles_BIGEMAP/{z}/{x}/{y}.png',   // 测试用, 打包时换成线上
    // mapUrl: `${base}:8201/html/Tiles_BIGEMAP/{z}/{x}/{y}.png`,
    mapUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // kmlUrl: "http://192.168.31.176:8888/html/Tiles_BIGEMAP/桃园_卫图.kml",  //测试用后端本地kml,打包时换成线上
    kmlUrl: `${base}:8201/html/Tiles_BIGEMAP/桃园_卫图.kml`,  //测试用后端本地kml,打包时换成线上
    terrainUrl: `${base}:8201/html/taiwanDEM`,
    simulationId: 1,  //导条id，后期接口替换，暂时写死
    // mapUrl: 'http://127.0.0.1:9811/{z}/{x}/{y}.png',
    // kmlUrl: "http://127.0.0.1:9811/台湾桃园1-19_范围.kml",
  };
})();