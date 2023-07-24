export interface MatrixInterface { // 实例约束
    context: CanvasRenderingContext2D | null;
    mesh: THREE.Points;
}

export interface MatrixContructorInterface { // 静态约束
    new(space: number, density: number, geometry: THREE.BufferGeometry, texture: THREE.Texture): MatrixInterface;
}