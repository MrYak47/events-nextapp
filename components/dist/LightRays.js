"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var ogl_1 = require("ogl");
require("./LightRays.css");
var DEFAULT_COLOR = "#ffffff";
var hexToRgb = function (hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
        ? [
            parseInt(m[1], 16) / 255,
            parseInt(m[2], 16) / 255,
            parseInt(m[3], 16) / 255,
        ]
        : [1, 1, 1];
};
var getAnchorAndDir = function (origin, w, h) {
    var outside = 0.2;
    switch (origin) {
        case "top-left":
            return { anchor: [0, -outside * h], dir: [0, 1] };
        case "top-right":
            return { anchor: [w, -outside * h], dir: [0, 1] };
        case "top-center-offset":
            return { anchor: [0.5 * w + 0.2 * w, -outside * h], dir: [-0.2, 1] };
        case "left":
            return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
        case "right":
            return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
        case "bottom-left":
            return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
        case "bottom-center":
            return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
        case "bottom-right":
            return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
        default: // "top-center"
            return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
};
var LightRays = function (_a) {
    var _b = _a.raysOrigin, raysOrigin = _b === void 0 ? "top-center" : _b, _c = _a.raysColor, raysColor = _c === void 0 ? DEFAULT_COLOR : _c, _d = _a.raysSpeed, raysSpeed = _d === void 0 ? 1 : _d, _e = _a.lightSpread, lightSpread = _e === void 0 ? 1 : _e, _f = _a.rayLength, rayLength = _f === void 0 ? 2 : _f, _g = _a.pulsating, pulsating = _g === void 0 ? false : _g, _h = _a.fadeDistance, fadeDistance = _h === void 0 ? 1.0 : _h, _j = _a.saturation, saturation = _j === void 0 ? 1.0 : _j, _k = _a.followMouse, followMouse = _k === void 0 ? true : _k, _l = _a.mouseInfluence, mouseInfluence = _l === void 0 ? 0.1 : _l, _m = _a.noiseAmount, noiseAmount = _m === void 0 ? 0.0 : _m, _o = _a.distortion, distortion = _o === void 0 ? 0.0 : _o, _p = _a.className, className = _p === void 0 ? "" : _p;
    var containerRef = react_1.useRef(null);
    var uniformsRef = react_1.useRef(null);
    var rendererRef = react_1.useRef(null);
    var mouseRef = react_1.useRef({ x: 0.5, y: 0.5 });
    var smoothMouseRef = react_1.useRef({ x: 0.5, y: 0.5 });
    var animationIdRef = react_1.useRef(null);
    var meshRef = react_1.useRef(null);
    var cleanupFunctionRef = react_1.useRef(null);
    var _q = react_1.useState(false), isVisible = _q[0], setIsVisible = _q[1];
    var observerRef = react_1.useRef(null);
    react_1.useEffect(function () {
        if (!containerRef.current)
            return;
        observerRef.current = new IntersectionObserver(function (entries) {
            var entry = entries[0];
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });
        observerRef.current.observe(containerRef.current);
        return function () {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, []);
    react_1.useEffect(function () {
        if (!isVisible || !containerRef.current)
            return;
        if (cleanupFunctionRef.current) {
            cleanupFunctionRef.current();
            cleanupFunctionRef.current = null;
        }
        var initializeWebGL = function () { return __awaiter(void 0, void 0, void 0, function () {
            var renderer, gl, vert, frag, uniforms, geometry, program, mesh, updatePlacement, loop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!containerRef.current)
                            return [2 /*return*/];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                    case 1:
                        _a.sent();
                        if (!containerRef.current)
                            return [2 /*return*/];
                        renderer = new ogl_1.Renderer({
                            dpr: Math.min(window.devicePixelRatio, 2),
                            alpha: true
                        });
                        rendererRef.current = renderer;
                        gl = renderer.gl;
                        gl.canvas.style.width = "100%";
                        gl.canvas.style.height = "100%";
                        while (containerRef.current.firstChild) {
                            containerRef.current.removeChild(containerRef.current.firstChild);
                        }
                        containerRef.current.appendChild(gl.canvas);
                        vert = "\n   attribute vec2 position;\n   varying vec2 vUv;\n   void main() {\n   vUv = position * 0.5 + 0.5;\n   gl_Position = vec4(position, 0.0, 1.0);\n   }";
                        frag = "precision highp float;\n\n   uniform float iTime;\n   uniform vec2  iResolution;\n\n   uniform vec2  rayPos;\n   uniform vec2  rayDir;\n   uniform vec3  raysColor;\n   uniform float raysSpeed;\n   uniform float lightSpread;\n   uniform float rayLength;\n   uniform float pulsating;\n   uniform float fadeDistance;\n   uniform float saturation;\n   uniform vec2  mousePos;\n   uniform float mouseInfluence;\n   uniform float noiseAmount;\n   uniform float distortion;\n\n   varying vec2 vUv;\n\n   float noise(vec2 st) {\n   return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n   }\n\n   float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,\n                     float seedA, float seedB, float speed) {\n   vec2 sourceToCoord = coord - raySource;\n   vec2 dirNorm = normalize(sourceToCoord);\n   float cosAngle = dot(dirNorm, rayRefDirection);\n\n   float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;\n   \n   float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));\n\n   float distance = length(sourceToCoord);\n   float maxDistance = iResolution.x * rayLength;\n   float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);\n   \n   float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);\n   float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;\n\n   float baseStrength = clamp(\n      (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +\n      (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),\n      0.0, 1.0\n   );\n\n  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;\n}\n\nvoid mainImage(out vec4 fragColor, in vec2 fragCoord) {\n   vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);\n   \n   vec2 finalRayDir = rayDir;\n   if (mouseInfluence > 0.0) {\n      vec2 mouseScreenPos = mousePos * iResolution.xy;\n      vec2 mouseDirection = normalize(mouseScreenPos - rayPos);\n      finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));\n   }\n\n   vec4 rays1 = vec4(1.0) *\n                  rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,\n                              1.5 * raysSpeed);\n   vec4 rays2 = vec4(1.0) *\n                  rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,\n                              1.1 * raysSpeed);\n\n   fragColor = rays1 * 0.5 + rays2 * 0.4;\n\n   if (noiseAmount > 0.0) {\n      float n = noise(coord * 0.01 + iTime * 0.1);\n      fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);\n   }\n\n   float brightness = 1.0 - (coord.y / iResolution.y);\n   fragColor.x *= 0.1 + brightness * 0.8;\n   fragColor.y *= 0.3 + brightness * 0.6;\n   fragColor.z *= 0.5 + brightness * 0.5;\n\n   if (saturation != 1.0) {\n      float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));\n      fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);\n   }\n\n   fragColor.rgb *= raysColor;\n}\n\nvoid main() {\n   vec4 color;\n   mainImage(color, gl_FragCoord.xy);\n   gl_FragColor  = color;\n}";
                        uniforms = {
                            iTime: { value: 0 },
                            iResolution: { value: [1, 1] },
                            rayPos: { value: [0, 0] },
                            rayDir: { value: [0, 1] },
                            raysColor: { value: hexToRgb(raysColor) },
                            raysSpeed: { value: raysSpeed },
                            lightSpread: { value: lightSpread },
                            rayLength: { value: rayLength },
                            pulsating: { value: pulsating ? 1.0 : 0.0 },
                            fadeDistance: { value: fadeDistance },
                            saturation: { value: saturation },
                            mousePos: { value: [0.5, 0.5] },
                            mouseInfluence: { value: mouseInfluence },
                            noiseAmount: { value: noiseAmount },
                            distortion: { value: distortion }
                        };
                        uniformsRef.current = uniforms;
                        geometry = new ogl_1.Triangle(gl);
                        program = new ogl_1.Program(gl, {
                            vertex: vert,
                            fragment: frag,
                            uniforms: uniforms
                        });
                        mesh = new ogl_1.Mesh(gl, { geometry: geometry, program: program });
                        meshRef.current = mesh;
                        updatePlacement = function () {
                            if (!containerRef.current || !renderer)
                                return;
                            renderer.dpr = Math.min(window.devicePixelRatio, 2);
                            var _a = containerRef.current, wCSS = _a.clientWidth, hCSS = _a.clientHeight;
                            renderer.setSize(wCSS, hCSS);
                            var dpr = renderer.dpr;
                            var w = wCSS * dpr;
                            var h = hCSS * dpr;
                            uniforms.iResolution.value = [w, h];
                            var _b = getAnchorAndDir(raysOrigin, w, h), anchor = _b.anchor, dir = _b.dir;
                            uniforms.rayPos.value = anchor;
                            uniforms.rayDir.value = dir;
                        };
                        loop = function (t) {
                            if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
                                return;
                            }
                            uniforms.iTime.value = t * 0.001;
                            if (followMouse && mouseInfluence > 0.0) {
                                var smoothing = 0.92;
                                smoothMouseRef.current.x =
                                    smoothMouseRef.current.x * smoothing +
                                        mouseRef.current.x * (1 - smoothing);
                                smoothMouseRef.current.y =
                                    smoothMouseRef.current.y * smoothing +
                                        mouseRef.current.y * (1 - smoothing);
                                uniforms.mousePos.value = [
                                    smoothMouseRef.current.x,
                                    smoothMouseRef.current.y,
                                ];
                            }
                            try {
                                renderer.render({ scene: mesh });
                                animationIdRef.current = requestAnimationFrame(loop);
                            }
                            catch (error) {
                                console.warn("WebGL rendering error:", error);
                                return;
                            }
                        };
                        window.addEventListener("resize", updatePlacement);
                        updatePlacement();
                        animationIdRef.current = requestAnimationFrame(loop);
                        cleanupFunctionRef.current = function () {
                            if (animationIdRef.current) {
                                cancelAnimationFrame(animationIdRef.current);
                                animationIdRef.current = null;
                            }
                            window.removeEventListener("resize", updatePlacement);
                            if (renderer) {
                                try {
                                    var canvas = renderer.gl.canvas;
                                    var loseContextExt = renderer.gl.getExtension("WEBGL_lose_context");
                                    if (loseContextExt) {
                                        loseContextExt.loseContext();
                                    }
                                    if (canvas && canvas.parentNode) {
                                        canvas.parentNode.removeChild(canvas);
                                    }
                                }
                                catch (error) {
                                    console.warn("Error during WebGL cleanup:", error);
                                }
                            }
                            rendererRef.current = null;
                            uniformsRef.current = null;
                            meshRef.current = null;
                        };
                        return [2 /*return*/];
                }
            });
        }); };
        initializeWebGL();
        return function () {
            if (cleanupFunctionRef.current) {
                cleanupFunctionRef.current();
                cleanupFunctionRef.current = null;
            }
        };
    }, [
        isVisible,
        raysOrigin,
        raysColor,
        raysSpeed,
        lightSpread,
        rayLength,
        pulsating,
        fadeDistance,
        saturation,
        followMouse,
        mouseInfluence,
        noiseAmount,
        distortion,
    ]);
    react_1.useEffect(function () {
        if (!uniformsRef.current || !containerRef.current || !rendererRef.current)
            return;
        var u = uniformsRef.current;
        var renderer = rendererRef.current;
        u.raysColor.value = hexToRgb(raysColor);
        u.raysSpeed.value = raysSpeed;
        u.lightSpread.value = lightSpread;
        u.rayLength.value = rayLength;
        u.pulsating.value = pulsating ? 1.0 : 0.0;
        u.fadeDistance.value = fadeDistance;
        u.saturation.value = saturation;
        u.mouseInfluence.value = mouseInfluence;
        u.noiseAmount.value = noiseAmount;
        u.distortion.value = distortion;
        var _a = containerRef.current, wCSS = _a.clientWidth, hCSS = _a.clientHeight;
        var dpr = renderer.dpr;
        var _b = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr), anchor = _b.anchor, dir = _b.dir;
        u.rayPos.value = anchor;
        u.rayDir.value = dir;
    }, [
        raysColor,
        raysSpeed,
        lightSpread,
        raysOrigin,
        rayLength,
        pulsating,
        fadeDistance,
        saturation,
        mouseInfluence,
        noiseAmount,
        distortion,
    ]);
    react_1.useEffect(function () {
        var handleMouseMove = function (e) {
            if (!containerRef.current || !rendererRef.current)
                return;
            var rect = containerRef.current.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width;
            var y = (e.clientY - rect.top) / rect.height;
            mouseRef.current = { x: x, y: y };
        };
        if (followMouse) {
            window.addEventListener("mousemove", handleMouseMove);
            return function () { return window.removeEventListener("mousemove", handleMouseMove); };
        }
    }, [followMouse]);
    return (React.createElement("div", { ref: containerRef, className: ("pointer-events-none relative z-[3] h-full w-full overflow-hidden " + className).trim() }));
};
exports["default"] = LightRays;
