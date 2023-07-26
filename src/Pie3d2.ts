import gsap from 'gsap';
import * as THREE from 'three';
import { SpriteText } from './SpriteText';
import { Pie3d2Interface, Pie3d2ContructorInterface } from './interface/Pie3d2';
import type { ChartDataArr } from './types/index';

export const Pie3d2: Pie3d2ContructorInterface = class Pie3d2 implements Pie3d2Interface {
    sum: number;
    timeline: any;
    mesh: THREE.Group;
    mouse?: THREE.Vector2;
    camera: THREE.PerspectiveCamera;
    raycaster?: THREE.Raycaster;
    currentModule: THREE.Object3D<THREE.Event> | null;
    constructor(data: ChartDataArr, camera: THREE.PerspectiveCamera, radius: number, thickness: number) {
        const chartData = data;
        this.sum = 0;
        this.camera = camera;
        this.currentModule = null;
        this.mesh = new THREE.Group();
        this.currentModule = null;

        let sumRotation = 0;

        chartData.forEach((item) => {
            this.sum += item.value;
        })

        chartData.forEach((item) => {
            let rotation = (item.value / this.sum) * 2 * Math.PI; // 占据角度值

            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            // 先把扇形一边贴向xz平面, 然后扇形边用while画, 每次画一边, 角度增加0.05
            let angle = 0;
            while (angle < rotation) {
                shape.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
                angle += 0.05;
            }
            // x轴为平面, 线极远点y为: 线长 * sin(角度);
            // x轴为平面, 线极远点x为: 线长 * cos(角度);
            // 最后扇形边在最终旋转值处结束
            shape.lineTo(radius * Math.cos(rotation), radius * Math.sin(rotation));
            // 连接到原点封口
            shape.lineTo(0, 0);

            const extrudeSettings = {
                steps: 1,
                depth: thickness,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                vevelOffset: 0,
                bevelSegments: 5
            };

            let color = new THREE.Color(Math.random() * 0xffffff);

            const material = new THREE.MeshBasicMaterial({
                color: color,
                opacity: 0.8,
                transparent: true,
                side: THREE.DoubleSide
            })

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.rotation.z = sumRotation; // 此时扇形有一扇边在xz平面, 需要旋转
            this.mesh.add(cylinder);

            let textPosition = new THREE.Vector3(
                Math.cos(rotation / 3) * radius,
                Math.sin(rotation) * 1.5,
                thickness + 0.7
            )

            let spriteText = new SpriteText(item.name, textPosition);
            cylinder.add(spriteText.mesh);

            sumRotation += rotation;
        })

        this.mesh.rotation.x = -Math.PI / 2;
        this.addMouseHover();
    }

    addMouseHover() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(1, 1);
        this.timeline = gsap.timeline();

        window.addEventListener('mousemove', (event) => {
            this.mouse!.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse!.y = - (event.clientY / window.innerHeight) * 2 + 1;
            this.update();
        })
    }

    update() {
        this.raycaster!.setFromCamera(this.mouse!, this.camera);
        const intersects = this.raycaster!.intersectObjects(
            this.mesh.children,
            false
        );

        if (
            intersects.length > 0 &&
            this.currentModule !== intersects[0].object
        ) {
            if (this.currentModule !== null) {
                this.timeline.to(this.currentModule!.position, { // 旧模块返回
                    x: 0,
                    y: 0,
                    duration: 0.1
                })
            }

            this.currentModule = intersects[0].object;

            this.timeline.to(this.currentModule.position, { // 新模块弹出
                x: Math.cos(this.currentModule.rotation.z),
                y: Math.sin(this.currentModule.rotation.z),
                duration: 0.5
            })
        }

        if (
            intersects.length === 0 &&
            this.currentModule !== null &&
            !this.timeline.isActive()
        ) {
            this.timeline.to(this.currentModule.position, {
                x: 0,
                y: 0,
                duration: 0.5,
                onComplete: () => {
                    console.log('complete');
                    this.currentModule = null;
                }
            })
        }
    }
}