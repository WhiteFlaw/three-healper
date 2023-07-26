import type { Water as WaterType } from "three/examples/jsm/objects/Water";

export interface Ocean1Interface { // 实例约束
    x: number;
    y: number;
    density: number;
    color: number;
    mesh: WaterType;
    flowTexture?: THREE.Texture;
    velocity: number;
    setFlowTexture: (flowTexturePath: string) => void;
    setColor: (color: number) => void;
    waterTexture: () => boolean;
    setDensity: (density: number) => void;
    setVelocity: (velocity: number) => void;
    flow: () => void;
}

export interface Ocean1ContructorInterface { // 静态约束
    new(flowTexturePath: string, x: number, y: number, density: number, color: number): Ocean1Interface
}