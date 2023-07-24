export interface Bar3dInterface { // 实例约束
    mesh: THREE.Group;
}

export interface Bar3dContructorInterface { // 静态约束
    new(category: string[][], bottom: number, left: number, size: THREE.Vector3): Bar3dInterface
}