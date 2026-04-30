// js/exhibits/HighEndDisplayCase.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/**
 * 高端展览台
 * 白色大理石底座 + 透明玻璃罩（无内部展品）
 */
export class HighEndDisplayCase {
    constructor(scene, options = {}) {
        this.scene = scene;

        // 配置
        this.config = {
            // 位置
            position: options.position || { x: 0, z: 0 },

            // 名称（用于信息显示）
            name: options.name || '展品',
            description: options.description || '暂无描述',

            // 模型路径（新增）
            modelPath: options.modelPath || null,  // 例如: 'models/vase.glb'

            // 模型缩放
            modelScale: options.modelScale || 0.8,

            // 新增：位置偏移
            modelYOffset: options.modelYOffset || 0,   // 垂直偏移
            modelXOffset: options.modelXOffset || 0,   // X轴偏移
            modelZOffset: options.modelZOffset || 0,   // Z轴偏移

            // 底座配置 - 白色大理石质感
            baseWidth: options.baseWidth || 1.2,
            baseDepth: options.baseDepth || 1.2,
            baseHeight: options.baseHeight || 0.5,
            baseColor: options.baseColor || 0xf5f0e8,
            baseRoughness: options.baseRoughness || 0.35,
            baseMetalness: options.baseMetalness || 0.08,

            // 玻璃罩配置
            glassWidth: options.glassWidth || 1.0,
            glassDepth: options.glassDepth || 1.0,
            glassHeight: options.glassHeight || 0.8,
            glassColor: options.glassColor || 0xe0f0ff,
            glassOpacity: options.glassOpacity || 0.25,
            glassMetalness: options.glassMetalness || 0.95,
            glassRoughness: options.glassRoughness || 0.08,

            // 边缘装饰
            addTrim: options.addTrim !== false,
            trimColor: options.trimColor || 0xd4af37,

            // 底部光晕
            addGlow: options.addGlow !== false,
            glowColor: options.glowColor || 0xffeedd
        };

        // 存储物体
        this.objects = {
            base: null,
            glassParts: [],
            trim: [],
            glow: null,
            model: null
        };

        // 交互区域（用于检测靠近）
        this.interactionRadius = 1.8;
        this.isPlayerNear = false;

        // 信息面板元素
        this.infoPanel = null;

        // 加载器
        this.loader = new GLTFLoader();

        // 加载回调（用于进度管理）
        this.onModelLoad = options.onModelLoad || null;
        this.onModelError = options.onModelError || null;
    }

    /**
     * 构建展览台
     */
    async build() {
        this.createBase();
        this.createGlass();
        if (this.config.addTrim) {
            this.createTrim();
        }
        if (this.config.addGlow) {
            this.createGlow();
        }
        // 如果有模型路径，加载模型
        if (this.config.modelPath) {
            await this.loadModel();
        }
        return this;
    }

    /**
        * 加载 3D 模型
        */
   loadModel() {
    return new Promise((resolve, reject) => {
        this.loader.load(
            this.config.modelPath,
            (gltf) => {
                this.objects.model = gltf.scene;

                // 计算模型位置（带偏移）
                const baseY = this.config.baseHeight + this.config.glassHeight / 2 - 0.1;
                const modelY = baseY + (this.config.modelYOffset || 0);

                // ✅ 修复：X 和 Z 也要加上偏移量
                this.objects.model.position.set(
                    this.config.position.x + (this.config.modelXOffset || 0),  // ← 加上 X 偏移
                    modelY,
                    this.config.position.z + (this.config.modelZOffset || 0)   // ← 加上 Z 偏移
                );

                // 缩放模型
                this.objects.model.scale.set(
                    this.config.modelScale,
                    this.config.modelScale,
                    this.config.modelScale
                );

                // 启用阴影
                this.objects.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                this.scene.add(this.objects.model);
                if (this.onModelLoad) this.onModelLoad(this.config.name);
                console.log(`✅ 模型加载成功: ${this.config.modelPath}`);
                console.log(`📍 模型位置: (${this.objects.model.position.x}, ${this.objects.model.position.y}, ${this.objects.model.position.z})`);
                resolve();
            },
            undefined,
            (error) => {
                console.error(`❌ 模型加载失败: ${this.config.modelPath}`, error);
                if (this.onModelError) this.onModelError(this.config.name);
                reject(error);
            }
        );
    });
}
    /**
     * 创建白色大理石底座（带圆角效果）
     */
    createBase() {
        // 主底座
        const baseMat = new THREE.MeshStandardMaterial({
            color: this.config.baseColor,
            roughness: this.config.baseRoughness,
            metalness: this.config.baseMetalness
        });

        this.objects.base = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.config.baseWidth,
                this.config.baseHeight,
                this.config.baseDepth
            ),
            baseMat
        );
        this.objects.base.position.set(
            this.config.position.x,
            this.config.baseHeight / 2,
            this.config.position.z
        );
        this.objects.base.castShadow = true;
        this.objects.base.receiveShadow = true;
        this.scene.add(this.objects.base);

        // 上层装饰（白色大理石薄片）
        const topMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.15
        });
        const topPlate = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.config.baseWidth - 0.08,
                0.08,
                this.config.baseDepth - 0.08
            ),
            topMat
        );
        topPlate.position.set(
            this.config.position.x,
            this.config.baseHeight - 0.02,
            this.config.position.z
        );
        topPlate.castShadow = true;
        this.scene.add(topPlate);
        this.objects.trim.push(topPlate);
    }

    /**
     * 创建玻璃罩（单 Mesh，使用物理透光材质）
     */
    createGlass() {
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: this.config.glassColor,
            transmission: 0.92,
            thickness: 0.15,
            metalness: 0.0,
            roughness: 0.05,
            ior: 1.5,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });

        const glassHeight = this.config.glassHeight;
        const glassWidth = this.config.glassWidth;
        const glassDepth = this.config.glassDepth;

        const glassY = this.config.baseHeight + glassHeight / 2;
        const glassX = this.config.position.x;
        const glassZ = this.config.position.z;

        const glassBox = new THREE.Mesh(
            new THREE.BoxGeometry(glassWidth, glassHeight, glassDepth),
            glassMat
        );
        glassBox.position.set(glassX, glassY, glassZ);
        glassBox.castShadow = false;
        glassBox.receiveShadow = true;
        this.scene.add(glassBox);
        this.objects.glassParts = [glassBox];
    }

    /**
     * 创建金色边缘装饰
     */
    createTrim() {
        const trimMat = new THREE.MeshStandardMaterial({
            color: this.config.trimColor,
            metalness: 0.85,
            roughness: 0.2,
            emissive: 0x442200,
            emissiveIntensity: 0.1
        });

        const baseTopY = this.config.baseHeight;
        const baseX = this.config.position.x;
        const baseZ = this.config.position.z;
        const trimHeight = 0.04;
        const trimWidth = 0.06;

        // 底座四边的金色装饰条
        const trimPositions = [
            { x: 0, z: this.config.baseDepth / 2, width: this.config.baseWidth, depth: trimWidth },
            { x: 0, z: -this.config.baseDepth / 2, width: this.config.baseWidth, depth: trimWidth },
            { x: -this.config.baseWidth / 2, z: 0, width: trimWidth, depth: this.config.baseDepth },
            { x: this.config.baseWidth / 2, z: 0, width: trimWidth, depth: this.config.baseDepth }
        ];

        trimPositions.forEach(pos => {
            const trim = new THREE.Mesh(
                new THREE.BoxGeometry(pos.width, trimHeight, pos.depth),
                trimMat
            );
            trim.position.set(baseX + pos.x, baseTopY + 0.01, baseZ + pos.z);
            trim.castShadow = true;
            this.scene.add(trim);
            this.objects.trim.push(trim);
        });

        // 四角装饰
        const corners = [
            [-this.config.baseWidth / 2, -this.config.baseDepth / 2],
            [this.config.baseWidth / 2, -this.config.baseDepth / 2],
            [-this.config.baseWidth / 2, this.config.baseDepth / 2],
            [this.config.baseWidth / 2, this.config.baseDepth / 2]
        ];

        corners.forEach(corner => {
            const cornerDeco = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 8, 8),
                trimMat
            );
            cornerDeco.position.set(baseX + corner[0], baseTopY + 0.03, baseZ + corner[1]);
            cornerDeco.castShadow = true;
            this.scene.add(cornerDeco);
            this.objects.trim.push(cornerDeco);
        });
    }

    /**
     * 创建底部光晕（营造高端感）
     */
    createGlow() {
        const glowMat = new THREE.MeshStandardMaterial({
            color: this.config.glowColor,
            emissive: this.config.glowColor,
            emissiveIntensity: 0.15,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });

        const glow = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.config.baseWidth * 0.9,
                this.config.baseWidth * 1.1,
                0.05,
                16
            ),
            glowMat
        );
        glow.position.set(
            this.config.position.x,
            0.02,
            this.config.position.z
        );
        glow.castShadow = false;
        this.scene.add(glow);
        this.objects.glow = glow;
    }

    /**
     * 检查玩家是否靠近
     */
    checkProximity(playerPosition) {
        const dx = playerPosition.x - this.config.position.x;
        const dz = playerPosition.z - this.config.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        const wasNear = this.isPlayerNear;
        this.isPlayerNear = distance < this.interactionRadius;

        // 状态改变时触发事件
        if (!wasNear && this.isPlayerNear) {
            this.onPlayerEnter();
        } else if (wasNear && !this.isPlayerNear) {
            this.onPlayerExit();
        }

        return this.isPlayerNear;
    }

    /**
     * 玩家进入范围
     */
    onPlayerEnter() {
        this.showInfoPanel();
        this.highlight();
    }

    /**
     * 玩家离开范围
     */
    onPlayerExit() {
        this.hideInfoPanel();
        this.unhighlight();
    }

    /**
     * 显示信息面板
     */
    showInfoPanel() {
        // 移除已存在的面板
        if (this.infoPanel) {
            this.infoPanel.remove();
        }

        // 创建信息面板
        this.infoPanel = document.createElement('div');
        this.infoPanel.className = 'exhibit-info-panel';
        this.infoPanel.innerHTML = `
            <div class="exhibit-title">${this.config.name}</div>
            <div class="exhibit-description">${this.config.description}</div>
            <div class="exhibit-hint">按 E 键查看详情</div>
        `;
        document.body.appendChild(this.infoPanel);

        // 添加动画效果
        setTimeout(() => {
            this.infoPanel.classList.add('show');
        }, 10);
    }

    /**
     * 隐藏信息面板
     */
    hideInfoPanel() {
        if (this.infoPanel) {
            this.infoPanel.classList.remove('show');
            setTimeout(() => {
                if (this.infoPanel) {
                    this.infoPanel.remove();
                    this.infoPanel = null;
                }
            }, 300);
        }
    }

    /**
     * 高亮效果
     */
    highlight() {
        // 给玻璃罩添加发光效果
        this.objects.glassParts.forEach(part => {
            if (part.material) {
                part.material.emissiveIntensity = 0.15;
                part.material.emissive = new THREE.Color(0x88aaff);
            }
        });

        // 底座边缘高亮
        this.objects.trim.forEach(trim => {
            if (trim.material) {
                trim.material.emissiveIntensity = 0.2;
            }
        });
    }

    /**
     * 取消高亮
     */
    unhighlight() {
        this.objects.glassParts.forEach(part => {
            if (part.material) {
                part.material.emissiveIntensity = 0;
            }
        });

        this.objects.trim.forEach(trim => {
            if (trim.material) {
                trim.material.emissiveIntensity = 0.1;
            }
        });
    }

    /**
     * 获取展台信息
     */
    getInfo() {
        return {
            name: this.config.name,
            description: this.config.description,
            position: this.config.position
        };
    }

    /**
     * 获取位置
     */
    getPosition() {
        return {
            x: this.config.position.x,
            z: this.config.position.z
        };
    }

    /**
     * 移除展览台
     */
    remove() {
        if (this.objects.base) this.scene.remove(this.objects.base);
        this.objects.glassParts.forEach(part => this.scene.remove(part));
        this.objects.trim.forEach(trim => this.scene.remove(trim));
        if (this.objects.glow) this.scene.remove(this.objects.glow);
        if (this.infoPanel) this.infoPanel.remove();
    }
}

/**
 * 高端展览台管理器
 */
export class HighEndDisplayCaseManager {
    constructor(scene) {
        this.scene = scene;
        this.displayCases = [];
    }

    addDisplayCase(options) {
        const displayCase = new HighEndDisplayCase(this.scene, options);
        displayCase.build();
        this.displayCases.push(displayCase);
        return displayCase;
    }

    addDisplayCases(casesConfig) {
        const cases = [];
        casesConfig.forEach(config => {
            const displayCase = this.addDisplayCase(config);
            cases.push(displayCase);
        });
        return cases;
    }

    getAll() {
        return this.displayCases;
    }

    /**
     * 更新所有展台的靠近检测
     */
    updateProximity(playerPosition) {
        this.displayCases.forEach(displayCase => {
            displayCase.checkProximity(playerPosition);
        });
    }

    removeAll() {
        this.displayCases.forEach(displayCase => displayCase.remove());
        this.displayCases = [];
    }
}