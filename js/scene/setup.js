import * as THREE from 'three';
import { settings } from '../config/setting.js';

// 创建场景
export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.scene.background);
    scene.fog = new THREE.FogExp2(settings.scene.background, settings.scene.fogDensity);
    return scene;
}