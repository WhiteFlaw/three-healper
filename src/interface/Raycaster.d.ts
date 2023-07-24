import { Canvas, Mouse } from '../types/index';

export interface RaycasterInterface { // 实例约束
    createClickRaycaster: (callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any) => void;
    createHoverRaycaster: (callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any) => void;
    setMeshArr: (meshArr: THREE.Mesh[]) => void;
    onRay: (callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any) => void;
    updateMouse: (event: MouseEvent) => void;
    element: Canvas;
    raycaster: THREE.Raycaster;
    camera: THREE.PerspectiveCamera;
    mouse: Mouse;
    meshArr: THREE.Mesh[];
}

export interface RaycasterContructorInterface { // 静态约束
    new(element: Canvas, camera: THREE.PerspectiveCamera): RaycasterInterface
}
