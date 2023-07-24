import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';
import { LensflareToolInterface, LensflareToolContructorInterface } from './interface/Lensflare';
import type { LensflareConfig } from './types/index.js';
import type { Lensflare as LensflareType } from "three/examples/jsm/objects/Lensflare";

export class Lensflares {
    lensflares: Map<string, LensflareToolInterface>;
    max: number;
    constructor() {
        this.lensflares = new Map();
        this.max = -1;
    }

    create(configArr: LensflareConfig[], name?: string): LensflareToolInterface {
        this.max++;
        const lensflare = new LensflareTool();
        if(!name) {
            name = `lensflare${this.max}`;
        }
        for (let i = 1; i < configArr.length; i++) {
            lensflare.addElement(...configArr[i]);
        }
        (lensflare as any).name = name;
        this.lensflares.set(name, lensflare);
        return lensflare;
    }

    check(): IterableIterator<string> {
        return this.lensflares.keys();
    }

    get(name: string): (LensflareToolInterface | void) {
        if(this.lensflares.get(name)) {
            return this.lensflares.get(name);
        } else {
            console.warn(`尝试获取不存在的光晕: ${name}`);
        }
    }
}

const LensflareTool: LensflareToolContructorInterface = class LensflareTool implements LensflareToolInterface{
    lensflare: LensflareType;
    loader: THREE.TextureLoader;
    constructor() {
        this.lensflare = new Lensflare();
        this.loader = new THREE.TextureLoader();
    }
    
    addElement(path: string, size: number, distance: number, color: number) { // 增加光晕点
        const texture = this.loader.load(path);
        this.lensflare.addElement(new LensflareElement(texture, size, distance, new THREE.Color(color)));
    }

}