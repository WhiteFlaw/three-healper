import * as THREEHELPER from '../types/index';

export interface SpriteSkyInterface { // 实例约束
    mesh: THREE.Mesh;
}

export interface SpriteSkyContructorInterface { // 静态约束
    new(radius: number, envMap: THREE.Texture, time: THREEHELPER.Time): SpriteSkyInterface
}