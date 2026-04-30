// js/lights/lighting.js - 优化版
import * as THREE from 'three';

export function setupLights(scene) {
    // 1. 环境光 - 均匀照亮
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // 2. 主光源 - 方向光（产生阴影）
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
    mainLight.position.set(5, 8, 3);
    mainLight.castShadow = true;
    mainLight.receiveShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 20;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);
    
    // 3. 辅助补光 - 从下方柔和补光（消除阴影过暗）
    const fillLight = new THREE.PointLight(0xffccaa, 0.3);
    fillLight.position.set(0, 2, 0);
    fillLight.castShadow = false;
    scene.add(fillLight);
    
    console.log('💡 光源配置：主光源(方向光) + 环境光 + 柔和补光');
    
    return {
        ambientLight,
        mainLight,
        fillLight
    };
}