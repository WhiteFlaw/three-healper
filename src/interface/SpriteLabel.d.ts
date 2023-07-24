import * as THREE from 'three';

export interface SpriteLabelInterface { // 实例约束
    context: CanvasRenderingContext2D | null;
    mesh: THREE.Sprite;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
}

export interface SpriteLabelContructorInterface { // 静态约束
    new(camera: THREE.PerspectiveCamera, text: string, position: THREE.Vector3, callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any): SpriteLabelInterface
}