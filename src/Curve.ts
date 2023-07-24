import * as THREE from 'three';
import { CurveInterface, CurveContructorInterface } from './interface/Curve';

export const Curve: CurveContructorInterface = class Curve implements CurveInterface {
    curve: THREE.CatmullRomCurve3;
    mesh: THREE.Line;
    constructor(path: THREE.Vector3[], color: number) { // Curve不支持调节宽度, 有宽度需求用tube
        const curvePath = path;

        this.curve = new THREE.CatmullRomCurve3(curvePath);

        const points = this.curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: color });

        // Create the final object to add to the scene
        this.mesh = new THREE.Line(geometry, material);
    }

    getPoint(part: number) {
        return this.curve.getPoint(part);
    }
}