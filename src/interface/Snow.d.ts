export interface SnowInterface { // 实例约束
    mesh: THREE.Points;
}

export interface SnowContructorInterface { // 静态约束
    new(geometry?: THREE.BufferGeometry, color?: number, texture?: THREE.Texture): SnowInterface
}