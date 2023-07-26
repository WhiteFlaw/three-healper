import * as THREE from 'three';
import { SnowInterface, SnowContructorInterface } from './interface/Snow';

export const Snow: SnowContructorInterface = class Snow implements SnowInterface { // 雪区规模最好能自定义 颗粒大小自定义
    mesh: THREE.Points;
    constructor(geometry?: THREE.BufferGeometry, color?: number, texture?: THREE.Texture) {
        const particleGeometry = geometry || new THREE.BufferGeometry();

        const count = 3000;
        const colors = new Float32Array(count * 3);
        const positions = new Float32Array(count * 3); // 3个一组

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100; // 0到-5之间
            colors[i] = color || 0xffffff;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial();
        
        if (texture) {
            material.map = texture;
            material.alphaMap = texture;
        }
        material.size = 0.5;
        material.color.set(0xfff000);
        material.transparent = true;
        material.depthWrite = false;
        material.vertexColors = true;
        material.sizeAttenuation = true;
        material.blending = THREE.AdditiveBlending;

        const points = new THREE.Points(particleGeometry, material);

        this.mesh = points;
    }
}