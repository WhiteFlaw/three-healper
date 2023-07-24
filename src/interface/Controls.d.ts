import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls';
import type { FlyControls as FlyControlsType } from 'three/examples/jsm/controls/FlyControls';
import type { FirstPersonControls as FirstPersonControlsType } from 'three/examples/jsm/controls/FirstPersonControls';

type AnyControls = (OrbitControlsType | FlyControlsType | FirstPersonControlsType);

export interface ControlsInterface { // 实例约束
    controls: AnyControls;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controlsMap: Map<string, AnyControls>;
    setOrbitControl: (name: string) => OrbitControlsType;
    setFlyControl: (name: string) => FlyControlsType;
    setFirstPersonControl: (name: string) => FirstPersonControlsType;
    activeControl: (name: string) => (AnyControls | void);
}

export interface ControlsContructorInterface { // 静态约束
    new(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): ControlsInterface
}
