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

import{a as d,b as p,c as h}from"./chunk-2QGPLVCQ.js";import{a as c}from"./chunk-RSM3RCYG.js";import{a as u}from"./chunk-3G6A2N63.js";import{a as s}from"./chunk-BJ5TGS5X.js";import{e as a}from"./chunk-FZAERGXZ.js";function i(t){this._ellipsoid=u(t,h.WGS84),this._semimajorAxis=this._ellipsoid.maximumRadius,this._oneOverSemimajorAxis=1/this._semimajorAxis,this._type="WebMercatorProjection",this._crs="EPSG:3857"}Object.defineProperties(i.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},type:{get:function(){return this._type}},crs:{get:function(){return this._crs}}});i.mercatorAngleToGeodeticLatitude=function(t){return c.PI_OVER_TWO-2*Math.atan(Math.exp(-t))};i.geodeticLatitudeToMercatorAngle=function(t){t>i.MaximumLatitude?t=i.MaximumLatitude:t<-i.MaximumLatitude&&(t=-i.MaximumLatitude);let e=Math.sin(t);return .5*Math.log((1+e)/(1-e))};i.MaximumLatitude=i.mercatorAngleToGeodeticLatitude(Math.PI);i.prototype.project=function(t,e){let o=this._semimajorAxis,r=t.longitude*o,n=i.geodeticLatitudeToMercatorAngle(t.latitude)*o,m=t.height;return a(e)?(e.x=r,e.y=n,e.z=m,e):new d(r,n,m)};i.prototype.unproject=function(t,e){if(!a(t))throw new s("cartesian is required");let o=this._oneOverSemimajorAxis,r=t.x*o,n=i.mercatorAngleToGeodeticLatitude(t.y*o),m=t.z;return a(e)?(e.longitude=r,e.latitude=n,e.height=m,e):new p(r,n,m)};var A=i;export{A as a};
