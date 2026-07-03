/*
 * @Author: zhanglichun 954751293@qq.com
 * @Date: 2026-07-03 10:36:51
 * @LastEditors: zhanglichun 954751293@qq.com
 * @LastEditTime: 2026-07-03 15:18:33
 * @FilePath: \project\config\project-examples.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { FILE_HOST, HOST } from "./host.js";

export default [
    // {
    //     pid: "projects",
    //     name: "projects",
    //     name_en: "项目积累",
    //     children: [
    //         {
    //             id: "zlc-0330",
    //             // tag: TEXTS["官网"] + "-rgb(0, 153, 255)",
    //             name: "cesium示例",
    //             name_en: "cesium示例",
    //             openUrl: "https://zlc-0330.github.io/project/",
    //             githubUrl: "https://github.com/zlc-0330/project",
    //             image: FILE_HOST + "images/CeiumJS.png",
    //         }
    //     ],
    // },
    // {
    //     pid: "cesium",
    //     name: "cesium",
    //     name_en: "cesium相关",
    //     children: [
    //         {
    //             id: "zlc-0330",
    //             // tag: TEXTS["官网"] + "-rgb(0, 153, 255)",
    //             name: "cesium示例",
    //             name_en: "cesium示例",
    //             openUrl: "https://sandcastle.cesium.com/",
    //             githubUrl: "https://github.com/CesiumGS/cesium",
    //             image: FILE_HOST + "images/CeiumJS.png",
    //         }
    //     ],
    // },
    {
        gid: 'cesiumGroup',
        group: '三维特效',
        group_en: 'cesium相关',
        pid: 'cesium',
        name: 'cesium',
        name_en: 'cesium',
        children: [
            // 外部链接
            // {
            //     id: 'cesiumExample',
            //     name: 'cesium示例',
            //     name_en: 'cesium示例',
            //     tag: TEXTS['smartCity'],
            //     author: 'zlc-0330',
            //     githubUrl: 'https://github.com/donmccurdy/three-gltf-viewer',
            //     openUrl: 'https://gltf-viewer.donmccurdy.com/',
            //     image: HOST + 'threeExamples/tools/gltf_viewer.jpg'
            // },
        ]
    },

];
