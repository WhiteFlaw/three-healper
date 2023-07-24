import type { ChartData, BarType } from "../types/index";

export interface Bar3dInterface { // 实例约束
    mesh: THREE.Group;
}

export interface Bar3dContructorInterface { // 静态约束
    new(data: ChartData[], space: number, type: BarType): Bar3dInterface
}
