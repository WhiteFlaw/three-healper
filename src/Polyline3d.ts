import * as THREE from 'three';
import { SpriteText } from './SpriteText';
import type { ChartDataArr } from './types/index.js';
import { PolyLine3dInterface, PolyLine3dContructorInterface } from './interface/PolyLine3d';

export const Polyline3d: PolyLine3dContructorInterface = class Polyline3d implements PolyLine3dInterface {
    mesh: THREE.Group;
    constructor(data: ChartDataArr, space: number) {
        const chartData = data;
        this.mesh = new THREE.Group();
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        
        const color = new THREE.Color(Math.random() * 0xffffff);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color });
        
        chartData.forEach((item, index) => {
            const points: THREE.Vector3[] = [];
            shape.lineTo(index * space, item.value);
            
            points.push(new THREE.Vector3(index * space, item.value, 0));
            points.push(new THREE.Vector3(index * space, 0, 0));
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.mesh.add(line);

            let textPosition = new THREE.Vector3(index * space, item.value + 0.5, 0);
            let spriteText = new SpriteText("" + item.name + ':' + item.value, textPosition); // 此处在spriteText改版后使用spriteLabel
            this.mesh.add(spriteText.mesh);
        })

        shape.lineTo(chartData.length * space - space, 0);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            steps: 1,
            depth: 0.1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            vevelOffset: 0,
            bevelSegments: 5
        };

        const material = new THREE.MeshStandardMaterial({
            color: color,
            opacity: 1,
            transparent: true,
            side: THREE.DoubleSide
        })

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        const mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(-3, 0, 0);
        this.mesh.add(mesh)
    }
}