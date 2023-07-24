import * as THREE from 'three';
import { CamerasInterface, CamerasContructorInterface } from './interface/Camera';

// 多机位
export const Cameras: CamerasContructorInterface = class Cameras implements CamerasInterface {
    cameraMap: Map<string, THREE.PerspectiveCamera>;
    camera: THREE.PerspectiveCamera;
    constructor(fov: number, near: number, far: number) {
        this.cameraMap = new Map();
        this.camera = this.addPerspectiveCamera(fov, near, far);
        this.cameraMap.set('default', this.camera);
    }

    rePos(pos: THREE.Vector3): void {
        this.camera.position.copy(pos);
    }

    addPerspectiveCamera(fov: number, near: number, far: number): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(fov, window.innerHeight / window.innerHeight, near, far);
        return camera;
    }

    setCamera(name: string, camera: THREE.PerspectiveCamera): void { // 增加机位
        this.cameraMap.set(name, camera);
    }

    activeCamera(name: string): (THREE.PerspectiveCamera | void) { // 当前激活机位
        if (this.cameraMap.get(name)) {
            this.camera = this.cameraMap.get(name)!;
            return this.camera;
        } else {
            console.warn(`尝试激活不存在的相机${name}`);
        }
    }
}