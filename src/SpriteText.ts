import * as THREE from "three";
import { SpriteTextInterface, SpriteTextContructorInterface } from './interface/SpriteText';

export const SpriteText: SpriteTextContructorInterface = class SpriteText implements SpriteTextInterface{ // 这会生成一个带文字的标签, 但这应当是一个只生成3D文字的类, 需要修改
    context: CanvasRenderingContext2D | null;
    mesh: THREE.Sprite;
    constructor(
        text = "helloworld",
        position = new THREE.Vector3(0, 0, 0)
    ) {
        const canvas: (HTMLCanvasElement | null) = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        this.context = canvas.getContext("2d");
        this.context!.fillStyle = "rgba(90, 90, 90, 0.7)";
        this.context!.fillRect(0, 256, 1024, 512);
        this.context!.textAlign = "center";
        this.context!.textBaseline = "middle";
        this.context!.font = "bold 200px Arial";
        this.context!.fillStyle = "rgba(255, 255, 255, 1)";
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
    }

    // 不搞几个方法在这?
}
