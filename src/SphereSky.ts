import * as THREE from 'three';
import * as THREEHELPER from './types/index';
import { SpriteSkyInterface, SpriteSkyContructorInterface } from './interface/SphereSky';

export const SphereSky: SpriteSkyContructorInterface = class SphereSky implements SpriteSkyInterface {
  mesh: THREE.Mesh;
  constructor(radius: number, envMap: THREE.Texture, time: THREEHELPER.Time) {
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshBasicMaterial({
      map: envMap,
      side: THREE.BackSide,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.y = Math.PI / 2;

    if (!time) return;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.time = time;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        uniform float time;
        `
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
          #include <dithering_fragment>
          float dayStrength = 0.0;
          if(abs(time - 12.0) < 4.0) {
            dayStrength = 1.0;
          }
          if(abs(time - 12.0) > 6.0) {
            dayStrength = 0.15;
          }
          if(abs(time - 12.0) >= 4.0 && abs(time - 12.0) <= 6.0) {
            dayStrength = 1.0 - (abs(time - 12.0) - 4.0) / 2.0;
            dayStrength = clamp(dayStrength, 0.15, 1.0);
          }
          gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), gl_FragColor, dayStrength);
          `
        // gl_FragColor.rgb = mix(纯黑夜, 纯白天, 混合程度);
      )
    }
  }
}