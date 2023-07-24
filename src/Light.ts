import * as THREE from 'three';
import {
    LightInterface,
    LightContructorInterface,
    AmbientInterface,
    DirectionalInterface,
    SpotInterface,
    PointInterface,
    AmbientContructorInterface,
    DirectionalContructorInterface,
    SpotContructorInterface,
    PointContructorInterface,
    AnyLight
} from './interface/Light';

export const Light: LightContructorInterface = class Light implements LightInterface {
    max: number;
    lights: Map<string, AnyLight>;
    constructor() {
        this.max = -1;
        this.lights = new Map();
    }

    generateName(): string {
        this.max++;
        return `light${this.max}`;
    }

    get(name: string): (AnyLight | void) {
        if(this.lights.get(name)) {
            return this.lights.get(name)!;
        } else {
            console.warn(`尝试获取不存在的光源: ${name}`);
        }
    }

    check(): IterableIterator<string> { // 检视
        return this.lights.keys();
    }

    createAmbientLight(color: number, intensity: number, name?: string): AmbientInterface { // 加name还是得在这， 万一他直接调这几个方法就没名字了
        const ambient = new Ambient(color, intensity);
        (ambient as any).name = name || this.generateName();
        this.lights.set((ambient as any).name, ambient);
        return ambient;
    }

    createDirectionalLight(color: number, intensity: number, name?: string): DirectionalInterface {
        const directional = new Directional(color, intensity);
        (directional as any).name = name || this.generateName();
        this.lights.set((directional as any).name, directional);
        return directional;
    }

    createSpotLight(color: number, intensity: number, name?: string): SpotInterface {
        const spot = new Spot(color, intensity);
        (spot as any).name = name || this.generateName();
        this.lights.set((spot as any).name, spot);
        return spot;
    }

    createPointLight(color: number, intensity: number, name?: string): PointInterface {
        const point = new Point(color, intensity);
        (point as any).name = name || this.generateName();
        this.lights.set((point as any).name, point);
        return point;
    }
}

// 以下不导出防止Light管理不到
const Ambient: AmbientContructorInterface = class Ambient implements AmbientInterface {
    color: number;
    intensity: number;
    light: THREE.AmbientLight;
    constructor(color: number, intensity: number) {
        this.color = color;
        this.intensity = intensity;
        this.light = new THREE.AmbientLight(this.color, this.intensity);
    }

    setColor(color: number): void {
        this.light.color = new THREE.Color(color);
    }

    setIntensity(intensity: number): void {
        this.light.intensity = intensity;
    }

    isAmbient(): boolean {
        if (this.light.isAmbientLight) {
            return true;
        }
        return false;
    }
}

const Directional: DirectionalContructorInterface = class Directional implements DirectionalInterface {
    color: number;
    intensity: number;
    light: THREE.DirectionalLight;
    constructor(color: number, intensity: number) {
        this.color = color;
        this.intensity = intensity;
        this.light = new THREE.DirectionalLight(this.color, this.intensity);
        this.light.castShadow = true;
    }

    rePos(pos: THREE.Vector3): void { // 重定位
        this.light.position.copy(pos);
    }

    setColor(color: number): void { // 颜色
        this.light.color = new THREE.Color(color);
    }

    setIntensity(intensity: number): void {
        this.light.intensity = intensity;
    }

    setRadius(radius: number): void {
        this.light.shadow.radius = radius;
    }

    setViewLength(near: number, far: number): void {
        this.light.shadow.camera.far = far;
        this.light.shadow.camera.near = near;
    }

    setViewArea(top: number, bottom: number, left: number, right: number): void {
        this.light.shadow.camera.top = top;
        this.light.shadow.camera.bottom = bottom;
        this.light.shadow.camera.left = left;
        this.light.shadow.camera.right = right;
    }

    limitShadow(width: number, height: number): void {
        const vec = new THREE.Vector2(width, height)
        this.light.shadow.mapSize = vec;
    }

    lookAt(target: THREE.Object3D): void {
        this.light.target = target;
    }

    help(): THREE.CameraHelper {
        console.warn('.add(directionHelper)');
        const directionHelper = new THREE.CameraHelper(this.light.shadow.camera);
        return directionHelper;
    }

    isDirectional(): boolean {
        if (this.light.isDirectionalLight) {
            return true;
        }
        return false;
    }
}

const Spot: SpotContructorInterface = class Spot implements SpotInterface {
    color: number;
    intensity: number;
    light: THREE.SpotLight;

    constructor(color: number, intensity: number) {
        this.color = color;
        this.intensity = intensity;
        this.light = new THREE.SpotLight(this.color, this.intensity);
        this.light.castShadow = true;
    }

    rePos(pos: THREE.Vector3): void { // 重定位
        this.light.position.copy(pos);
    }

    setColor(color: number): void { // 颜色
        this.light.color = new THREE.Color(color);
    }

    setIntensity(intensity: number): void { // 强度
        this.light.intensity = intensity;
    }

    setDecay(decay: number): void { // 衰减速度
        this.light.decay = decay;
    }

    setRadius(radius: number): void {
        this.light.shadow.radius = radius;
    }

    setPower(power: number): void { // 功率, 会影响Intensity
        this.light.power = power;
    }

    setPenumbra(penumbra: number): void { // 光暗边缘模糊度
        this.light.penumbra = penumbra;
    }

    setCameraFov(fov: number): void { // 可视区上下边角度&左右边角度
        this.light.shadow.camera.fov = fov;
    }

    setViewLength(near: number, far: number): void { // 极近 极远
        this.light.shadow.camera.far = far;
        this.light.shadow.camera.near = near;
    }

    limitShadow(width: number, height: number): void {
        const vec = new THREE.Vector2(width, height)
        this.light.shadow.mapSize = vec;
    }

    lookAt(target: THREE.Object3D): void {
        this.light.target = target;
    }

    help(): THREE.CameraHelper {
        console.warn('.add(spotHelper)');
        const spotHelper = new THREE.CameraHelper(this.light.shadow.camera);
        return spotHelper;
    }

    isSpot(): boolean {
        if (this.light.isSpotLight) {
            return true;
        }
        return false;
    }
}

const Point: PointContructorInterface = class Point implements PointInterface {
    color: number;
    intensity: number;
    light: THREE.PointLight;
    constructor(color: number, intensity: number) {
        this.color = color;
        this.intensity = intensity;
        this.light = new THREE.PointLight(this.color, this.intensity);
        this.light.castShadow = true;
    }

    rePos(pos: THREE.Vector3): void { // 重定位
        this.light.position.copy(pos);
    }

    setColor(color: number): void { // 颜色
        this.light.color = new THREE.Color(color);
    }

    setIntensity(intensity: number): void { // 强度
        this.light.intensity = intensity;
    }

    setDecay(decay: number): void { // 衰减速度
        this.light.decay = decay;
    }

    setRadius(radius: number): void {
        this.light.shadow.radius = radius;
    }

    setPower(power: number): void { // 功率, 会影响Intensity
        this.light.power = power;
    }

    setDistance(distance: number): void { // 到指定距离彻底衰减
        this.light.distance = distance;
    }

    setCameraFov(fov: number): void { // 可视区上下边角度&左右边角度
        this.light.shadow.camera.fov = fov;
    }

    setViewLength(near: number, far: number): void { // 极近 极远
        this.light.shadow.camera.far = far;
        this.light.shadow.camera.near = near;
    }

    limitShadow(width: number, height: number): void {
        const vec = new THREE.Vector2(width, height)
        this.light.shadow.mapSize = vec;
    }

    help(): THREE.CameraHelper {
        console.warn('.add(PointHelper)');
        const PointHelper = new THREE.CameraHelper(this.light.shadow.camera);
        return PointHelper;
    }
}