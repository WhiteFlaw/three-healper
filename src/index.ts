import gsap from 'gsap';
import * as dat from "dat.gui";
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js'

import { Sun } from './Sun';
import { Snow } from './Snow';
import { Tube } from './Tube';
import { Light } from './Light';
import { Curve } from './Curve';
import { Bar3d } from './Bar3d';
import { Pie3d1 } from './Pie3d1';
import { Pie3d2 } from './Pie3d2';
import { Ocean1 } from './Ocean1';
import { Ocean2 } from './Ocean2';
import { Axis3d } from './Axis3d';
import { Effect } from './Effect';
import { Cameras } from './Camera';
import { Controls } from './Controls';
import { MatrixAxis } from './Matrix';
import { Raycaster } from './Raycaster';
import { SphereSky } from './SphereSky';
import { Lensflares } from './Lensflare';
import { Polyline3d } from './Polyline3d';
import { SpriteLabel } from "./SpriteLabel";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { SunInterface } from './interface/Sun';
import { SnowInterface } from './interface/Snow';
import { LightInterface } from './interface/Light';
import { CurveInterface } from './interface/Curve';
import { Ocean1Interface } from './interface/Ocean1';
import { Ocean2Interface } from './interface/Ocean2';
import { EffectInterface } from './interface/Effect';
import { CamerasInterface } from './interface/Camera';
import { RaycasterInterface } from './interface/Raycaster';
import { ControlsInterface, AnyControls } from './interface/Controls';
import { LensflareInterface, LensflareToolInterface } from './interface/Lensflare';

import * as THREEHELPER from './types/index';

export default class THREEHelper {
    moment: THREEHELPER.Time;
    isDayTime: THREEHELPER.IsDay;
    curveMap: Map<CurveInterface, (THREE.Mesh | null)>;
    mixerMap: Map<GLTF, THREE.AnimationMixer>; // 渲染遍历的时候会不会有问题?
    clock: THREEHELPER.Clock;
    domElement: THREEHELPER.Canvas;
    width: THREEHELPER.CanvasSize;
    height: THREEHELPER.CanvasSize;
    sun?: SunInterface;
    scene!: THREE.Scene; // 不要反驳我
    camera!: THREE.PerspectiveCamera;
    cameras!: CamerasInterface;
    renderer!: THREE.WebGLRenderer;
    gui: any; // 尝试用decalre解决该问题
    light!: LightInterface;
    controls!: ControlsInterface;
    control!: AnyControls;
    points?: SnowInterface;
    raycaster?: RaycasterInterface;
    ocean?: (Ocean2Interface | Ocean1Interface);
    effect?: EffectInterface;
    lensflares?: LensflareInterface;
    stats?: Stats;
    constructor(selector: string) {
        this.isDayTime = false;
        this.curveMap = new Map();
        this.mixerMap = new Map();
        this.moment = { value: 15 };
        this.clock = new THREE.Clock();

        this.domElement = document.querySelector(selector);
        this.width = this.domElement!.clientWidth;
        this.height = this.domElement!.clientHeight;

        this.init();
    }

    /* 
        * @description 初始化，实例化helper之后不要再手动调用init().
    */
    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initControl();
        this.initEffect();
        this.initLight();
        this.render();

        window.addEventListener('resize', () => { this.onWindowResize() });
    }

    /* 
        * @description 窗口自适应
    */
    onWindowResize() {
        // 重新设置相机宽高比例
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // 更新相机投影矩阵
        this.camera.updateProjectionMatrix();
        // 重新设置渲染器渲染范围
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器的像素比例
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /* 
        * @description 帧率检测
    */
    addStats() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    /* 
        * @description 添加Object3D到场景
        * @param {Array} Object3D
    */
    add(...object3D: THREE.Object3D[]) {
        this.scene.add(...object3D);
    }

    /* 
        * @description 初始化场景
    */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    /* 
        * @description 初始化相机模块并添加默认透视相机
        * @param {Number} fov 视锥体上下边角度
        * @param {Number} min 极近点
        * @param {Number} max 极远点
    */
    initCamera(fov: number = 75, near: number = 1, far: number = 1000) {
        this.cameras = new Cameras(fov, near, far);
        this.camera = this.cameras.camera;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        return this.camera;
    }

    addCamera(fov: number = 75, near: number = 1, far: number = 10000): THREE.PerspectiveCamera {
        return this.cameras.addPerspectiveCamera(fov, near, far);
    }

    /* 
        * @description 设置新的相机, 但不启用
        * @param {string} name 名称
        * @param {THREE.PerspectiveCamera} 透视相机
    */
    setCamera(name: string, camera: THREE.PerspectiveCamera) {
        this.cameras.setCamera(name, camera);
    }

    /* 
        * @description 启用相机
        * @param {String} name 相机名称
    */
    toggleCamera(name: string) {
        if (this.cameras.activeCamera(name)) {
            this.camera = this.cameras.activeCamera(name)!;
        }
        return this.camera;
    }

    /* 
        * @description 初始化渲染器
    */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            premultipliedAlpha: true,
            logarithmicDepthBuffer: true
        });
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.shadowMap.enabled = true;
        this.renderer.useLegacyLights = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.domElement!.appendChild(this.renderer.domElement);
        return this.renderer;
    }

    /* 
        * @description 调节场地曝光度
        * @param {Number} exposure 场地曝光度
    */
    changeExposure(exposure: number): void {
        this.renderer.toneMappingExposure = exposure;
    }

    /* 
        * @description 添加GUI
    */
    addGUI() {
        this.gui = new dat.GUI();
    }

    /* 
        * @description 初始化光模块
    */
    initLight() { // 把this.light改成lights
        this.light = new Light();
    }

    /* 
        * @description 调启用默认光线方案
        * @param {Color} color 十六进制颜色
    */
    defaultLight(color = 0xffffff) {
        this.addAmbient(color, 1);

        const directional0 = this.addDirectional(color, 0.3);
        directional0.rePos(new THREE.Vector3(0, 10, 10));
        const directional1 = this.addDirectional(color, 0.3);
        directional1.rePos(new THREE.Vector3(0, 10, -10));
        const directional2 = this.addDirectional(color, 0.8);
        directional2.rePos(new THREE.Vector3(10, 10, 10));

        this.scene.add(directional0.light, directional1.light, directional2.light);
    }

    /* 
        * @description 创建直线光, 不添加
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {DirectionalLight} 直线光
    */
    addDirectional(color = 0xffffff, intensity = 1, name?: string) {
        return this.light.createDirectionalLight(color, intensity, name);;
    }

    /* 
        * @description 添加环境光
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {AmbientLight} 环境光
    */
    addAmbient(color: number = 0xffffff, intensity: number = 1, name?: string) {
        const ambient = this.light.createAmbientLight(color, intensity, name);
        this.scene.add(ambient.light);
        return ambient;
    }

    /* 
        * @description 创建聚光灯, 不添加
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {SpotLight} 聚光灯
    */
    addSpot(color: number = 0xffffff, intensity: number = 1, name?: string) {
        return this.light.createSpotLight(color, intensity, name);
    }

    /* 
        * @description 创建点光源, 不添加
        * @param {Color} color 十六进制颜色
        * @param {Number} intensity 强度
        * @param {String} name 名称
        * @return {PointLight} 点光源
    */
    addPoint(color: number = 0xffffff, intensity: number = 1, name: string) {
        return this.light.createPointLight(color, intensity, name);
    }

    /* 
        * @description 依据名称获取光
        * @param {String} name 名称
        * @param {Boolean} help 是否检视所有名称
        * @return {Light} 光
    */
    getLight(name: string, help = false) {
        help && console.warn(this.light.check());
        return this.light.get(name);
    }

    /* 
        * @description 重定位相机
        * @param {Number} x x轴向距离
        * @param {Number} y y轴向距离
        * @param {Number} z z轴向距离
    */
    rePosCamera(pos: THREE.Vector3) {
        this.cameras.rePos(pos);
    }

    /* 
        * @description 初始化控制器模块, 并添加默认轨道控制器
    */
    initControl() {
        this.controls = new Controls(this.camera, this.renderer);
        this.control = this.controls.controls;
    }

    /* 
        * @description 创建轨道控制器, 不启用
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    setOrbitControl(name: string) {
        return this.controls.setOrbitControl(name);
    }

    /* 
        * @description 创建飞行控制器, 不启用
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    setFlyControl(name: string) {
        return this.controls.setFlyControl(name);
    }

    /* 
        * @description 创建第一人称控制器, 不启用
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    setFirstPersonControl(name: string) {
        return this.controls.setFirstPersonControl(name);
    }

    /* 
        * @description 启用一个控制器
        * @param {String} name 控制器名称
        * @return {Controls} name 控制器
    */
    toggleControl(name: string): (AnyControls | void) {
        if (this.controls.activeControl(name)) {
            this.control = this.controls.activeControl(name)!;
            return this.control;
        }
    }

    /* 
        * @description 更新控制器 更新曲线追踪 更新Box3 更新AnimationMixer 更新雪模块 更新后期效果 更新渲染器
    */
    render() {
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        this.control && this.control.update(delta);

        if (Array.from(this.curveMap.keys()).length > 0) {
            for (let i = 0; i < Array.from(this.curveMap.keys()).length; i++) {
                if (this.curveMap.get(Array.from(this.curveMap.keys())[i]) !== null) {
                    const point = Array.from(this.curveMap.keys())[i].getPoint(elapsed / (this.curveMap.get(Array.from(this.curveMap.keys())[i]) as any).deceleration % 1);
                    this.curveMap.get(Array.from(this.curveMap.keys())[i])!.position.copy(point);
                }
            }
        }

        this.scene.traverse((node) => {
            if ((node as any).box3) {
                (node as any).box3.setFromObject(node);
            }
        })

        if (Array.from(this.mixerMap.values()).length > 0) {
            for (let i = 0; i < Array.from(this.mixerMap.values()).length; i++) {
                Array.from(this.mixerMap.values())[i].update(delta);
            }
        }

        if (this.points) {
            this.updateVertex();
        }

        this.effect && this.effect.effectComposer.render(delta);

        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    /* 
        * @description 更新雪模块
    */
    updateVertex() {
        let vertices = this.points!.mesh.geometry.attributes.position.array;

        // 1, 4, 7, 10, 13, 16
        for (let i = 1; i < vertices.length; i += 3) { // y
            vertices[i] = vertices[i] - (0.1 + Math.random() / 5);
            if (vertices[i] <= -60) vertices[i] = 45;
        }

        // 0, 3, 6, 9, 12, 15
        for (let i = 0; i < vertices.length; i += 3) { // 抖动
            vertices[i] = vertices[i] - ((Math.random() - 0.5) / 3);
            if (vertices[i] <= -20 || vertices[i] >= 20) vertices[i] = vertices[i] * -1;
        }

        // 顶点变动之后需要更新
        this.points!.mesh.geometry.attributes.position.needsUpdate = true;;
    }

    /* 
        * @description 加载gltf, 提前解析动画, 注册根据下标/名称获取动画的方法
        * @param {String} dracoPath 引导至draco_decoder.js所在目录, 这个文件可以从three模块内复制
        * @param {String} gltfPath gltf模型路径
        * @promise {GLTF} gltf模型
    */
    gltfLoader(dracoPath: string, gltfPath: string) {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(dracoPath);
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
            gltfLoader.load(gltfPath, (gltf) => {
                const mixer = new THREE.AnimationMixer(gltf.scene);
                this.mixerMap.set(gltf, mixer);

                const actions = {};
                for (let i = 0; i < gltf.animations.length; i++) {
                    (actions as any)[`${gltf.animations[i].name}Action`] = mixer.clipAction(gltf.animations[i]);
                }

                (gltf as any).actions = actions;

                (gltf as any).getActionByName = function (actionName) {
                    return (gltf as any).actions[actionName];
                }
                    (gltf as any).getActionByIndex = function (index: number) {
                        return (gltf as any).actions[Object.keys((gltf as any).actions)[index]]
                    }
                resolve(gltf);
            });
        });
    }

    /* 
        * @description 加载图像纹理
        * @param {String} path 引导至图片所在
        * @Promise {Texture} texture 图像纹理
    */
    textureLoader(path: string) {
        const loader = new THREE.TextureLoader();
        return new Promise((resolve, reject) => {
            loader.load(path, (texture) => {
                resolve(texture);
            });
        });
    }

    /* 
        * @description 根据gltf获取其AnimationMixer
        * @param {GLTF} gltf gltf模型
        * @return {AnimationMixer} 动作混合器
    */
    getMixer(gltf: GLTF) {
        return this.mixerMap.get(gltf);
    }

    /* 
        * @description 加载HDR纹理
        * @param {String} path 引导至HDR文件所在
        * @Promise {Texture} texture 图像纹理
    */
    hdrLoader(path: string) {
        if (Array.isArray(path)) {
            const cubeTextureLoader = new THREE.CubeTextureLoader();
            return new Promise((resolve, reject) => {
                (cubeTextureLoader as any).load(path).then((texture: THREE.Texture) => {
                    resolve(texture);
                });
            });
        }
        const rgbeLoader = new RGBELoader();
        return new Promise((resolve, reject) => {
            rgbeLoader.load(path, (texture) => {
                resolve(texture);
            });
        });
    }

    /* 
        * @description 加载视频纹理
        * @param {String} path 引导至视频所在
        * @return {Texture} texture 视频纹理
    */
    videoLoader(path: string) {
        let video = document.createElement('video');
        video.src = path;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.play();
        let videoTexture = new THREE.VideoTexture(video);
        return videoTexture;
    }

    /* 
        * @description 设置环境纹理(图像纹理)
        * @param {String} path 引导至图片所在
        * @Promise {Texture} texture 图像纹理
    */
    setBackgroundImg(path: string) { // 设置图片背景
        const loader = new THREE.TextureLoader();
        return new Promise((resolve, reject) => {
            loader.load(path, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.anisotropy = 16;
                texture.format = THREE.RGBAFormat;

                this.scene.background = texture;
                this.scene.environment = texture;
                resolve(texture);
            });
        });
    }

    /* 
        * @description 设置环境纹理(HDR)
        * @param {String} path 引导至HDR文件所在
        * @Promise {Texture} texture HDR纹理
    */
    setBackgroundHDR(url: string) {
        return new Promise((resolve, reject) => {
            this.hdrLoader(url).then((texture: any) => { // 此处类型或许可以明确
                texture.anisotropy = 15;
                this.scene.background = texture;
                this.scene.environment = texture;
                texture.format = THREE.RGBAFormat;
                texture.mapping = THREE.EquirectangularReflectionMapping;

                resolve(texture);
            });
        });
    }

    /* 
        * @description 初始化后期效果模块
    */
    initEffect() {
        const effect = new Effect(this.scene, this.camera, this.renderer);
        this.effect = effect;
    }

    /* 
        * @description 启用抗锯齿后期
    */
    addAntialias() {
        if (!this.effect) {
            console.warn('未对效果模块进行初始化');
            return;
        }
        this.effect.antialias();
    }

    /* 
        * @description 启用柯里化后期
    */
    addDotScreen(center: THREE.Vector2 = new THREE.Vector2(0, 0), angel: number = 0.5, scale: number = 0.5) {
        if (!this.effect) {
            console.warn('未对效果模块进行初始化');
            return;
        }
        this.effect.dotScreen(center, angel, scale);
    }

    /* 
        * @description 启用泛光后期
    */
    addUnrealBloom(resolution: THREE.Vector2 = new THREE.Vector2(0, 0), strength: number = 0.3, radius: number = 2, threshold: number = 0.1) {
        if (!this.effect) {
            console.warn('未对效果模块进行初始化');
            return;
        }
        this.effect.unrealBloom(resolution, strength, radius, threshold);
    }

    /* 
        * @description 启用像素化后期
    */
    addPixel(intensity: number = 4) {
        if (!this.effect) {
            console.warn('未对效果模块进行初始化');
            return;
        }
        this.effect.pixel(intensity);
    }

    /* 
        * @description 启用干扰后期
    */
    addGlitch(keep: number) {
        if (!this.effect) {
            console.warn('未对效果模块进行初始化');
            return;
        }
        this.effect.glitch(keep);
    }

    /* 
        * @description 启用电影后期
    */
    addFilm(nIntensity: number = 0.8, sIntensity: number = 0.35, sCount: number = 250, grayscale: boolean = false) {
        if (!this.effect) {
            console.warn('未对效果模块进行初始化');
            return;
        }
        this.effect.film(nIntensity, sIntensity, sCount, grayscale);
    }

    /* 
        * @description 启用屏幕空间反射后期
    */
    addSSR(size: THREE.Vector2 = new THREE.Vector2(10, 10), color: number = 0x888888) {
        if (!this.effect) {
            console.warn('未对效果模块进行初始化');
            return;
        }
        this.effect.ssr(size, color);
    }

    /* 
        * @description 添加纹理海洋
        * @params {Texture} flowTexturePath 水波纹理
        * @params {Number} length 长
        * @params {Number} width 宽
        * @params {Number} density 水波密度
        * @params {Color} color 十六进制颜色
    */
    addOcean1(flowTexturePath = '', x = 100, y = 100, density = 1150, color = 0x21ccfc) { // ocean必需波纹贴图
        this.ocean = new Ocean1(flowTexturePath, x, y, density, color);
        this.scene.add(this.ocean.mesh);
    }

    /* 
        * @description 添加Shader海洋
        * @params {Number} length 长
        * @params {Number} width 宽
        * @params {Number} density 水波密度
        * @params {Color} color 十六进制颜色
    */
    addOcean2(x = 100, y = 100, density = 1150, color = 0x21ccfc) {
        this.ocean = new Ocean2(x, y, density, color);
        this.scene.add(this.ocean.mesh);
    }

    /* 
        * @description 添加坐标轴
        * @params {Number} size 三轴线长度
    */
    addAxis(size = 100) {
        let axis = new THREE.AxesHelper(size);
        this.scene.add(axis);
    }

    /* 
        * @description 初始化射线拾取
    */
    initRaycaster() {
        this.raycaster = new Raycaster(this.domElement, this.camera);
    }

    /* 
        * @description 设置射线拾取适用物体
        * @params {Array} RaycasterMeshes 能够被射线拾取的物体
    */
    setRaycasterMeshes(RaycasterMeshes: THREE.Mesh[]) {
        if (!this.raycaster) {
            console.warn('未对效果射线拾取模块进行初始化');
            return;
        }
        this.raycaster.setMeshArr(RaycasterMeshes);
    }

    /* 
        * @description 在鼠标点击物体时进行射线拾取
        * @params {Function} callback 拾取之后回调
    */
    createClickRaycaster(callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any) {
        if (!this.raycaster) {
            console.warn('未对效果射线拾取模块进行初始化');
            return;
        }
        this.raycaster.createClickRaycaster(callback);
    }

    /* 
        * @description 在鼠标悬浮时进行射线拾取
        * @params {Function} callback 拾取之后回调
    */
    createHoverRaycaster(callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any) {
        if (!this.raycaster) {
            console.warn('未对效果射线拾取模块进行初始化');
            return;
        }
        this.raycaster.createHoverRaycaster(callback);
    }

    /* 
        * @description 射线悬浮拾取demo
        * @params {Array} RaycasterMeshes 能够被射线拾取的物体
    */
    rayHelper() {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff3333,
            side: THREE.DoubleSide,
            transparent: true
        });
        const star = new THREE.Mesh(geometry, material);
        star.visible = false;
        this.scene.add(star);
        this.createHoverRaycaster((intersects) => {
            star.visible = true;
            star.position.copy(intersects[0].point);
        });
    }

    /* 
        * @description 添加精灵文字
        * @params {String} text 文字
        * @params {Vector3} position 位置
    */
    addSpriteLabel(text = "HelloWorld", position = new THREE.Vector3(0, 0, 0), callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any = () => { }) {
        let spriteLabel = new SpriteLabel(this.camera, text, position, callback);
        this.scene.add(spriteLabel.mesh);
        return spriteLabel;
    }

    /* 
        * @description 初始化光晕模块
    */
    initLensflare() {
        this.lensflares = new Lensflares();
    }

    /* 
        * @description 创建光晕
        * @params {Array} configArr配置每个光晕, 格式: [{ path, size, distance, color}, ...]
        * @params {String} name 名称
        * @return {Lensflares} 光晕
    */
    createLensflare(configArr: THREEHELPER.LensflareConfig[] = [], name?: string) {
        if (!this.lensflares) {
            console.warn('未对效果射线拾取模块进行初始化');
            return;
        }
        const lensflare: LensflareToolInterface = this.lensflares.create(configArr, name);
        return lensflare;
    }

    /* 
        * @description 获取光晕
        * @params {String} name 名称
        * @return {Lensflares} 光晕
    */
    getLensflare(name: string): (LensflareToolInterface | void) {
        if (!this.lensflares) {
            console.warn('未对效果射线拾取模块进行初始化');
            return;
        }
        const lensflare = this.lensflares.get(name);
        return lensflare;
    }

    /* 
        * @description 创建模拟太阳
        * @params {String} name 是否使用光晕
        * @return {Sun}
    */
    createSun(radius: number = 100) {
        const sun = new Sun(radius);
        this.sun = sun;
        this.scene.add(sun.mesh);
        return sun;
    }

    /* 
        * @description 太阳公转启用
    */
    sunTrack() { // Sun运动
        if (!this.sun) {
            console.warn('未对Sun模块做初始化');
            return;
        }
        gsap.to(this.moment, {
            value: 24,
            duration: 24,
            repeat: -1,
            ease: "linear",
            onUpdate: () => {
                this.sun!.mesh.position.z = Math.cos(((this.moment.value - 6) * 2 * Math.PI) / 24) * 4000;
                this.sun!.mesh.position.y = Math.sin(((this.moment.value - 6) * 2 * Math.PI) / 24) * 4000;

                if (this.moment.value > 6) { // 早6
                    this.sun!.mesh.visible = true;
                }
                if (this.moment.value > 18) { // 晚6
                    this.sun!.mesh.visible = false;
                }
            },
        });
    }

    /* 
        * @description 日光跟随太阳变化
        * @params {Function} dayCallback 昼调用
        * @params {Function} nightCallback 夜调用
    */
    dayLight(dayCallback: Function, nightCallback: Function) {
        gsap.to(this.moment, {
            value: 24,
            duration: 24,
            repeat: -1,
            ease: "linear",
            onUpdate: () => {
                if (
                    this.moment.value > 6 &&
                    this.moment.value <= 18 &&
                    this.isDayTime === false
                ) { // 早8
                    this.isDayTime = true;
                    this.changeExposure(1);
                    dayCallback && dayCallback();
                }
                if (
                    (this.moment.value > 18 ||
                        this.moment.value <= 6) &&
                    this.isDayTime === true
                ) { // 晚8
                    this.isDayTime = false;
                    this.changeExposure(0.4);
                    nightCallback && nightCallback();
                }
                if (Math.abs(this.moment.value - 12) >= 4 && Math.abs(this.moment.value - 12) <= 6) {
                    // 昼夜交替6-8
                    let strength = 1 - (Math.abs(this.moment.value - 12) - 4) / 2; // 光照强度
                    strength < 0.3 ? (strength = 0.3) : (strength = strength);
                    this.changeExposure(strength);
                }
            }
        });
    }

    /* 
        * @description 模拟天空, 你处在天空球内
        * @params 天空球尺寸
        * @return {SphereSky} 天空球
    */
    addSphereSky(size = 10000) {
        if (!this.scene.environment) {
            console.warn('设置天空球需要先设置环境贴图');
            return;
        }
        let sphereSky = new SphereSky(size, this.scene.environment, this.moment);
        this.scene.add(sphereSky.mesh);

        return sphereSky;
    }

    /* 
        * @description 添加3D网格坐标系
        * @params {Array} category 二维数组, length = 2, 控制y轴、x轴标签
        * @params {Number} bottom 纵轴起始位置
        * @params {Number} left 横轴起始位置
    */
    addAxis3d(category?: string[][], bottom: number = 0, left: number = 0, size: THREE.Vector3 = new THREE.Vector3(8, 6, 4)) {
        const examples: string[][] = [
            ["0%", "20%", "40%", "60%", "80%", "100%"],
            ["line0", "line1", "line2", "line3", "line4"]
        ]
        let axis3d = new Axis3d(category || examples, bottom, left, size);
        this.scene.add(axis3d.mesh);
        return axis3d;
    }

    /* 
        * @description 添加3D柱形图
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @params {Number} space 柱体间隔
        * @params {String} type 圆柱cylinder, 四棱柱rect
        * @return {Group} bar3d 柱形图
    */
    addBar3d(data?: THREEHELPER.ChartData[], space: number = 1, type: THREEHELPER.BarType = 'cylinder') { // 柱形图
        const chartData = data || [
            {
                name: '第一季度',
                value: 2,
            },
            {
                name: '第二季度',
                value: 4,
            },
            {
                name: '第三季度',
                value: 6,
            },
            {
                name: '第四季度',
                value: 8,
            }
        ];
        let bar3d = new Bar3d(chartData, space, type);
        this.scene.add(bar3d.mesh);
        return bar3d;
    }

    /* 
        * @description 添加3D饼图1, 各部分有高度差
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @params {Number} depth 各部分间高度差
        * @return {Group} pie3d1 饼图1
    */
    addPie3d1(data?: THREEHELPER.ChartData[], radius: number = 3, depth: number = 2) { // 饼图1
        const chartData = data || [
            {
                name: '第一季度',
                value: 2,
            },
            {
                name: '第二季度',
                value: 4,
            },
            {
                name: '第三季度',
                value: 6,
            },
            {
                name: '第四季度',
                value: 8,
            }
        ];
        let pie3d1 = new Pie3d1(chartData, this.camera, radius, depth);
        this.scene.add(pie3d1.mesh);
        return pie3d1;
    }

    /* 
        * @description 添加3D饼图2, 无高度差
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @params {Array} thickness 厚度
        * @return {Group} pie3d1 饼图1
    */
    addPie3d2(data: THREEHELPER.ChartData[], radius: number = 3, thickness: number = 1) { // 饼图2
        const chartData = data || [
            {
                name: '第一季度',
                value: 2,
            },
            {
                name: '第二季度',
                value: 4,
            },
            {
                name: '第三季度',
                value: 6,
            },
            {
                name: '第四季度',
                value: 8,
            }
        ];
        let pie3d2 = new Pie3d2(chartData, this.camera, radius, thickness);
        this.scene.add(pie3d2.mesh);
        return pie3d2;
    }

    /* 
        * @description 添加3D折线图
        * @params {Array} data 数组内对象必需name, value属性分别为项名&值
        * @params {Number} space 项之间间隔
        * @return {Group} pie3d1 折线图
    */
    addPolyline3d(data?: THREEHELPER.ChartData[], space: number = 1) {
        const chartData = data || [
            {
                name: '第一季度',
                value: 2,
            },
            {
                name: '第二季度',
                value: 4,
            },
            {
                name: '第三季度',
                value: 6,
            },
            {
                name: '第四季度',
                value: 8,
            }
        ];
        let polyline3d = new Polyline3d(chartData, space);
        this.scene.add(polyline3d.mesh);
        return polyline3d;
    }

    /* 
       * @description 增加降雪或其他
       * @params {BufferGeometry} geometry 每个颗粒的模型(非必需)
       * @params {Color} color 材质颜色, 十六进制颜色
       * @params {Texture} texture 图像纹理
       * @return {Mesh} 雪区
   */
    addSnow(geometry?: THREE.BufferGeometry, color?: number, texture?: THREE.Texture) {
        this.points = new Snow(geometry, color, texture);
        this.scene.add(this.points.mesh);
        return this.points;
    }

    /* 
        * @description 立体矩阵坐标系
        * @params {Number} space 间隔
        * @params {Number} density 密度
        * @params {Texture} texture 图像纹理(非必需) // 这不合理, 这个类和snow一样在不传参数的情况下可以生成一些东西, 但这些参数都是必选参数
    */
    addMatrixAxis(space: number = 10, density: number = 11, geometry?: THREE.BufferGeometry) {
        const matrixAxis = new MatrixAxis(space, density, geometry);
        this.scene.add(matrixAxis.mesh);
    }

    /* 
        * @description 添加曲线
        * @params {Array} path Vector3数组
        * @params {Color} color 颜色
        * @return {Curve} curve 曲线
    */
    addCurve(path: THREE.Vector3[], color: number = 0xffffff) {
        const curvePath = path || [
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, 5),
            new THREE.Vector3(-10, 0, 10)
        ];
        const curve = new Curve(curvePath, color);
        this.curveMap.set(curve, null);
        return curve;
    }

    /* 
        * @description 使物体沿曲线移动
        * @params {Curve} curve Curve对象
        * @params {Mesh} mesh 物体
        * @params {Number} 降速
    */
    fllowCurve(curve: CurveInterface, mesh: THREE.Mesh, deceleration: number = 3) {
        if (!mesh) console.warn('fllowCurve: mesh cannot be undefined.');
        (mesh as any).deceleration = deceleration;
        this.curveMap.set(curve, mesh);
    }

    /* 
    * @description 目标物体沿曲线移动
    * @params {Array} path Vector3路径数组
    * @params {Number} tubularSegments 分段数
    * @params {Number} radius 半径
    * @params {Number} radialSegments 横截面分段数(棱数)
    * @params {Color} color 材质颜色, 十六进制颜色
    */
    addTube(path: THREE.Vector3[], tubularSegments = 20, radius = 0.2, radialSegments = 8, color = new THREE.Color(0xffffff)) {
        const tubePath = path || [
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, 5),
            new THREE.Vector3(-10, 0, 10)
        ];
        const tube = new Tube(tubePath, tubularSegments, radius, radialSegments, color);
        return tube;
    }

    /* 
        * @description 为一个物体增加Box3
        * @params {Mesh/gltf} 物体或gltf 
        * @params {Boolean} helper Box3视觉辅助
    */
    addBox3(model: (THREE.Mesh | GLTF), helper = false) { // 为一个模型添加box3
        (model as any).box3 = new THREE.Box3();
        if (model.hasOwnProperty('scene')) {
            (model as GLTF).scene.traverse((node) => {
                if (node.hasOwnProperty('isSkinnedMesh')) {
                    const mesh = node;
                    node.frustumCulled = false;
                    (mesh as any).geometry.computeBoundingBox();
                    (model as GLTF & { box3: THREE.Box3 }).box3.union((mesh as any).geometry.boundingBox);
                }
            })
        } else {
            (model as THREE.Mesh & { box3: THREE.Box3 }).box3.setFromObject((model as THREE.Mesh & { box3: THREE.Box3 }));
        }
        if (helper) {
            const box3Helper = new THREE.Box3Helper((model as THREE.Mesh & { box3: THREE.Box3 } | GLTF & { box3: THREE.Box3 }).box3, new THREE.Color(0xffff00));
            this.scene.add(box3Helper);
        }
        return model;
    }

    /* 
        * @description 传入两个物体, 检测其Box3是否有交集
        * @params {Mesh/gltf} 物体或gltf
        * @return {Boolean} 交集与否
    */
    collideDetect(mesh0: THREE.Mesh & { box3: THREE.Box3 }, mesh1: THREE.Mesh & { box3: THREE.Box3 }) {
        if (!mesh0.box3 || !mesh1.box3) {
            console.warn('collideDetect: Box3 needed.')
            return;
        }
        return mesh0.box3.intersectsBox(mesh1.box3);
    }
}