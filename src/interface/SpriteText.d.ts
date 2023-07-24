import * as THREE from 'three';

export interface SpriteTextInterface { // 实例约束
    context: CanvasRenderingContext2D | null;
    mesh: THREE.Sprite;
}

export interface SpriteTextContructorInterface { // 静态约束
    new(text: string, position: THREE.Vector3): SpriteTextInterface;
}