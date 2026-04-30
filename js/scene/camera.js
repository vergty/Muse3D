// js/scene/camera.js
import * as THREE from 'three';
import { settings } from '../config/setting.js';

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75,  // 视野角度（第一人称建议用 75-90）
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    // 初始位置（会在控制器中被覆盖）
    camera.position.set(0, 1.6, 0);
    
    // 确保相机的 up 方向正确（Y 轴向上）
    camera.up.set(0, 1, 0);
    
    return camera;
}