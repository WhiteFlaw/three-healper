import * as THREE from 'three';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ReflectorForSSRPass } from "three/examples/jsm/objects/ReflectorForSSRPass.js";
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
// 最恶心的一集
import type { EffectComposer as EffectComposerType } from "three/examples/jsm/postprocessing/EffectComposer";
import type { UnrealBloomPass as UnrealBloomPassType } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import type { ReflectorForSSRPass as ReflectorForSSRPassType } from 'three/examples/jsm/objects/ReflectorForSSRPass';
import { EffectInterface, EffectContructorInterface } from './interface/Effect';

export const Effect: EffectContructorInterface = class Effect implements EffectInterface {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    effectComposer: EffectComposerType;
    unrealBloomPass?: UnrealBloomPassType;
    groundReflector?: ReflectorForSSRPassType;
    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.effectComposer = new EffectComposer(this.renderer);
        this.effectComposer.setSize(window.innerWidth, window.innerHeight);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.effectComposer.addPass(renderPass);
    }

    antialias(): void { // 抗锯齿
        const smaaPass = new SMAAPass(
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.effectComposer.addPass(smaaPass);
    }

    dotScreen(center: THREE.Vector2, angel: number, scale: number): void { // 粒子化
        const dotScreenPass = new DotScreenPass(center, angel, scale);
        this.effectComposer.addPass(dotScreenPass);
    }

    unrealBloom(resolution: THREE.Vector2, strength: number, radius: number, threshold: number): void { // 物体泛光
        this.unrealBloomPass = new UnrealBloomPass(resolution, strength, radius, threshold); // 泛光覆盖场景大小, 泛光强度, 泛光半径, 泛光临界强度(越低越容易泛光)
        this.unrealBloomPass.enabled = true;
        this.effectComposer.addPass(this.unrealBloomPass);
    }

    pixel(intensity: number): void { // 像素风 intensity 像素化强度
        const pixelatedPass = new RenderPixelatedPass(intensity, this.scene, this.camera);
        this.effectComposer.addPass(pixelatedPass);
    }
    
    glitch(keep: number) { // 电磁干扰 keep布尔值 是否持续干扰
        const giltchPass = new GlitchPass(keep);
        this.effectComposer.addPass(giltchPass);
    }

    film(nIntensity: number, sIntensity: number, sCount: number, grayscale: boolean) { // 扫描线&失真 nIntensity颗粒程度 sIntensity扫描线强度 sCount扫描线同时存在数量 grayscale是否灰度图
        const filmPass = new FilmPass(nIntensity, sIntensity, sCount, grayscale);
        this.effectComposer.addPass(filmPass);
    }

    ssr(size: THREE.Vector2, color: number) { // SSR屏幕空间反射
        let geometry = new THREE.PlaneGeometry(size.x, size.y);
        this.groundReflector = new ReflectorForSSRPass(geometry, {
            clipBias: 0.0003,
            textureWidth: window.innerWidth,
            textureHeight: window.innerHeight,
            color: color,
            useDepthTexture: true
        });
        this.groundReflector.maxDistance = 1000000;
        this.groundReflector.material.depthWrite = false;
        this.groundReflector.rotation.x = -Math.PI / 2;
        this.groundReflector.visible = false;
        this.scene.add(this.groundReflector);

        const ssrPass = new SSRPass({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            width: window.innerWidth,
            height: window.innerHeight,
            groundReflector: this.groundReflector ? this.groundReflector : null,
            selects: null
        });
        ssrPass.isFresnel = true;
        ssrPass.isBouncing = true;
        ssrPass.output = SSRPass.OUTPUT.Default;
        ssrPass.opacity = 0.5;
        ssrPass.maxDistance = .2;
        ssrPass.isDistanceAttenuation = true;
        this.effectComposer.addPass(ssrPass);
        this.effectComposer.addPass(new ShaderPass(GammaCorrectionShader));
    }
}