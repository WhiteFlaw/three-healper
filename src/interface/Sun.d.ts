import * as THREE from 'three';

export interface SunInterface { // 实例约束
    light: THREE.DirectionalLight;
    mesh: THREE.Mesh;
    rePos(pos: THREE.Vector3): void;
}

export interface SunContructorInterface { // 静态约束
    new(radius: number): SunInterface
}