// js/lights/lighting.js - 优化版
import * as THREE from 'three';

export function setupLights(scene) {
    // 1. 环境光 - 提高亮度保证基础可见度
    const ambientLight = new THREE.AmbientLight(0x444455, 0.5);
    scene.add(ambientLight);

    // 2. 半球光 - 模拟天花板与地面之间的自然漫反射
    const hemiLight = new THREE.HemisphereLight(0x888899, 0x222222, 0.35);
    scene.add(hemiLight);

    // 3. 主光源 - 方向光（产生阴影）
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
    mainLight.position.set(5, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    scene.add(mainLight);

    // 4. 展厅重点照明 - 聚光灯阵列（照亮展台区域，更宽更亮）
    const spotPositions = [
        { x: 0, z: 0 },
        { x: -9, z: 0 }, { x: 9, z: 0 },
        { x: 0, z: -9 }, { x: 0, z: 9 },
        { x: -9, z: -9 }, { x: 9, z: -9 },
        { x: -9, z: 9 }, { x: 9, z: 9 }
    ];

    const spotLights = [];
    spotPositions.forEach((pos) => {
        const spot = new THREE.SpotLight(0xfff0dd, 1.5, 18, Math.PI / 5, 0.6, 1);
        spot.position.set(pos.x, 5.2, pos.z);
        spot.target.position.set(pos.x, 0, pos.z);
        spot.castShadow = true;
        spot.shadow.mapSize.width = 512;
        spot.shadow.mapSize.height = 512;
        scene.add(spot);
        scene.add(spot.target);
        spotLights.push(spot);
    });

    // 5. 柔和的补光 - 避免阴影过暗
    const fillLight = new THREE.PointLight(0x556677, 0.4);
    fillLight.position.set(0, 4, 0);
    fillLight.castShadow = false;
    scene.add(fillLight);

    console.log('💡 光源配置：环境光 + 半球光 + 主方向光 + 9盏展台聚光灯 + 柔和补光');

    return {
        ambientLight,
        mainLight,
        fillLight,
        spotLights
    };
}