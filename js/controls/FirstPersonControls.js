// js/controls/FirstPersonControls.js
import * as THREE from 'three';

/**
 * 第一人称控制器 - 修复版
 * 确保视角与地面平行
 */
export class FirstPersonControls {
    constructor(camera, domElement, scene, options = {}) {
        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        
        // 配置选项
        this.moveSpeed = options.moveSpeed || 5;
        this.lookSpeed = options.lookSpeed || 0.002;
        this.height = options.height || 1.6;  // 眼睛高度
        
        // 位置和旋转
        this.position = new THREE.Vector3(0, this.height, 0);
        
        // 欧拉角（使用 Three.js 的 Euler 对象）
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');  // YXZ 顺序：先 Y 轴（水平），再 X 轴（垂直）
        
        // 移动状态
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        
        // 鼠标锁定状态
        this.locked = false;
        
        // 碰撞检测用的墙体
        this.walls = [];
        
        this.init();
    }
    
    init() {
        // 绑定事件
        this.domElement.addEventListener('click', () => this.lock());
        document.addEventListener('pointerlockchange', () => this.onLockChange());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // 禁用右键菜单
        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // 设置初始相机位置和朝向
        this.updateCamera();
    }
    
    lock() {
        this.domElement.requestPointerLock();
    }
    
    onLockChange() {
        this.locked = document.pointerLockElement === this.domElement;
        if (this.locked) {
            console.log('🔒 鼠标已锁定，移动鼠标旋转视角');
        } else {
            console.log('🔓 鼠标已解锁');
        }
    }
    
    onMouseMove(event) {
        if (!this.locked) return;
        
        // 水平旋转（左右看）
        this.euler.y -= event.movementX * this.lookSpeed;
        
        // 垂直旋转（上下看）- 限制角度防止翻转
        this.euler.x -= event.movementY * this.lookSpeed;
        this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));
        
        // 更新相机
        this.updateCamera();
    }
    
    onKeyDown(event) {
        switch(event.code) {
            case 'KeyW': this.keys.forward = true; break;
            case 'KeyS': this.keys.backward = true; break;
            case 'KeyA': this.keys.left = true; break;
            case 'KeyD': this.keys.right = true; break;
            case 'Escape': if (this.locked) document.exitPointerLock(); break;
        }
    }
    
    onKeyUp(event) {
        switch(event.code) {
            case 'KeyW': this.keys.forward = false; break;
            case 'KeyS': this.keys.backward = false; break;
            case 'KeyA': this.keys.left = false; break;
            case 'KeyD': this.keys.right = false; break;
        }
    }
    
    /**
     * 更新相机位置和朝向
     */
    updateCamera() {
        // 设置相机位置
        this.camera.position.copy(this.position);
        
        // 设置相机旋转（使用欧拉角）
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.euler.y;
        this.camera.rotation.x = this.euler.x;
        this.camera.rotation.z = 0;  // 确保 Z 轴为 0，保持水平
    }
    
    /**
     * 添加墙体用于碰撞检测
     */
    addWall(wall) {
        this.walls.push(wall);
    }
    
    /**
     * 碰撞检测
     */
    checkCollision(newPosition) {
        // 博物馆边界限制（根据你的博物馆尺寸 24x18）
        const margin = 0.5;
        const boundX = 11.5;   // 宽度 24/2 - margin
        const boundZ = 8.5;    // 深度 18/2 - margin
        
        if (Math.abs(newPosition.x) > boundX) return true;
        if (Math.abs(newPosition.z) > boundZ) return true;
        
        // 与墙体的碰撞检测
        for (let wall of this.walls) {
            if (!wall.userData || !wall.userData.collision) continue;
            
            const wallBox = new THREE.Box3().setFromObject(wall);
            const playerBox = new THREE.Box3().setFromCenterAndSize(
                newPosition,
                new THREE.Vector3(0.6, 1.6, 0.6)
            );
            if (playerBox.intersectsBox(wallBox)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 获取前进方向（基于相机朝向，但保持水平）
     */
    getForwardDirection() {
        const forward = new THREE.Vector3(
            -Math.sin(this.euler.y),
            0,
            -Math.cos(this.euler.y)
        ).normalize();
        return forward;
    }
    
    /**
     * 获取右方向
     */
    getRightDirection() {
        const right = new THREE.Vector3(
            Math.cos(this.euler.y),
            0,
            -Math.sin(this.euler.y)
        ).normalize();
        return right;
    }
    
    /**
     * 更新位置和相机
     */
    update(deltaTime) {
        if (!this.locked) return;
        
        // 计算移动方向
        const actualMoveSpeed = this.moveSpeed * deltaTime;
        let moveDelta = new THREE.Vector3(0, 0, 0);
        
        // 获取水平方向（忽略垂直方向）
        const forward = this.getForwardDirection();
        const right = this.getRightDirection();
        
        // 根据按键计算移动
        if (this.keys.forward) moveDelta.add(forward);
        if (this.keys.backward) moveDelta.sub(forward);
        if (this.keys.right) moveDelta.add(right);
        if (this.keys.left) moveDelta.sub(right);
        
        // 归一化并应用速度
        if (moveDelta.length() > 0) moveDelta.normalize();
        moveDelta.multiplyScalar(actualMoveSpeed);
        
        // 尝试移动
        let newPosition = this.position.clone().add(moveDelta);
        
        // 碰撞检测
        if (!this.checkCollision(newPosition)) {
            this.position.copy(newPosition);
        } else {
            // 尝试单独在 X 轴移动
            let newX = this.position.clone();
            newX.x += moveDelta.x;
            if (!this.checkCollision(newX)) {
                this.position.x = newX.x;
            }
            
            // 尝试单独在 Z 轴移动
            let newZ = this.position.clone();
            newZ.z += moveDelta.z;
            if (!this.checkCollision(newZ)) {
                this.position.z = newZ.z;
            }
        }
        
        // 确保 Y 轴高度不变（保持水平）
        this.position.y = this.height;
        
        // 更新相机
        this.updateCamera();
    }
    
    /**
     * 重置位置
     */
    resetPosition(x, z) {
        this.position.set(x, this.height, z);
        this.updateCamera();
    }
    
    /**
     * 重置旋转
     */
    resetRotation() {
        this.euler.set(0, 0, 0, 'YXZ');
        this.updateCamera();
    }
}