/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.109
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as m}from"./chunk-RJBOBO3O.js";import{a as p}from"./chunk-BJ6UCFLP.js";import"./chunk-VYETHQRZ.js";import"./chunk-3PPUTDYN.js";import"./chunk-6UHULUHA.js";import"./chunk-GQGWHF2S.js";import"./chunk-NEEZIKMM.js";import"./chunk-A6AYOQ4B.js";import"./chunk-IHJIQGDI.js";import"./chunk-FUN3J34G.js";import"./chunk-6CSDBS2J.js";import"./chunk-S7PU2XTJ.js";import"./chunk-F6FOGTW4.js";import"./chunk-ICXXXG2B.js";import"./chunk-TKA2JGEM.js";import"./chunk-5E6HPKC5.js";import"./chunk-CG5CKWCD.js";import"./chunk-IBAO62UG.js";import"./chunk-HNUZQH2U.js";import"./chunk-P44SUSQU.js";import"./chunk-JRLD7XJL.js";import{a as f,d as i}from"./chunk-WKHTDDYR.js";var c={};async function d(r){let e=c[r];return i(e)||(typeof exports=="object"?c[e]=e=f(`Workers/${r}`):(e=(await import(`./${r}.js`)).default,c[e]=e)),e}async function k(r,e){let o=r.subTasks,l=o.length,s=new Array(l);for(let t=0;t<l;t++){let n=o[t],u=n.geometry,a=n.moduleName;i(a)?s[t]=d(a).then(y=>y(u,n.offset)):s[t]=u}return Promise.all(s).then(function(t){return m.packCreateGeometryResults(t,e)})}var b=p(k);export{b as default};
