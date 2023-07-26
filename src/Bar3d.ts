import * as THREE from 'three';
import { SpriteText } from './SpriteText';
import type { ChartData, BarType } from './types/index';
import { Bar3dInterface, Bar3dContructorInterface } from './interface/Bar3d';

export const Bar3d: Bar3dContructorInterface = class Bar3d implements Bar3dInterface {
    mesh: THREE.Group;
    constructor(data: ChartData[], space: number, type: BarType) { // cylinder圆柱体, rect矩形
        this.mesh = new THREE.Group();

        data.forEach((item, index) => {
            let color = new THREE.Color(Math.random() * 0xffffff);

            let material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });

            if (type == 'rect') {
                let boxGeometry = new THREE.BoxGeometry(1, item.value, 1);

                let box = new THREE.Mesh(boxGeometry, material);
                box.position.set(-3 + index * space, item.value / 2, 0);
                this.mesh.add(box);
            } else {
                let cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, item.value);
                let cylinder = new THREE.Mesh(cylinderGeometry, material);
                cylinder.position.set(-3 + index * space, item.value / 2, 0);
                this.mesh.add(cylinder);
            }

            let textPosition = new THREE.Vector3(-3 + index * space, item.value + 0.5, 0);
            let spriteText = new SpriteText(item.name, textPosition);
            this.mesh.add(spriteText.mesh);
        })
    }
}