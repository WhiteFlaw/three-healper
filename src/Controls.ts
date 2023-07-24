import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls';
import type { FlyControls as FlyControlsType } from 'three/examples/jsm/controls/FlyControls';
import type { FirstPersonControls as FirstPersonControlsType } from 'three/examples/jsm/controls/FirstPersonControls';
import { AnyControls, ControlsInterface, ControlsContructorInterface } from './interface/Controls';

export const Controls: ControlsContructorInterface = class Controls implements ControlsInterface {
    controls: AnyControls;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controlsMap: Map<string, AnyControls>;
    constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.camera = camera;
        this.renderer = renderer;

        this.controlsMap = new Map();
        this.setOrbitControl('default');
        this.activeControl('default');
    }

    setOrbitControl(name: string): OrbitControlsType {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;
        // 自动旋转
        // controls.autoRotate = true;

        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = 0;
        this.controlsMap.set(name, controls);
        return controls;
    }

    setFlyControl(name: string): FlyControlsType {
        const controls = new FlyControls(this.camera, this.renderer.domElement);
        controls.movementSpeed = 100;
        controls.rollSpeed = Math.PI / 60;
        this.controlsMap.set(name, controls);
        return controls;
    }

    setFirstPersonControl(name: string): FirstPersonControlsType {
        const controls = new FirstPersonControls(this.camera, this.renderer.domElement);
        controls.movementSpeed = 100;
        controls.lookSpeed = Math.PI / 60;
        this.controlsMap.set(name, controls);
        return controls;
    }

    activeControl(name: string): (AnyControls | void) {
        if(this.controlsMap.get(name)) {
            this.controls = this.controlsMap.get(name)!;
            return this.controls;
        } else {
            console.warn('尝试激活不存在的控制器');
        }
    }
}
