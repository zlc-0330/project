/*
 * @Author: zhanglichun 954751293@qq.com
 * @Date: 2026-07-08 09:27:53
 * @LastEditors: zhanglichun 954751293@qq.com
 * @LastEditTime: 2026-08-04 10:00:21
 * @FilePath: \cesium-example\public\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 唯一配置源头，只在浏览器运行
const BASE_URL = "project/cesium-example"
const SOURCE_BASE = 'https://cdn.jsdelivr.net/gh/zlc-0330/project-file-server@main/cesiumExample/'
// const SOURCE_BASE = 'https://zlc-0330.github.io/project-file-server/cesiumExample/'

const config = {
  root: BASE_URL,
  sourceUrl: SOURCE_BASE,

  utils: SOURCE_BASE + 'utils/',
  assets: SOURCE_BASE + 'assets/',
  libs: SOURCE_BASE + 'libs/',
  data: SOURCE_BASE + 'data/',

  getResourceUrl (type, path) {
    const base = this[type] || this.sourceUrl
    return base + (path.startsWith('/') ? path.slice(1) : path)
  }
}

// 挂载全局window，所有页面直接访问
window.config = config

// DNS预解析逻辑
if (typeof document !== "undefined") {
  const preconnectTargets = [
    // 'https://zlc-0330.github.io',
    'https://cdn.jsdelivr.net',
    // 'https://unpkg.com'
    // 'https://cdn.jsdelivr.net/npm'
    'https://registry.npmmirror.com'
  ];
  preconnectTargets.forEach(target => {
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = target;
    document.head.appendChild(dnsLink);

    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = target;
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);
  });
}