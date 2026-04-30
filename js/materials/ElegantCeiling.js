// js/materials/ElegantCeiling.js
import * as THREE from 'three';

/**
 * 高端天花板材质生成器
 * 支持多种优雅的天花板效果
 */
export class ElegantCeiling {
    constructor(scene, options = {}) {
        this.scene = scene;
        
        // 配置选项
        this.config = {
            // 天花板尺寸
            width: options.width || 24,
            depth: options.depth || 18,
            height: options.height || 6,
            
            // 天花板类型
            type: options.type || 'coffered',  // coffered, tray, plaster, modern, goldAccent, starry
            
            // 颜色方案
            primaryColor: options.primaryColor || 0xf5f0e0,
            accentColor: options.accentColor || 0xd4af37,
            
            // 装饰选项
            addCrownMolding: options.addCrownMolding !== false,
            addChandelier: options.addChandelier || false,
            addMedallion: options.addMedallion || false,
            
            // 纹理参数
            roughness: options.roughness || 0.4,
            metalness: options.metalness || 0.1
        };
        
        // 天花板样式配置
        this.ceilingStyles = {
            // 藻井天花板（古典豪华）
            coffered: {
                name: '藻井天花板',
                primary: 0xe8e0c8,
                accent: 0xd4af37,
                hasGrid: true,
                gridSize: 1.5,
                hasRoses: true
            },
            // 阶梯式天花板（优雅）
            tray: {
                name: '阶梯式天花板',
                primary: 0xf0e8d8,
                accent: 0xc9b28b,
                hasLayers: true,
                layerCount: 3
            },
            // 石膏天花（简约）
            plaster: {
                name: '石膏天花',
                primary: 0xfaf8f0,
                accent: 0xe0d8c8,
                hasTexture: true
            },
            // 现代极简
            modern: {
                name: '现代极简',
                primary: 0xffffff,
                accent: 0xdddddd,
                hasPanels: true,
                panelSize: 2.0
            },
            // 金色装饰
            goldAccent: {
                name: '金色装饰',
                primary: 0xf5f0e0,
                accent: 0xd4af37,
                hasGoldTrim: true
            },
            // 星空穹顶
            starry: {
                name: '星空穹顶',
                primary: 0x0a0a2a,
                accent: 0xffaa66,
                hasStars: true
            },
            // 现代深色
            modernDark: {
                name: '现代深色天花',
                primary: 0x1e1e1e,
                accent: 0x2a2a2a,
                hasPanels: true,
                panelSize: 2.0
            }
        };
        
        // 选择样式
        this.style = this.ceilingStyles[this.config.type] || this.ceilingStyles.coffered;
        
        this.ceilingGroup = null;
        this.lights = [];
    }
    
    /**
     * 构建天花板
     */
    build() {
        this.ceilingGroup = new THREE.Group();
        
        switch(this.config.type) {
            case 'coffered':
                this.createCofferedCeiling();
                break;
            case 'tray':
                this.createTrayCeiling();
                break;
            case 'plaster':
                this.createPlasterCeiling();
                break;
            case 'modern':
                this.createModernCeiling();
                break;
            case 'goldAccent':
                this.createGoldAccentCeiling();
                break;
            case 'starry':
                this.createStarryCeiling();
                break;
            case 'modernDark':
                this.createModernDarkCeiling();
                break;
            default:
                this.createCofferedCeiling();
        }
        
        // 添加顶角线
        if (this.config.addCrownMolding) {
            this.addCrownMolding();
        }
        
        // 添加吊灯
        if (this.config.addChandelier) {
            this.addChandelier();
        }
        
        // 添加装饰花盘
        if (this.config.addMedallion) {
            this.addMedallion();
        }
        
        this.scene.add(this.ceilingGroup);
        return this;
    }
    
    /**
     * 藻井天花板（古典豪华风格）
     */
    createCofferedCeiling() {
        const gridSize = this.style.gridSize || 1.5;
        const gridCountX = Math.floor(this.config.width / gridSize);
        const gridCountZ = Math.floor(this.config.depth / gridSize);
        
        const startX = -this.config.width / 2;
        const startZ = -this.config.depth / 2;
        
        // 主面板材质
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: this.style.primary,
            roughness: this.config.roughness,
            metalness: this.config.metalness
        });
        
        // 格栅材质（深色）
        const beamMaterial = new THREE.MeshStandardMaterial({
            color: this.style.accent,
            roughness: 0.3,
            metalness: 0.6
        });
        
        // 创建每个藻井格子
        for (let i = 0; i <= gridCountX; i++) {
            for (let j = 0; j <= gridCountZ; j++) {
                const x = startX + i * gridSize;
                const z = startZ + j * gridSize;
                
                // 主面板
                const panel = new THREE.Mesh(
                    new THREE.BoxGeometry(gridSize - 0.1, 0.05, gridSize - 0.1),
                    panelMaterial
                );
                panel.position.set(x, this.config.height - 0.05, z);
                panel.receiveShadow = true;
                this.ceilingGroup.add(panel);
                
                // 装饰线条（如果添加）
                if (this.style.hasRoses && (i + j) % 3 === 0) {
                    const rosetteMat = new THREE.MeshStandardMaterial({
                        color: this.style.accent,
                        metalness: 0.7,
                        roughness: 0.2
                    });
                    const rosette = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.2, 0.22, 0.03, 16),
                        rosetteMat
                    );
                    rosette.position.set(x, this.config.height - 0.03, z);
                    rosette.castShadow = true;
                    this.ceilingGroup.add(rosette);
                }
            }
        }
        
        // 添加横梁
        for (let i = 0; i <= gridCountX; i++) {
            const beam = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.12, this.config.depth),
                beamMaterial
            );
            beam.position.set(startX + i * gridSize, this.config.height - 0.06, 0);
            beam.castShadow = true;
            this.ceilingGroup.add(beam);
        }
        
        for (let j = 0; j <= gridCountZ; j++) {
            const beam = new THREE.Mesh(
                new THREE.BoxGeometry(this.config.width, 0.12, 0.08),
                beamMaterial
            );
            beam.position.set(0, this.config.height - 0.06, startZ + j * gridSize);
            beam.castShadow = true;
            this.ceilingGroup.add(beam);
        }
    }
    
    /**
     * 阶梯式天花板
     */
    createTrayCeiling() {
        const layers = this.style.layerCount || 3;
        const stepHeight = 0.15;
        const startY = this.config.height - 0.2;
        
        for (let i = 0; i < layers; i++) {
            const scale = 1 - (i + 1) * 0.15;
            const width = this.config.width * scale;
            const depth = this.config.depth * scale;
            const y = startY - i * stepHeight;
            
            const layerMat = new THREE.MeshStandardMaterial({
                color: i === layers - 1 ? this.style.accent : this.style.primary,
                roughness: this.config.roughness - i * 0.05,
                metalness: this.config.metalness + i * 0.1
            });
            
            const layer = new THREE.Mesh(
                new THREE.BoxGeometry(width, 0.08, depth),
                layerMat
            );
            layer.position.set(0, y, 0);
            layer.castShadow = false;
            this.ceilingGroup.add(layer);
            
            // 添加装饰边
            if (i < layers - 1) {
                const trimMat = new THREE.MeshStandardMaterial({
                    color: this.style.accent,
                    metalness: 0.8,
                    roughness: 0.2
                });
                const trim = new THREE.Mesh(
                    new THREE.BoxGeometry(width + 0.1, 0.05, depth + 0.1),
                    trimMat
                );
                trim.position.set(0, y - 0.05, 0);
                trim.castShadow = false;
                this.ceilingGroup.add(trim);
            }
        }
    }
    
    /**
     * 石膏天花板（带纹理）
     */
    createPlasterCeiling() {
        const canvas = this.createPlasterTexture();
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        
        const ceilingMat = new THREE.MeshStandardMaterial({
            map: texture,
            color: this.style.primary,
            roughness: this.config.roughness,
            metalness: this.config.metalness
        });
        
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.config.width, this.config.depth),
            ceilingMat
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(0, this.config.height - 0.05, 0);
        ceiling.receiveShadow = true;
        this.ceilingGroup.add(ceiling);
    }
    
    /**
     * 现代简约天花板
     */
    createModernCeiling() {
        const ceilingMat = new THREE.MeshStandardMaterial({
            color: this.style.primary,
            roughness: 0.5,
            metalness: 0.05
        });

        const ceiling = new THREE.Mesh(
            new THREE.BoxGeometry(this.config.width - 0.2, 0.1, this.config.depth - 0.2),
            ceilingMat
        );
        ceiling.position.set(0, this.config.height - 0.05, 0);
        ceiling.receiveShadow = true;
        this.ceilingGroup.add(ceiling);

        // 添加两侧小灯泡
        this.addCeilingSpotlights();
    }
    
    /**
     * 金色装饰天花板
     */
    createGoldAccentCeiling() {
        // 主面板
        const mainMat = new THREE.MeshStandardMaterial({
            color: this.style.primary,
            roughness: 0.4,
            metalness: 0.2
        });
        
        const ceiling = new THREE.Mesh(
            new THREE.BoxGeometry(this.config.width - 0.2, 0.1, this.config.depth - 0.2),
            mainMat
        );
        ceiling.position.set(0, this.config.height - 0.05, 0);
        ceiling.receiveShadow = true;
        this.ceilingGroup.add(ceiling);
        
        // 金色装饰条
        const goldMat = new THREE.MeshStandardMaterial({
            color: this.style.accent,
            metalness: 0.9,
            roughness: 0.2
        });
        
        // 四周金色边框
        const borderWidth = 0.15;
        const borderDepth = 0.15;
        
        const borders = [
            { x: 0, z: -this.config.depth / 2 + borderDepth/2, width: this.config.width, depth: borderDepth },
            { x: 0, z: this.config.depth / 2 - borderDepth/2, width: this.config.width, depth: borderDepth },
            { x: -this.config.width / 2 + borderWidth/2, z: 0, width: borderWidth, depth: this.config.depth },
            { x: this.config.width / 2 - borderWidth/2, z: 0, width: borderWidth, depth: this.config.depth }
        ];
        
        borders.forEach(border => {
            const trim = new THREE.Mesh(
                new THREE.BoxGeometry(border.width, 0.08, border.depth),
                goldMat
            );
            trim.position.set(border.x, this.config.height - 0.03, border.z);
            trim.castShadow = true;
            this.ceilingGroup.add(trim);
        });
        
        // 中心装饰
        const centerMedallion = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 0.9, 0.05, 32),
            goldMat
        );
        centerMedallion.position.set(0, this.config.height - 0.03, 0);
        centerMedallion.castShadow = true;
        this.ceilingGroup.add(centerMedallion);
    }
    
    /**
     * 星空穹顶
     */
    createStarryCeiling() {
        // 深色背景
        const starMat = new THREE.MeshStandardMaterial({
            color: this.style.primary,
            roughness: 0.2,
            metalness: 0.05,
            emissive: 0x112233,
            emissiveIntensity: 0.2
        });
        
        const ceiling = new THREE.Mesh(
            new THREE.BoxGeometry(this.config.width - 0.2, 0.1, this.config.depth - 0.2),
            starMat
        );
        ceiling.position.set(0, this.config.height - 0.05, 0);
        ceiling.receiveShadow = true;
        this.ceilingGroup.add(ceiling);
        
        // 创建星星
        const starMaterial = new THREE.PointsMaterial({
            color: this.style.accent,
            size: 0.08,
            transparent: true,
            opacity: 0.8
        });
        
        const starCount = 800;
        const starsGeometry = new THREE.BufferGeometry();
        const starsPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            starsPositions[i*3] = (Math.random() - 0.5) * (this.config.width - 1);
            starsPositions[i*3+1] = this.config.height - 0.03;
            starsPositions[i*3+2] = (Math.random() - 0.5) * (this.config.depth - 1);
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
        const stars = new THREE.Points(starsGeometry, starMaterial);
        this.ceilingGroup.add(stars);
        
        // 添加一些大星星
        const bigStarMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa66,
            emissive: 0xff6600,
            emissiveIntensity: 0.3
        });
        
        for (let i = 0; i < 50; i++) {
            const bigStar = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 8, 8),
                bigStarMaterial
            );
            bigStar.position.set(
                (Math.random() - 0.5) * (this.config.width - 1),
                this.config.height - 0.02,
                (Math.random() - 0.5) * (this.config.depth - 1)
            );
            this.ceilingGroup.add(bigStar);
        }
    }
    
    /**
     * 现代深色天花板（两侧小灯泡）
     */
    createModernDarkCeiling() {
        const ceilingMat = new THREE.MeshStandardMaterial({
            color: this.style.primary,
            roughness: 0.7,
            metalness: 0.05
        });

        const ceiling = new THREE.Mesh(
            new THREE.BoxGeometry(this.config.width - 0.2, 0.1, this.config.depth - 0.2),
            ceilingMat
        );
        ceiling.position.set(0, this.config.height - 0.05, 0);
        ceiling.receiveShadow = true;
        this.ceilingGroup.add(ceiling);

        // 添加两侧小灯泡
        this.addCeilingSpotlights();
    }

    /**
     * 天花板两侧小灯泡
     */
    addCeilingSpotlights() {
        const bulbMat = new THREE.MeshStandardMaterial({
            color: 0xfff5e6,
            emissive: 0xffddaa,
            emissiveIntensity: 1.5,
            metalness: 0.1,
            roughness: 0.1
        });

        const spacing = Math.max(this.config.width / 6, 3);
        const countX = Math.max(Math.floor(this.config.width / spacing), 3);

        for (let i = 0; i <= countX; i++) {
            const x = -this.config.width / 2 + i * spacing;

            // 北侧一排灯泡
            const bulbN = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), bulbMat);
            bulbN.position.set(x, this.config.height - 0.08, -this.config.depth / 2 + 0.6);
            this.ceilingGroup.add(bulbN);

            const lightN = new THREE.PointLight(0xfff5e6, 0.8, 12);
            lightN.position.set(x, this.config.height - 0.3, -this.config.depth / 2 + 0.6);
            this.ceilingGroup.add(lightN);

            // 南侧一排灯泡
            const bulbS = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), bulbMat);
            bulbS.position.set(x, this.config.height - 0.08, this.config.depth / 2 - 0.6);
            this.ceilingGroup.add(bulbS);

            const lightS = new THREE.PointLight(0xfff5e6, 0.8, 12);
            lightS.position.set(x, this.config.height - 0.3, this.config.depth / 2 - 0.6);
            this.ceilingGroup.add(lightS);
        }
    }

    /**
     * 创建石膏纹理
     */
    createPlasterTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#' + this.style.primary.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加微妙的纹理
        for (let i = 0; i < 3000; i++) {
            ctx.fillStyle = `rgba(100, 80, 60, ${0.02 + Math.random() * 0.05})`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                2,
                2
            );
        }
        
        // 添加细腻的线条
        for (let i = 0; i < 500; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            ctx.strokeStyle = `rgba(80, 60, 40, 0.08)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        return canvas;
    }
    
    /**
     * 添加顶角线
     */
    addCrownMolding() {
        const moldingMat = new THREE.MeshStandardMaterial({
            color: this.style.accent,
            metalness: 0.6,
            roughness: 0.3
        });
        
        // 四周边线
        const edges = [
            { x: 0, z: -this.config.depth / 2, width: this.config.width, depth: 0.2, rotation: 0 },
            { x: 0, z: this.config.depth / 2, width: this.config.width, depth: 0.2, rotation: 0 },
            { x: -this.config.width / 2, z: 0, width: 0.2, depth: this.config.depth, rotation: 0 },
            { x: this.config.width / 2, z: 0, width: 0.2, depth: this.config.depth, rotation: 0 }
        ];
        
        edges.forEach(edge => {
            const molding = new THREE.Mesh(
                new THREE.BoxGeometry(edge.width, 0.12, edge.depth),
                moldingMat
            );
            molding.position.set(edge.x, this.config.height - 0.06, edge.z);
            molding.castShadow = true;
            this.ceilingGroup.add(molding);
        });
        
        // 添加45度角装饰
        const cornerMat = new THREE.MeshStandardMaterial({
            color: this.style.accent,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const corners = [
            [-this.config.width / 2, -this.config.depth / 2],
            [this.config.width / 2, -this.config.depth / 2],
            [-this.config.width / 2, this.config.depth / 2],
            [this.config.width / 2, this.config.depth / 2]
        ];
        
        corners.forEach(corner => {
            const cornerPiece = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                cornerMat
            );
            cornerPiece.position.set(corner[0], this.config.height - 0.06, corner[1]);
            cornerPiece.castShadow = true;
            this.ceilingGroup.add(cornerPiece);
        });
    }
    
    /**
     * 添加吊灯
     */
    addChandelier() {
        const chandelierGroup = new THREE.Group();
        
        // 吊链
        const chainMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.9,
            roughness: 0.2
        });
        
        for (let i = 0; i < 3; i++) {
            const link = new THREE.Mesh(
                new THREE.TorusGeometry(0.08, 0.03, 8, 16),
                chainMat
            );
            link.position.set(0, this.config.height - 0.5 - i * 0.15, 0);
            link.rotation.x = Math.PI / 2;
            chandelierGroup.add(link);
        }
        
        // 灯体
        const lampBody = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0xffaa66,
                emissive: 0xff6600,
                emissiveIntensity: 0.4,
                metalness: 0.8
            })
        );
        lampBody.position.set(0, this.config.height - 1.0, 0);
        chandelierGroup.add(lampBody);
        
        // 灯臂
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const arm = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8),
                chainMat
            );
            arm.position.set(Math.cos(angle) * 0.5, this.config.height - 0.85, Math.sin(angle) * 0.5);
            arm.rotation.z = angle;
            chandelierGroup.add(arm);
            
            const bulb = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 16, 16),
                new THREE.MeshStandardMaterial({
                    color: 0xffdd99,
                    emissive: 0xffaa66,
                    emissiveIntensity: 0.5
                })
            );
            bulb.position.set(Math.cos(angle) * 0.85, this.config.height - 0.85, Math.sin(angle) * 0.85);
            chandelierGroup.add(bulb);
        }
        
        this.ceilingGroup.add(chandelierGroup);
        this.lights.push(chandelierGroup);
    }
    
    /**
     * 添加装饰花盘
     */
    addMedallion() {
        const medallionMat = new THREE.MeshStandardMaterial({
            color: this.style.accent,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const medallion = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.7, 0.05, 32),
            medallionMat
        );
        medallion.position.set(0, this.config.height - 0.03, 0);
        medallion.castShadow = true;
        this.ceilingGroup.add(medallion);
        
        // 添加纹路
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const detail = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 8),
                medallionMat
            );
            detail.position.set(Math.cos(angle) * 0.45, this.config.height - 0.01, Math.sin(angle) * 0.45);
            this.ceilingGroup.add(detail);
        }
    }
    
    /**
     * 获取天花板高度
     */
    getCeilingHeight() {
        return this.config.height;
    }
    
    /**
     * 获取所有光源
     */
    getLights() {
        return this.lights;
    }
}