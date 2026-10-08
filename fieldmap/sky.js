/* WebGL layer: the satellite globe and the clouds.
   Clouds are 3D noise wrapped onto the sphere (so they turn and zoom with the globe), lit from the
   upper left and casting soft shadows on the ground. A second, screen-space cloud bank is the one
   you fly through on the way down: it closes to a white-out, then parts from the centre. */
const makeSky = (canvas, satSrc) => {
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const VS = `#version 300 es
  in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;
  const FS = `#version 300 es
  precision highp float;
  uniform vec2 uRes; uniform vec3 uGlobe; uniform vec2 uCam; uniform float uK;
  uniform float uSat, uCloud, uCover, uTime, uDive, uDiveZ, uPart, uHasTex;
  uniform vec2 uWO; uniform float uPush, uWind, uClear;   // breath: where it comes from, how far it has pushed, how hard right now
  uniform sampler2D uTex;
  out vec4 o;
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+10.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 nr=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=nr.x; p1*=nr.y; p2*=nr.z; p3*=nr.w;
    vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
    return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float fbm(vec3 p, int oct){ float a=.5, s=0.; for(int i=0;i<8;i++){ if(i>=oct) break; s+=a*snoise(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5; } return .5+.5*s; }
  // billowy cloud density: soft fbm, with the lumps sharpened a touch
  float cloudD(vec3 p, int oct){ vec3 w=vec3(snoise(p*.7+3.1),snoise(p*.7+7.7),snoise(p*.7+1.3))*.18; float d=fbm(p+w,oct); return d; }

  // screen pixel → point on the globe
  bool sphereAt(vec2 px, out vec3 wp, out float z, out float lon, out float lat){
    vec2 v = (px-uGlobe.xy)/uGlobe.z; v.y = -v.y; float r2 = dot(v,v);
    if (r2 >= 1.) return false;
    z = sqrt(1.-r2); float sl = sin(uCam.y), cl = cos(uCam.y);
    lat = asin(clamp(v.y*cl+z*sl,-1.,1.)); lon = uCam.x + atan(v.x, z*cl-v.y*sl);
    wp = vec3(cos(lat)*cos(lon), sin(lat), cos(lat)*sin(lon)); return true;
  }
  void main(){
    vec2 fc = vec2(gl_FragCoord.x, uRes.y-gl_FragCoord.y);
    vec4 col = vec4(0.);
    // breath: clouds near the source are blown outwards (sampled from closer in) and thinned
    float mn = min(uRes.x, uRes.y);
    vec2 dv = fc-uWO; float dd = length(dv);
    vec2 sfc = fc - (dd > .5 ? dv/dd : vec2(0.)) * uPush*mn*.55*exp(-dd/(mn*.5));
    // local gust around the breath, plus an overall clearing that builds while someone keeps blowing
    float gust = uPush*.6*exp(-dd/(mn*.34)) + uWind*.07 + uClear*(.75 + .5*smoothstep(0., mn*.9, mn*.9-dd));
    vec2 v = (fc-uGlobe.xy)/uGlobe.z; v.y = -v.y;
    float r2 = dot(v,v);
    if (r2 < 1. && (uSat > .001 || uCloud > .001)) {
      float z = sqrt(1.-r2), sl = sin(uCam.y), cl = cos(uCam.y);
      float lat = asin(clamp(v.y*cl+z*sl,-1.,1.));
      float lon = uCam.x + atan(v.x, z*cl-v.y*sl);
      vec3 wp = vec3(cos(lat)*cos(lon), sin(lat), cos(lat)*sin(lon));
      // ---- ground
      if (uSat > .001 && uHasTex > .5) {
        vec3 s = texture(uTex, vec2(lon/6.2831853+.5, .5-lat/3.1415927)).rgb;
        s = pow(s, vec3(1.12));                                   // a little deeper, a little calmer
        float lum = dot(s, vec3(.299,.587,.114));
        s = mix(vec3(lum), s, .82) * vec3(.98,1.,.97);
        float sea = smoothstep(.04, .16, s.b - s.r);             // calm the Blue Marble oceans down
        s = mix(s, s*vec3(.62,.78,.86), sea*.6);
        float det = snoise(wp*520.)*.5+snoise(wp*1300.)*.3;       // fine grain when close in
        s *= 1. + det*.07*smoothstep(2.2, 5., uK);
        s *= mix(.42, 1.06, pow(z,.45));                          // falls into shadow at the edge
        s = mix(s, vec3(.52,.64,.74), pow(1.-z, 3.)*.55);         // atmospheric haze at the limb
        col = vec4(s*uSat, uSat);
      }
      // ---- weather on the globe
      vec3 cwp; float cz, clon, clat;
      if (uCloud > .001 && sphereAt(sfc, cwp, cz, clon, clat)) {
        wp = cwp; z = min(z, cz);
        vec3 drift = vec3(uTime*.006, uTime*.0012, -uTime*.004);
        vec3 p = wp*3.1 + drift;
        float d  = cloudD(p, 7);
        vec3 sun = vec3(-.035, .045, .03);
        float dl = fbm(p+sun, 4);
        float ds = fbm(p+sun*3.2, 4);
        float th = uCover + gust;
        float c  = smoothstep(th, th+.2, d);
        float shadow = smoothstep(th, th+.28, ds) * (1.-c);
        float light = clamp(.62 + (d-dl)*5.2, 0., 1.);
        float thick = smoothstep(th, th+.45, d);
        vec3 cc = mix(vec3(.56,.60,.65), vec3(1.,.995,.985), light) * mix(.92, 1.03, thick);
        float limb = smoothstep(0., .22, z);
        float sa = .38*shadow*uCloud*limb;
        col.rgb *= (1.-sa); col.a = col.a + sa*(1.-col.a);       // shadow falls on whatever is below
        float ca = c*uCloud*limb*mix(.78, 1., thick);
        col = vec4(cc*ca, ca) + col*(1.-ca);
      }
    }
    // ---- the cloud bank you fly through
    if (uDive > .001) {
      vec2 q = (sfc-uRes*.5)/mn;
      float sc = mix(1.9, .32, uDiveZ);
      vec3 p2 = vec3(q*sc, uDiveZ*1.6 + uTime*.015);
      vec3 w = vec3(fbm(p2+vec3(3.1,1.7,0.),3), fbm(p2+vec3(7.3,2.9,4.),3), 0.)-.5;
      vec3 pp = p2 + w*.32;
      float d  = fbm(pp, 7);
      float dl = fbm(pp+vec3(-.05,.06,0.), 4);
      float rr = length(q*vec2(.85,1.)) + (fbm(p2*1.3+9.,3)-.5)*.7;   // ragged, not round
      float hole = uPart*1.5;
      float th = mix(1.0, -.25, uDive) + smoothstep(hole, hole-.8, rr)*1.4*step(.001,uPart) + gust*1.5 + uClear*.9;
      float a = smoothstep(th, th+.22, d);
      float light = clamp(.64 + (d-dl)*6., 0., 1.);
      vec3 cc = mix(vec3(.62,.66,.70), vec3(1.,.995,.985), light);
      cc = mix(cc, vec3(.95,.955,.95), smoothstep(.6,1.,uDive)*(1.-uPart)*.7);
      col = vec4(cc*a, a) + col*(1.-a);
    }
    o = col;
  }`;
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(x)); return null; } return x; };
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return null;
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(pr)); return null; }
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['uWO', 'uPush', 'uWind', 'uClear', 'uRes', 'uGlobe', 'uCam', 'uK', 'uSat', 'uCloud', 'uCover', 'uTime', 'uDive', 'uDiveZ', 'uPart', 'uHasTex', 'uTex'].forEach(n => U[n] = gl.getUniformLocation(pr, n));
  let hasTex = 0;
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 30, 40, 255]));
  const img = new Image();
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const ext = gl.getExtension('EXT_texture_filter_anisotropic'); if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    hasTex = 1;
  };
  if (satSrc) img.src = satSrc;   // the home page globe has no satellite layer
  gl.uniform1i(U.uTex, 0);
  return {
    render(u, scale) {
      const w = canvas.width, h = canvas.height;
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (u.sat < .001 && u.cloud < .001 && u.dive < .001) return;
      gl.uniform2f(U.uRes, w, h);
      gl.uniform3f(U.uGlobe, u.cx * scale, u.cy * scale, u.R * scale);
      gl.uniform2f(U.uCam, u.lon, u.lat); gl.uniform1f(U.uK, u.k);
      gl.uniform1f(U.uSat, u.sat); gl.uniform1f(U.uCloud, u.cloud); gl.uniform1f(U.uCover, u.cover);
      gl.uniform1f(U.uTime, u.time); gl.uniform1f(U.uDive, u.dive); gl.uniform1f(U.uDiveZ, u.diveZ); gl.uniform1f(U.uPart, u.part);
      gl.uniform1f(U.uHasTex, hasTex);
      gl.uniform2f(U.uWO, (u.wx || 0) * scale, (u.wy || 0) * scale); gl.uniform1f(U.uPush, u.push || 0); gl.uniform1f(U.uWind, u.wind || 0); gl.uniform1f(U.uClear, u.clear || 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    ready: () => hasTex
  };
};
