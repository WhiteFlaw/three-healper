import type { Lensflare as LensflareType } from "three/examples/jsm/objects/Lensflare";
import type { LensflareConfig } from "../types/index";

export interface LensflareInterface { // 实例约束
    lensflares: Map<string, LensflareToolInterface>;
    max: number;
    create: (configArr: LensflareConfig[], name?: string) => LensflareToolInterface;
    get: (name: string) => (LensflareToolInterface | void);
    check: () => IterableIterator<string>;
}

export interface LightContructorInterface { // 静态约束
    new(): LensflareInterface
}

export interface LensflareToolInterface { // 实例约束
    lensflare: LensflareType;
    loader: THREE.TextureLoader;
    addElement: (path: string, size: number, distance: number, color: number) => void;
}

export interface LensflareToolContructorInterface { // 静态约束
    new(): LensflareToolInterface;
}

