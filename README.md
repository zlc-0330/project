<!--
 * @Author: zhanglichun 954751293@qq.com
 * @Date: 2026-07-03 10:09:01
 * @LastEditors: zhanglichun 954751293@qq.com
 * @LastEditTime: 2026-07-03 10:16:40
 * @FilePath: \project\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

#### 🌿 分布式仓库开发模式 https://zlc-0330.github.io/project/

- 运行框架 - 确保联网(three、gsap等依赖引入) - 服务端口指向index.html 如nginx apache liveServer等



```
目录结构
├── assets/             # 运行框架
├── threeExamples/      # three.js 案例代码目录
├── cesiumExamples/     # cesium 案例代码目录
├── js/                 # 第三方js依赖存放处
├── files/              # 模型、图片等资源
├── config/             # 配置项
│   ├── site            # 网站配置
│   ├── host            # 主机配置
│   ├── links           # 导航链接
│   ├── lang            # 语言配置
│   ├── author          # 作者信息
│   ├── three-examples  # three 案例配置
│   ├── cesium-example  # cesium 案例配置
│   └── config          # 总配置
├── .gitignore          # git 忽略文件
├── index.html          # 入口页面
├── LICENSE             # 开源协议
└── README.md           # 项目说明
```

```js
// HOST 自动获取 当前域名/ip 防止部署环境不同 资源引用失效
{
    id: '列表唯一id',
    name: '名称',
    name_en: '英文名',
    tag: '标签名字-背景颜色-字体大小',
    tip: '提示信息',
    author: '作者id',
    referUrl: '案例参考来源地址', // 如 没有可不配置
    downloadUrl: '附带下载的url', // 如three.js => 高级案例 => 桃花亭 配置后refer将不显示
    imporver: '优化作者', // 优化作者的id
    links: [{ url: '连接', name: '名称' }] //配置link imporver 将不显示
    image: HOST + 'threeExamples/basic/test.jpg', // 对应窗口图
    codeUrl: HOST + 'threeExamples/basic/test.js', // js module格式 大多数案例形式
    htmlUrl: HOST + 'threeExamples/test/test.html' // html 在线格式 如 three案例 => 粒子 => 随机粒子 粒子行星
    openUrl: '预览外联地址url', // openurl 和 codeurl 为二选一形式 如 可见桃花亭 su7 案例
    githubUrl: '附带github 仓库的url', // 如 three.js => 开源作品 => su7
    meta: {
        title: '此案例网站标题',
        keywords: '搜索引擎关键字',
        description: '此案例页面描述'
    }
}
```
## 🏠 搭建自己的分布式存储仓库

- 架构设计是以请求资源形式访问代码,如codeUrl image，等资源文件不局限于存储在本仓库中，例如存储在你自己的服务器，然后 url 访问到你的文件即可，类似于请求接口。

- 然后在此仓库仅配置 案例信息即可

- 因github.io是https, https 访问限制 http 会被自动禁止, 建议搭建自己的 github page ,使用 github 充当自己的资源服务器。

- 如：我的一些分布式资源存储在 https://github.com/zlc-0330/project-file-server 仓库下 —— 访问服务: https://zlc-0330.github.io/project-file-server/

- github page 搭建 => 创建仓库 => 进入管理页面 => setting => pages => Build and deployment => source (depoly from a branch) => branch 选择对应分支 => save 即可

- 注： github page 搭建完成后 浏览器直接访问如 https://xxxx.github.io/xxxx/ 目录404整行现象，路径精确到文件后访问可正常

- 可通过 config/links 文件修改 所有的链接和 logo




