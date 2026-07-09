// 唯一配置源头，只在浏览器运行
const BASE_URL = "project/cesium-example"
const SOURCE_BASE = 'https://zlc-0330.github.io/project-file-server/cesiumExample/'

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
    'https://zlc-0330.github.io',
    'https://unpkg.com'
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