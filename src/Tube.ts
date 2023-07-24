import * as THREE from 'three';
import { TubeInterface, TubeContructorInterface } from './interface/Tube';

export const Tube: TubeContructorInterface = class Tube implements TubeInterface { // 宽度需求用tube
    mesh: THREE.Mesh;
    constructor(path: THREE.Vector3[], tubularSegments: number, radius: number, radialSegments: number, color: THREE.Color) {
        const curve = this.createCurve(path);
        const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
        const material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    createCurve(path: THREE.Vector3[]) {
        const curve = new THREE.CatmullRomCurve3(path);
        return curve;
    }
}
