/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.134.1
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
import{a as T}from"./chunk-CAW5BE2L.js";import"./chunk-ZYCILUCF.js";import{a as l}from"./chunk-HJOLI3MG.js";import"./chunk-QXY3EU54.js";import{a as G}from"./chunk-FCCJEZP2.js";import{a as C}from"./chunk-6VRQKJFS.js";import"./chunk-HICISBVP.js";import"./chunk-26UHRUB3.js";import"./chunk-VSL3QDZM.js";import"./chunk-EOYPFHZC.js";import"./chunk-HER2H3SF.js";import{a as L}from"./chunk-6B3DM6A5.js";import"./chunk-7ZWGKBJM.js";import"./chunk-VPIAW7TM.js";import"./chunk-CKDBE4RR.js";import{a as w}from"./chunk-GCWYQAXJ.js";import{a as O}from"./chunk-QND5YPLT.js";import{b,c as d,d as k}from"./chunk-UHBRQJNJ.js";import{d as P}from"./chunk-KWW52NRT.js";import"./chunk-S2E5UWT4.js";import{a as H}from"./chunk-XNSUDY5I.js";import{a as y,d as g,f as u}from"./chunk-HMXGNDLA.js";import"./chunk-V7XA5C77.js";import"./chunk-DGHOUIXA.js";import"./chunk-Q2UJZ7OW.js";import{b as m}from"./chunk-U7V5VQ2T.js";import{e as f}from"./chunk-NVZ5L4JK.js";function E(e){let r=e.length,t=new Float64Array(3*r),n=w.createTypedArray(r,2*r),o=0,i=0;for(let s=0;s<r;s++){let c=e[s];t[o++]=c.x,t[o++]=c.y,t[o++]=c.z,n[i++]=s,n[i++]=(s+1)%r}let s=new O({position:new k({componentDatatype:H.DOUBLE,componentsPerAttribute:3,values:t})});return new d({attributes:s,indices:n,primitiveType:b.LINES})}function c(e){let r=(e=e??u.EMPTY_OBJECT).polygonHierarchy;m.defined("options.polygonHierarchy",r),this._polygonHierarchy=r,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=l.computeHierarchyPackedLength(r,y)+1}c.fromPositions=function(e){return e=e??u.EMPTY_OBJECT,m.defined("options.positions",e.positions),new c({polygonHierarchy:{positions:e.positions}})},c.pack=function(e,r,t){return m.typeOf.object("value",e),m.defined("array",r),t=t??0,r[t=l.packPolygonHierarchy(e._polygonHierarchy,r,t,y)]=e.packedLength,r};var v={polygonHierarchy:{}};c.unpack=function(e,r,t){m.defined("array",e),r=r??0;let n=l.unpackPolygonHierarchy(e,r,y);r=n.startingIndex,delete n.startingIndex;let o=e[r];return f(t)||(t=new c(v)),t._polygonHierarchy=n,t.packedLength=o,t},c.createGeometry=function(e){let r=e._polygonHierarchy,t=r.positions;if(t=L(t,y.equalsEpsilon,!0),t.length<3||!T.validOutline(t))return;let n=l.polygonOutlinesFromHierarchy(r,!1);if(0===n.length)return;let o=[];for(let e=0;e<n.length;e++){let r=new G({geometry:E(n[e])});o.push(r)}let i=C.combineInstances(o)[0],s=P.fromPoints(r.positions);return new d({attributes:i.attributes,indices:i.indices,primitiveType:i.primitiveType,boundingSphere:s})};var h=c;function A(e,r){return f(r)&&(e=h.unpack(e,r)),e._ellipsoid=g.clone(e._ellipsoid),h.createGeometry(e)}var Z=A;export{Z as default};