import * as THREE from 'three';
import { SunInterface, SunContructorInterface } from './interface/Sun';

export const Sun: SunContructorInterface = class Sun implements SunInterface {
    light: THREE.DirectionalLight;
    mesh: THREE.Mesh;
    constructor(radius: number) {
        let sunGeometry = new THREE.SphereGeometry(radius, 32, 32);
        let sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc });
        this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);
    
        this.light = new THREE.DirectionalLight(0xffffcc, 2)
        this.light.shadow.camera.top = 1000;
        this.light.shadow.camera.bottom = -1000;
        this.light.shadow.camera.left = -1000;
        this.light.shadow.camera.right = 1000;
        this.light.shadow.camera.far = 1000;
        this.light.shadow.camera.near = 1;
        this.light.shadow.mapSize = new THREE.Vector2(20480, 20480);
        this.light.shadow.radius = 5;
        this.mesh.add(this.light); // 我是傻逼
    }

    rePos(pos: THREE.Vector3) {
        this.mesh!.position.copy(pos);
    }
}