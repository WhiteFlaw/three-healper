export interface CamerasInterface { // 实例约束
    cameraMap: Map<string, THREE.PerspectiveCamera>;
    camera: THREE.PerspectiveCamera;
    rePos: (pos: THREE.Vector3) => void;
    addPerspectiveCamera: (fov: number, min: number, max: number) => THREE.PerspectiveCamera;
    setCamera: (name: string, camera: THREE.PerspectiveCamera) => void;
    activeCamera: (name: string) => (THREE.PerspectiveCamera | void);
}

export interface CamerasContructorInterface { // 静态约束
    new(fov: number, min: number, max: number): CamerasInterface
}