import * as THREE from 'three';

export interface TubeInterface { // 实例约束
    mesh: THREE.Mesh;
    createCurve(path: THREE.Vector3[]): THREE.CatmullRomCurve3;
}

export interface TubeContructorInterface { // 静态约束
    new(
        path: THREE.Vector3[],
        tubularSegments: number,
        radius: number,
        radialSegments: number,
        color: THREE.Color
    ): TubeInterface;
}