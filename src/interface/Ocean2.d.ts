import type { Water as WaterType } from "three/examples/jsm/objects/Water";

export interface Ocean2Interface { // 实例约束
    x: number;
    y: number;
    density: number;
    color: number;
    mesh: WaterType;
    flowTexture?: THREE.Texture;
    setFlowTexture: (flowTexturePath: string) => void;
    setColor: (color: number) => void;
    waterTexture: () => boolean;
    setDensity: (density: number) => void;
}

export interface Ocean2ContructorInterface { // 静态约束
    new(x: number, y: number, density: number, color: number): Ocean2Interface
}