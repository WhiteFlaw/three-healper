import type { EffectComposer as EffectComposerType } from "three/examples/jsm/postprocessing/EffectComposer";
import type { UnrealBloomPass as UnrealBloomPassType } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import type { ReflectorForSSRPass as ReflectorForSSRPassType } from 'three/examples/jsm/objects/ReflectorForSSRPass';

export interface EffectInterface { // 实例约束
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    effectComposer: EffectComposerType;
    unrealBloomPass?: UnrealBloomPassType;
    groundReflector?: ReflectorForSSRPassType;
    antialias: () => void;
    dotScreen: (center: THREE.Vector2, angel: number, scale: number) => void;
    unrealBloom: (resolution: THREE.Vector2, strength: number, radius: number, threshold: number) => void;
    pixel: (inensity: number) => void;
    glitch: (keep: number) => void;
    film: (nIntensity: number, sIntensity: number, sCount: number, grayscale: boolean) => void;
    ssr: (size: THREE.Vector2, color: number) => void;
}

export interface EffectContructorInterface { // 静态约束
    new(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): EffectInterface;
}