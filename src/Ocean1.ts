import * as THREE from 'three';
import { Water } from "three/examples/jsm/objects/Water";
import type { Water as WaterType } from "three/examples/jsm/objects/Water";
import { Ocean1ContructorInterface, Ocean1Interface } from "./interface/Ocean1";

export const Ocean1: Ocean1ContructorInterface = class Ocean1 implements Ocean1Interface { // 纹理水
    x: number;
    y: number;
    density: number;
    color: number;
    mesh: WaterType;
    flowTexture?: THREE.Texture;
    velocity: number;
    constructor(flowTexturePath: string, x: number, y: number, density: number, color: number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = 2.0;
        this.density = density;

        if (flowTexturePath) {
            const loader = new THREE.TextureLoader();
            this.flowTexture = loader.load(flowTexturePath, (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            })
        }

        const oceanGeometry = new THREE.PlaneGeometry(x, y);
        this.mesh = new Water(oceanGeometry, {
            textureWidth: this.density, // 浑浊程度(密度)
            textureHeight: this.density, // 浑浊程度(密度)
            waterNormals: this.flowTexture!,
            waterColor: this.color
        });
        this.mesh.rotation.x = Math.PI * -0.5;
    }

    setFlowTexture(flowTexturePath: string) {
        const loader = new THREE.TextureLoader();
        (this.mesh! as any).waterNormals = loader.load(flowTexturePath, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        })
    }

    setColor(color: number) {
        (this.mesh! as any).waterColor = color;
    }

    waterTexture() {
        if (this.flowTexture) {
            return true;
        }
        return false;
    }

    setDensity(density: number) {
        if (!this.waterTexture()) {
            console.warn('体现密度需要水纹贴图');
            return;
        }
        (this.mesh! as any).textureWidth = (this.mesh! as any).textureHeight = density;
    }

    setVelocity(velocity: number) {
        if (!this.waterTexture()) {
            console.warn('体现流速需要水纹贴图');
            return;
        }
        let s = 0;
        if (velocity > 15) { // 再快看起来会有点恐怖
            s = 15;
        } else {
            s = velocity;
        }
        this.velocity = s;
    }
    
    flow() {
        this.mesh!.material.uniforms['time'].value += this.velocity / 60.0;
    }
}

  // 起初只是一个创建水的函数
  // 后续完善了密度变更方法之类
  // 只是让对水的各种操作变的更加容易追溯