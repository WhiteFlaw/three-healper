type AnyLight = (AmbientInterface | DirectionalInterface | SpotInterface | PointInterface)

export interface LightInterface { // 实例约束
    max: number;
    lights: Map<string, AnyLight>;
    generateName: () => string;
    get: (name: string) => (AnyLight | void);
    check: () => IterableIterator<string>;
    createAmbientLight: (color: number, intensity: number, name?: string) => AmbientInterface;
    createDirectionalLight: (color: number, intensity: number, name?: string) => DirectionalInterface;
    createSpotLight: (color: number, intensity: number, name?: string) => SpotInterface;
    createPointLight: (color: number, intensity: number, name?: string) => PointInterface;
}

export interface LightContructorInterface { // 静态约束
    new(): LightInterface
}

//////////////////////////////

export interface AmbientInterface { // 实例约束
    color: number;
    intensity: number;
    light: THREE.AmbientLight;
    setColor: (color: number) => void;
    setIntensity: (intensity: number) => void;
    isAmbient: () => boolean;
}

export interface AmbientContructorInterface { // 静态约束
    new(color: number, intensity: number): AmbientInterface
}

//////////////////////////////

export interface DirectionalInterface { // 实例约束
    color: number;
    intensity: number;
    light: THREE.DirectionalLight;
    rePos: (pos: THREE.Vector3) => void;
    setColor: (color: number) => void;
    setIntensity: (intensity: number) => void;
    setRadius: (radius: number) => void;
    setViewLength: (near: number, far: number) => void;
    setViewArea: (top: number, bottom: number, left: number, right: number) => void;
    limitShadow: (width: number, height: number) => void;
    lookAt: (target: THREE.Object3D) => void;
    help: () => THREE.CameraHelper;
    isDirectional: () => boolean;
}

export interface DirectionalContructorInterface { // 静态约束
    new(color: number, intensity: number): DirectionalInterface
}

///////////////////////////////

export interface SpotInterface { // 实例约束
    color: number;
    intensity: number;
    light: THREE.SpotLight;
    rePos: (pos: THREE.Vector3) => void;
    setColor: (color: number) => void;
    setIntensity: (intensity: number) => void;
    setDecay: (decay: number) => void;
    setRadius: (radius: number) => void;
    setPower: (power: number) => void;
    setPenumbra: (penumbra: number) => void;
    setCameraFov: (fov: number) => void;
    setViewLength: (near: number, far: number) => void;
    limitShadow: (width: number, height: number) => void;
    lookAt: (target: THREE.Object3D) => void;
    help: () => THREE.CameraHelper;
    isSpot: () => boolean;
}

export interface SpotContructorInterface { // 静态约束
    new(color: number, intensity: number): SpotInterface
}

//////////////////////////////

export interface PointInterface { // 实例约束
    color: number;
    intensity: number;
    light: THREE.PointLight;
    rePos: (pos: THREE.Vector3) => void;
    setColor: (color: number) => void;
    setIntensity: (intensity: number) => void;
    setDecay: (decay: number) => void;
    setRadius: (radius: number) => void;
    setPower: (power: number) => void;
    setDistance: (distance: number) => void;
    setCameraFov: (fov: number) => void;
    setViewLength: (near: number, far: number) => void;
    limitShadow: (width: number, height: number) => void;
    help: () => THREE.CameraHelper;
}

export interface PointContructorInterface { // 静态约束
    new(color: number, intensity: number): PointInterface
}