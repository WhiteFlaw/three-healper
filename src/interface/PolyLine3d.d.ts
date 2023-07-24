import type { ChartData } from "../types/index";

export interface PolyLine3dInterface { // 实例约束
    mesh: THREE.Group;
}

export interface PolyLine3dContructorInterface { // 静态约束
    new(data: ChartData[], space: number): PolyLine3dInterface
}

