import * as THREE from 'three';

/**
 * 展品特写查看控制器
 * 按E后进入展品查看模式：
 * - 背景变暗，相机移动到展品前方
 * - 鼠标拖拽可围绕展品360°旋转查看
 * - 屏幕底部显示详细描述
 * - 按ESC或点击关闭按钮退出
 */
export class ExhibitViewController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.isActive = false;
        this.isDragging = false;

        // 球坐标参数
        this.target = new THREE.Vector3();
        this.radius = 2.2;
        this.theta = 0;       // 水平旋转角
        this.phi = Math.PI / 2.5; // 垂直角度（从上方看）

        // 保存的相机状态
        this.savedState = null;

        // DOM元素
        this.overlay = null;
        this.infoPanel = null;

        // 绑定事件处理函数（用于解绑）
        this._onMouseDown = this.onMouseDown.bind(this);
        this._onMouseMove = this.onMouseMove.bind(this);
        this._onMouseUp = this.onMouseUp.bind(this);
        this._onKeyDown = this.onKeyDown.bind(this);
    }

    /**
     * 进入展品查看模式
     * @param {Object} exhibitCase - 展台实例
     * @param {string} longDescription - 详细描述文字
     */
    enter(exhibitCase, longDescription) {
        if (this.isActive) return;

        const model = exhibitCase.getModel();
        const pos = exhibitCase.getPosition();

        // 如果没有模型，使用展台位置
        const targetY = model ? model.position.y + 0.3 : 1.0;
        this.target.set(pos.x, targetY, pos.z);

        // 保存当前相机状态（保存 rotation 而非 quaternion，兼容 FirstPersonControls）
        this.savedState = {
            position: this.camera.position.clone(),
            rotation: this.camera.rotation.clone()
        };

        // 如果鼠标被锁定，先解锁
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }

        // 计算当前相机相对展品的角度，让过渡自然
        const dx = this.savedState.position.x - this.target.x;
        const dy = this.savedState.position.y - this.target.y;
        const dz = this.savedState.position.z - this.target.z;
        this.radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
        this.radius = Math.max(1.5, Math.min(4.0, this.radius));
        this.theta = Math.atan2(dx, dz);
        this.phi = Math.acos(Math.max(-1, Math.min(1, dy / this.radius)));
        this.phi = Math.max(0.3, Math.min(Math.PI - 0.3, this.phi));

        // 创建UI
        this.createOverlay();
        this.createInfoPanel(exhibitCase.config.name, longDescription);

        // 绑定事件
        this.bindEvents();

        this.isActive = true;
        this.updateCamera();
    }

    /**
     * 退出展品查看模式
     */
    exit() {
        if (!this.isActive) return;

        // 恢复相机（恢复 rotation 让 FirstPersonControls 同步）
        if (this.savedState) {
            this.camera.position.copy(this.savedState.position);
            this.camera.rotation.copy(this.savedState.rotation);
        }

        // 移除UI
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => this.overlay.remove(), 300);
        }
        if (this.infoPanel) {
            this.infoPanel.style.opacity = '0';
            setTimeout(() => this.infoPanel.remove(), 300);
        }

        this.unbindEvents();
        this.isActive = false;
    }

    /**
     * 更新相机位置（球坐标）
     */
    updateCamera() {
        const x = this.target.x + this.radius * Math.sin(this.phi) * Math.sin(this.theta);
        const y = this.target.y + this.radius * Math.cos(this.phi);
        const z = this.target.z + this.radius * Math.sin(this.phi) * Math.cos(this.theta);

        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.target);
    }

    // ========== 鼠标事件 ==========

    onMouseDown() {
        this.isDragging = true;
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        this.theta -= e.movementX * 0.008;
        this.phi -= e.movementY * 0.008;
        this.phi = Math.max(0.2, Math.min(Math.PI - 0.4, this.phi));
        this.updateCamera();
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onKeyDown(e) {
        if (e.code === 'Escape') {
            this.exit();
        }
    }

    // ========== DOM UI ==========

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'absolute';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.background = 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)';
        this.overlay.style.zIndex = '200';
        this.overlay.style.transition = 'opacity 0.3s ease';
        this.overlay.style.pointerEvents = 'none';
        document.body.appendChild(this.overlay);
    }

    createInfoPanel(name, description) {
        this.infoPanel = document.createElement('div');
        this.infoPanel.style.position = 'absolute';
        this.infoPanel.style.bottom = '30px';
        this.infoPanel.style.left = '50%';
        this.infoPanel.style.transform = 'translateX(-50%) translateY(20px)';
        this.infoPanel.style.background = 'linear-gradient(180deg, rgba(20,20,25,0.95) 0%, rgba(10,10,15,0.98) 100%)';
        this.infoPanel.style.color = '#e8e0d0';
        this.infoPanel.style.padding = '24px 40px';
        this.infoPanel.style.borderRadius = '16px';
        this.infoPanel.style.fontFamily = '"Microsoft YaHei", sans-serif';
        this.infoPanel.style.zIndex = '300';
        this.infoPanel.style.border = '1px solid rgba(212,175,55,0.4)';
        this.infoPanel.style.maxWidth = '700px';
        this.infoPanel.style.width = '85%';
        this.infoPanel.style.boxShadow = '0 -8px 40px rgba(0,0,0,0.5)';
        this.infoPanel.style.transition = 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        this.infoPanel.style.pointerEvents = 'auto';

        this.infoPanel.innerHTML = `
            <h3 style="margin:0 0 12px 0; color:#d4af37; font-size:20px; text-align:center; letter-spacing:2px">${name}</h3>
            <p style="margin:0; line-height:1.9; font-size:14px; text-align:justify; max-height:180px; overflow-y:auto; padding-right:8px">${description}</p>
            <div style="margin-top:14px; text-align:center; font-size:12px; color:#887755; border-top:1px solid #444; padding-top:10px">
                🖱️ 拖拽鼠标旋转查看 &nbsp;|&nbsp; ⌨️ ESC 或点击此处退出
            </div>
        `;

        // 点击面板也可退出
        this.infoPanel.addEventListener('click', () => this.exit());

        document.body.appendChild(this.infoPanel);

        // 入场动画
        requestAnimationFrame(() => {
            this.infoPanel.style.transform = 'translateX(-50%) translateY(0)';
        });
    }

    // ========== 事件绑定 ==========

    bindEvents() {
        this.domElement.addEventListener('mousedown', this._onMouseDown);
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('mouseup', this._onMouseUp);
        document.addEventListener('keydown', this._onKeyDown);
    }

    unbindEvents() {
        this.domElement.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
        document.removeEventListener('keydown', this._onKeyDown);
    }
}
