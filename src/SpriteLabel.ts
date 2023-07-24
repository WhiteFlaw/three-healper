import * as THREE from "three";
import { SpriteLabelInterface, SpriteLabelContructorInterface } from './interface/SpriteLabel';

export const SpriteLabel: SpriteLabelContructorInterface = class SpriteLabel implements SpriteLabelInterface {
    context: CanvasRenderingContext2D | null;
    mesh: THREE.Sprite;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    constructor(
        camera: THREE.PerspectiveCamera,
        text: string,
        position: THREE.Vector3,
        callback: (intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) => any
    ) {
        const canvas: (HTMLCanvasElement | null) = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        this.context = canvas.getContext("2d");
        this.context!.textAlign = "center";
        this.context!.textBaseline = "middle";
        this.context!.font = "bold 200px Arial";
        this.context!.fillStyle = "rgba(90,90,90,0.7)";
        this.context!.fillStyle = "rgba(255,255,255,1)";
        this.context!.fillRect(0, 256, 1024, 512);
        this.context!.fillText(text, canvas.width / 2, canvas.height / 2);

        let texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.SpriteMaterial({
            map: texture,
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true
        });
        this.mesh = new THREE.Sprite(material);
        this.mesh.scale.set(1, 1, 1);
        this.mesh.position.copy(position);

        // 创建射线
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // 事件的监听
        window.addEventListener("click", (event) => {
            this.mouse!.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse!.y = -(event.clientY / (1080 * (window.innerWidth / 1920))) * 2 + 1;

            this.raycaster!.setFromCamera(this.mouse!, camera);

            const intersects = this.raycaster!.intersectObject(this.mesh!);
            if (intersects.length > 0) {
                callback(intersects);
            }
        });
    }
}
