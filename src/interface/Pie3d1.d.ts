import type { ChartData } from "../types/index";

export interface Pie3d1Interface { // 实例约束
    sum: number;
    camera: THREE.PerspectiveCamera;
    mesh: THREE.Group;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    timeline: any;
    currentModule: THREE.Object3D<THREE.Event> | null;
    addMouseHover: () => void;
    update: () => void;
}

export interface Pie3d1ContructorInterface { // 静态约束
    new(data: ChartData[], camera: THREE.PerspectiveCamera, depth: number): Pie3d1Interface
}