export interface CurveInterface { // 实例约束
    curve: THREE.CatmullRomCurve3;
    mesh: THREE.Line;
    getPoint: (part: number) => THREE.Vector3;
}

export interface CurveContructorInterface { // 静态约束
    new(path: THREE.Vector3[], color: number): CurveInterface
}
