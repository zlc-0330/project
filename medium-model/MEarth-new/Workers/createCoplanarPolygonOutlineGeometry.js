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

import{a as T}from"./chunk-YMDUJTLZ.js";import"./chunk-6PVRDAJT.js";import{a as f}from"./chunk-D7YQHWDO.js";import"./chunk-6A32WNKQ.js";import{a as G}from"./chunk-RF6GYIMZ.js";import{a as C}from"./chunk-3PPUTDYN.js";import"./chunk-6UHULUHA.js";import"./chunk-GQGWHF2S.js";import"./chunk-UE2NESYR.js";import"./chunk-J5HAR5AR.js";import"./chunk-QAB7PY2K.js";import{a as L}from"./chunk-QXKBRMAL.js";import"./chunk-CA3J5UPE.js";import"./chunk-NEEZIKMM.js";import"./chunk-A6AYOQ4B.js";import{a as w}from"./chunk-IHJIQGDI.js";import{a as O}from"./chunk-FUN3J34G.js";import{b,c as d,d as k}from"./chunk-6CSDBS2J.js";import{d as P}from"./chunk-S7PU2XTJ.js";import"./chunk-F6FOGTW4.js";import"./chunk-ICXXXG2B.js";import{a as H}from"./chunk-TKA2JGEM.js";import{a as l,c as g}from"./chunk-5E6HPKC5.js";import"./chunk-CG5CKWCD.js";import"./chunk-IBAO62UG.js";import"./chunk-HNUZQH2U.js";import{a as c}from"./chunk-P44SUSQU.js";import{b as a}from"./chunk-JRLD7XJL.js";import{d as u}from"./chunk-WKHTDDYR.js";function E(o){let e=o.length,t=new Float64Array(e*3),r=w.createTypedArray(e,e*2),i=0,s=0;for(let n=0;n<e;n++){let p=o[n];t[i++]=p.x,t[i++]=p.y,t[i++]=p.z,r[s++]=n,r[s++]=(n+1)%e}let y=new O({position:new k({componentDatatype:H.DOUBLE,componentsPerAttribute:3,values:t})});return new d({attributes:y,indices:r,primitiveType:b.LINES})}function m(o){o=c(o,c.EMPTY_OBJECT);let e=o.polygonHierarchy;a.defined("options.polygonHierarchy",e),this._polygonHierarchy=e,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=f.computeHierarchyPackedLength(e,l)+1}m.fromPositions=function(o){o=c(o,c.EMPTY_OBJECT),a.defined("options.positions",o.positions);let e={polygonHierarchy:{positions:o.positions}};return new m(e)};m.pack=function(o,e,t){return a.typeOf.object("value",o),a.defined("array",e),t=c(t,0),t=f.packPolygonHierarchy(o._polygonHierarchy,e,t,l),e[t]=o.packedLength,e};var v={polygonHierarchy:{}};m.unpack=function(o,e,t){a.defined("array",o),e=c(e,0);let r=f.unpackPolygonHierarchy(o,e,l);e=r.startingIndex,delete r.startingIndex;let i=o[e];return u(t)||(t=new m(v)),t._polygonHierarchy=r,t.packedLength=i,t};m.createGeometry=function(o){let e=o._polygonHierarchy,t=e.positions;if(t=L(t,l.equalsEpsilon,!0),t.length<3||!T.validOutline(t))return;let i=f.polygonOutlinesFromHierarchy(e,!1);if(i.length===0)return;let s=[];for(let p=0;p<i.length;p++){let _=new G({geometry:E(i[p])});s.push(_)}let y=C.combineInstances(s)[0],n=P.fromPoints(e.positions);return new d({attributes:y.attributes,indices:y.indices,primitiveType:y.primitiveType,boundingSphere:n})};var h=m;function A(o,e){return u(e)&&(o=h.unpack(o,e)),o._ellipsoid=g.clone(o._ellipsoid),h.createGeometry(o)}var Z=A;export{Z as default};
