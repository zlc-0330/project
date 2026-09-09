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

import{a as E,c as F}from"./chunk-Q6OVBFUC.js";import{a as U}from"./chunk-42NAKWZR.js";import{h as I}from"./chunk-D5QYL7FM.js";import{a as e,d as M}from"./chunk-2QGPLVCQ.js";import{a as V}from"./chunk-RSM3RCYG.js";import{a as v}from"./chunk-3G6A2N63.js";import{e as T}from"./chunk-FZAERGXZ.js";var Q={},B=new e,W=new e,ee=new e,k=new e,p=[new e,new e],X=new e,Y=new e,Z=new e,te=new e,ne=new e,oe=new e,re=new e,se=new e,ae=new e,le=new e,H=new I,J=new M;function j(o,s,a,l,r){let d=e.angleBetween(e.subtract(s,o,B),e.subtract(a,o,W)),y=l===E.BEVELED?1:Math.ceil(d/V.toRadians(5))+1,w=y*3,t=new Array(w);t[w-3]=a.x,t[w-2]=a.y,t[w-1]=a.z;let i;r?i=M.fromQuaternion(I.fromAxisAngle(e.negate(o,B),d/y,H),J):i=M.fromQuaternion(I.fromAxisAngle(o,d/y,H),J);let m=0;s=e.clone(s,B);for(let n=0;n<y;n++)s=M.multiplyByVector(i,s,s),t[m++]=s.x,t[m++]=s.y,t[m++]=s.z;return t}function ce(o){let s=X,a=Y,l=Z,r=o[1];a=e.fromArray(o[1],r.length-3,a),l=e.fromArray(o[0],0,l),s=e.midpoint(a,l,s);let d=j(s,a,l,E.ROUNDED,!1),y=o.length-1,w=o[y-1];r=o[y],a=e.fromArray(w,w.length-3,a),l=e.fromArray(r,0,l),s=e.midpoint(a,l,s);let t=j(s,a,l,E.ROUNDED,!1);return[d,t]}function K(o,s,a,l){let r=B;return l?r=e.add(o,s,r):(s=e.negate(s,s),r=e.add(o,s,r)),[r.x,r.y,r.z,a.x,a.y,a.z]}function G(o,s,a,l){let r=new Array(o.length),d=new Array(o.length),y=e.multiplyByScalar(s,a,B),w=e.negate(y,W),t=0,i=o.length-1;for(let m=0;m<o.length;m+=3){let n=e.fromArray(o,m,ee),c=e.add(n,w,k);r[t++]=c.x,r[t++]=c.y,r[t++]=c.z;let x=e.add(n,y,k);d[i--]=x.z,d[i--]=x.y,d[i--]=x.x}return l.push(r,d),l}Q.addAttribute=function(o,s,a,l){let r=s.x,d=s.y,y=s.z;T(a)&&(o[a]=r,o[a+1]=d,o[a+2]=y),T(l)&&(o[l]=y,o[l-1]=d,o[l-2]=r)};var ie=new e,de=new e;Q.computePositions=function(o){let s=o.granularity,a=o.positions,l=o.ellipsoid,r=o.width/2,d=o.cornerType,y=o.saveAttributes,w=o.maxDirScalar,t=X,i=Y,m=Z,n=te,c=ne,x=oe,h=re,u=se,f=ae,z=le,A=[],D=y?[]:void 0,N=y?[]:void 0,_=a.length,g=a[0],P=a[1];i=e.normalize(e.subtract(P,g,i),i),t=l.geodeticSurfaceNormal(g,t),n=e.normalize(e.cross(t,i,n),n),y&&(D.push(n.x,n.y,n.z),N.push(t.x,t.y,t.z)),h=e.clone(g,h),g=P,m=e.negate(i,m);let S,L=[],O;for(O=1;O<_-1;O++){t=l.geodeticSurfaceNormal(g,t),P=a[O+1],i=e.normalize(e.subtract(P,g,i),i),c=e.normalize(e.add(i,m,c),c);let R=e.multiplyByScalar(t,e.dot(i,t),ie);e.subtract(i,R,R),e.normalize(R,R);let b=e.multiplyByScalar(t,e.dot(m,t),de);if(e.subtract(m,b,b),e.normalize(b,b),!V.equalsEpsilon(Math.abs(e.dot(R,b)),1,V.EPSILON7)){c=e.cross(c,t,c),c=e.cross(t,c,c),c=e.normalize(c,c);let $=r/Math.max(v(1/w,.25),e.magnitude(e.cross(c,m,B))),C=F.angleIsGreaterThanPi(i,m,g,l);c=e.multiplyByScalar(c,$,c),C?(u=e.add(g,c,u),z=e.add(u,e.multiplyByScalar(n,r,z),z),f=e.add(u,e.multiplyByScalar(n,r*2,f),f),p[0]=e.clone(h,p[0]),p[1]=e.clone(z,p[1]),S=U.generateArc({positions:p,granularity:s,ellipsoid:l}),A=G(S,n,r,A),y&&(D.push(n.x,n.y,n.z),N.push(t.x,t.y,t.z)),x=e.clone(f,x),n=e.normalize(e.cross(t,i,n),n),f=e.add(u,e.multiplyByScalar(n,r*2,f),f),h=e.add(u,e.multiplyByScalar(n,r,h),h),d===E.ROUNDED||d===E.BEVELED?L.push({leftPositions:j(u,x,f,d,C)}):L.push({leftPositions:K(g,e.negate(c,c),f,C)})):(f=e.add(g,c,f),z=e.add(f,e.negate(e.multiplyByScalar(n,r,z),z),z),u=e.add(f,e.negate(e.multiplyByScalar(n,r*2,u),u),u),p[0]=e.clone(h,p[0]),p[1]=e.clone(z,p[1]),S=U.generateArc({positions:p,granularity:s,ellipsoid:l}),A=G(S,n,r,A),y&&(D.push(n.x,n.y,n.z),N.push(t.x,t.y,t.z)),x=e.clone(u,x),n=e.normalize(e.cross(t,i,n),n),u=e.add(f,e.negate(e.multiplyByScalar(n,r*2,u),u),u),h=e.add(f,e.negate(e.multiplyByScalar(n,r,h),h),h),d===E.ROUNDED||d===E.BEVELED?L.push({rightPositions:j(f,x,u,d,C)}):L.push({rightPositions:K(g,c,u,C)})),m=e.negate(i,m)}g=P}t=l.geodeticSurfaceNormal(g,t),p[0]=e.clone(h,p[0]),p[1]=e.clone(g,p[1]),S=U.generateArc({positions:p,granularity:s,ellipsoid:l}),A=G(S,n,r,A),y&&(D.push(n.x,n.y,n.z),N.push(t.x,t.y,t.z));let q;return d===E.ROUNDED&&(q=ce(A)),{positions:A,corners:L,lefts:D,normals:N,endPositions:q}};var Ee=Q;export{Ee as a};
