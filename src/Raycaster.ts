import * as THREE from 'three';
import type { Canvas, Mouse } from './types/index';
import { RaycasterInterface, RaycasterContructorInterface } from './interface/Raycaster';

export const Raycaster: RaycasterContructorInterface = class Raycaster implements RaycasterInterface {
    element: Canvas;
    raycaster: THREE.Raycaster;
    camera: THREE.PerspectiveCamera;
    mouse: Mouse;
    meshArr: THREE.Mesh[];
    constructor(element: Canvas, camera: THREE.PerspectiveCamera) {
        this.element = element;
        this.camera = camera;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.meshArr = [];
    }

    createClickRaycaster(callback: Function) {
        this.element!.addEventListener("click", (event) => {
            this.updateMouse(event);
            this.onRay((intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => {
                callback(intersects);
            });
        });
    }

    createHoverRaycaster(callback: Function) {
        this.element!.addEventListener("mousemove", (event) => {
            this.updateMouse(event);
            this.onRay((intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => {
                callback(intersects);
            });
        });
    }

    setMeshArr(meshArr: THREE.Mesh[]) {
        this.meshArr = meshArr;
    }

    onRay(callback: Function) {
        this.raycaster!.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster!.intersectObjects(this.meshArr);
        if (intersects.length > 0) {
            callback(intersects);
        }
    }

    updateMouse(event: MouseEvent) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / (1080 * (window.innerWidth / 1920))) * 2 + 1;
        return this.mouse;
    }
}