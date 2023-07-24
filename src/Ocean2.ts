import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water2.js";
import type { Water as WaterType } from "three/examples/jsm/objects/Water";
import { Ocean2ContructorInterface, Ocean2Interface } from "./interface/Ocean2";

export const Ocean2: Ocean2ContructorInterface = class Ocean2 implements Ocean2Interface { //着色器水
    x: number;
    y: number;
    density: number;
    color: number;
    mesh: WaterType;
    flowTexture: THREE.Texture;
    constructor(x: number, y: number, density: number, color: number) {
        this.x = x;
        this.y = y;
        this.density = density;
        this.color = color;

        const oceanGeometry = new THREE.PlaneGeometry(x, y);
        this.mesh = new Water(oceanGeometry, {
            textureWidth: this.density, // 浑浊程度(密度)
            textureHeight: this.density, // 浑浊程度(密度)
            flowDirection: new THREE.Vector2(1, 1),
            color: this.color
        });
        this.mesh.rotation.x = Math.PI * -0.5;
        this.mesh.position.y = 0;
        this.mesh.renderOrder = -1;

        this.mesh.material.fragmentShader =
            this.mesh.material.fragmentShader.replace(
                "gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );",
                `gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );
                gl_FragColor = mix( gl_FragColor, vec4( 0.05, 0.3, 0.7, 1.0 ), vToEye.z*0.0005+0.5 );`
            );
    }

    setFlowTexture(flowTexturePath: string) {
        const loader = new THREE.TextureLoader();
        // Water类型没有约束静态部分导致传入构造函数对象内的可选属性waterNormals未受到约束
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

    setDensity(density: number) { // 水纹密度
        (this.mesh! as any).textureWidth = (this.mesh! as any).textureHeight = density;
    }
}
