// js/materials/ElegantWall.js
import * as THREE from 'three';

/**
 * 高端墙壁材质生成器
 * 支持多种优雅的墙面效果
 */
export class ElegantWall {
    constructor(scene, options = {}) {
        this.scene = scene;
        
        // 配置选项
        this.config = {
            // 墙壁尺寸
            width: options.width || 24,
            depth: options.depth || 18,
            height: options.height || 6,
            
            // 墙壁类型
            type: options.type || 'marble',  // marble, plaster, fabric, wood, artdeco, modern
            
            // 颜色方案
            color: options.color || null,
            accentColor: options.accentColor || null,
            
            // 装饰效果
            addBaseboard: options.addBaseboard !== false,
            addCrownMolding: options.addCrownMolding !== false,
            addWallPanels: options.addWallPanels || false,
            addWallLights: options.addWallLights || false,
            
            // 纹理参数
            textureScale: options.textureScale || 2.0,
            roughness: options.roughness || 0.4,
            metalness: options.metalness || 0.1
        };
        
        // 高端墙壁样式配置
        this.wallStyles = {
            marble: {
                name: '卡拉拉大理石',
                primary: 0xf5f0e0,
                secondary: 0xe8e0d0,
                accent: 0xd4c5a0,
                veinColor: 0xbc9a6c,
                roughness: 0.3,
                metalness: 0.15,
                hasVeins: true
            },
            plaster: {
                name: '威尼斯艺术漆',
                primary: 0xe8e0d0,
                secondary: 0xd8d0c0,
                accent: 0xc0b0a0,
                veinColor: 0xb8a890,
                roughness: 0.6,
                metalness: 0.05,
                hasVeins: false
            },
            fabric: {
                name: '丝绒壁布',
                primary: 0x8b5a2b,
                secondary: 0x9b6a3b,
                accent: 0xcd7f32,
                veinColor: 0xad8a5c,
                roughness: 0.5,
                metalness: 0.02,
                hasVeins: false
            },
            wood: {
                name: '胡桃木护墙',
                primary: 0x8b5a2b,
                secondary: 0x7b4a2b,
                accent: 0xcd7f32,
                veinColor: 0x6b3a1b,
                roughness: 0.5,
                metalness: 0.08,
                hasVeins: true
            },
            artdeco: {
                name: '装饰艺术风格',
                primary: 0x4a2a1a,
                secondary: 0x5a3a2a,
                accent: 0xd4af37,
                veinColor: 0xc49a2c,
                roughness: 0.35,
                metalness: 0.25,
                hasVeins: false
            },
            modern: {
                name: '现代极简白',
                primary: 0xfafaf8,
                secondary: 0xf0f0ec,
                accent: 0xe0e0d8,
                veinColor: 0xd0d0c8,
                roughness: 0.45,
                metalness: 0.02,
                hasVeins: false
            }
        };
        
        // 选择样式
        this.style = this.wallStyles[this.config.type] || this.wallStyles.marble;
        
        // 应用自定义颜色
        if (this.config.color) this.style.primary = this.config.color;
        if (this.config.accentColor) this.style.accent = this.config.accentColor;
        
        this.walls = [];
    }
    
    /**
     * 构建所有墙壁
     */
    build() {
        this.createNorthWall();
        this.createSouthWall();
        this.createWestWall();
        this.createEastWall();  // 修复：添加这个方法
        
        return this;
    }
    
    /**
     * 创建带纹理的墙壁材质
     */
    createWallMaterial(isAccent = false) {
        const canvas = this.createWallTexture(isAccent);
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(this.config.textureScale, this.config.textureScale);
        
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            color: isAccent ? this.style.accent : this.style.primary,
            roughness: this.config.roughness || this.style.roughness,
            metalness: this.config.metalness || this.style.metalness,
            emissive: 0x000000
        });
        
        return material;
    }
    
    /**
     * 创建墙壁纹理（Canvas）
     */
    createWallTexture(isAccent = false) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        const baseColor = isAccent ? this.style.accent : this.style.primary;
        
        // 背景色
        ctx.fillStyle = '#' + baseColor.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 根据样式添加纹理
        switch(this.config.type) {
            case 'marble':
                this.drawMarbleTexture(ctx, canvas.width, canvas.height);
                break;
            case 'plaster':
                this.drawPlasterTexture(ctx, canvas.width, canvas.height);
                break;
            case 'fabric':
                this.drawFabricTexture(ctx, canvas.width, canvas.height);
                break;
            case 'wood':
                this.drawWoodTexture(ctx, canvas.width, canvas.height);
                break;
            case 'artdeco':
                this.drawArtDecoTexture(ctx, canvas.width, canvas.height);
                break;
            default:
                this.drawModernTexture(ctx, canvas.width, canvas.height);
        }
        
        return canvas;
    }
    
    /**
     * 大理石纹理
     */
    drawMarbleTexture(ctx, width, height) {
        const veinColor = '#' + this.style.veinColor.toString(16).padStart(6, '0');
        
        for (let i = 0; i < 300; i++) {
            ctx.beginPath();
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            
            ctx.moveTo(startX, startY);
            
            let x = startX;
            let y = startY;
            
            for (let j = 0; j < 40; j++) {
                x += (Math.random() - 0.5) * 35;
                y += (Math.random() - 0.5) * 35;
                ctx.lineTo(x, y);
            }
            
            ctx.strokeStyle = veinColor;
            ctx.lineWidth = 2 + Math.random() * 5;
            ctx.globalAlpha = 0.2 + Math.random() * 0.3;
            ctx.stroke();
        }
        
        for (let i = 0; i < 1500; i++) {
            ctx.fillStyle = veinColor;
            ctx.globalAlpha = 0.1 + Math.random() * 0.2;
            ctx.beginPath();
            ctx.arc(
                Math.random() * width,
                Math.random() * height,
                1 + Math.random() * 3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    /**
     * 艺术漆纹理
     */
    drawPlasterTexture(ctx, width, height) {
        for (let i = 0; i < 5000; i++) {
            const gray = 80 + Math.random() * 40;
            ctx.fillStyle = `rgba(${gray}, ${gray - 20}, ${gray - 30}, ${0.1 + Math.random() * 0.2})`;
            ctx.beginPath();
            ctx.arc(
                Math.random() * width,
                Math.random() * height,
                3 + Math.random() * 15,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        for (let i = 0; i < 800; i++) {
            ctx.beginPath();
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.moveTo(x, y);
            ctx.lineTo(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 30);
            ctx.strokeStyle = `rgba(100, 80, 60, 0.15)`;
            ctx.lineWidth = 2 + Math.random() * 8;
            ctx.stroke();
        }
    }
    
    /**
     * 丝绒纹理
     */
    drawFabricTexture(ctx, width, height) {
        const cellSize = 25;
        
        for (let i = 0; i < width / cellSize; i++) {
            for (let j = 0; j < height / cellSize; j++) {
                ctx.fillStyle = `rgba(0, 0, 0, ${0.03 + Math.random() * 0.05})`;
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                
                ctx.beginPath();
                ctx.moveTo(i * cellSize, j * cellSize + cellSize / 2);
                ctx.lineTo((i + 1) * cellSize, j * cellSize + cellSize / 2);
                ctx.strokeStyle = `rgba(80, 60, 40, 0.1)`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(i * cellSize + cellSize / 2, j * cellSize);
                ctx.lineTo(i * cellSize + cellSize / 2, (j + 1) * cellSize);
                ctx.stroke();
            }
        }
    }
    
    /**
     * 木纹纹理
     */
    drawWoodTexture(ctx, width, height) {
        const lineCount = 80;
        
        for (let i = 0; i < lineCount; i++) {
            ctx.beginPath();
            const y = (i / lineCount) * height;
            ctx.moveTo(0, y);
            
            for (let x = 0; x < width; x += 20) {
                const offset = Math.sin(x * 0.02 + i) * 8;
                ctx.lineTo(x, y + offset);
            }
            
            ctx.strokeStyle = `rgba(50, 30, 20, ${0.1 + Math.random() * 0.15})`;
            ctx.lineWidth = 1 + Math.random() * 2;
            ctx.stroke();
        }
        
        for (let i = 0; i < 80; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * width,
                Math.random() * height,
                5 + Math.random() * 12,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(70, 40, 20, 0.2)`;
            ctx.fill();
        }
    }
    
    /**
     * 装饰艺术纹理
     */
    drawArtDecoTexture(ctx, width, height) {
        const patternSize = 60;
        
        for (let i = 0; i < width / patternSize; i++) {
            for (let j = 0; j < height / patternSize; j++) {
                const x = i * patternSize;
                const y = j * patternSize;
                
                ctx.beginPath();
                ctx.moveTo(x + patternSize / 2, y);
                ctx.lineTo(x + patternSize, y + patternSize / 3);
                ctx.lineTo(x + patternSize, y + patternSize * 2 / 3);
                ctx.lineTo(x + patternSize / 2, y + patternSize);
                ctx.lineTo(x, y + patternSize * 2 / 3);
                ctx.lineTo(x, y + patternSize / 3);
                ctx.closePath();
                
                ctx.fillStyle = `rgba(200, 180, 100, 0.1)`;
                ctx.fill();
                ctx.strokeStyle = `rgba(200, 180, 100, 0.3)`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
    }
    
    /**
     * 现代纹理
     */
    drawModernTexture(ctx, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.02)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        for (let i = 0; i < 3000; i++) {
            ctx.fillStyle = `rgba(0, 0, 0, ${0.01 + Math.random() * 0.03})`;
            ctx.fillRect(
                Math.random() * width,
                Math.random() * height,
                1,
                1
            );
        }
    }
    
    /**
     * 创建北墙
     */
    createNorthWall() {
        const material = this.createWallMaterial();
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(this.config.width, this.config.height, 0.3),
            material
        );
        wall.position.set(0, this.config.height / 2, -this.config.depth / 2);
        wall.receiveShadow = true;
        this.scene.add(wall);
        this.walls.push(wall);
        
        if (this.config.addBaseboard) this.addBaseboard(0, -this.config.depth / 2);
        if (this.config.addCrownMolding) this.addCrownMolding(0, -this.config.depth / 2);
        if (this.config.addWallPanels) this.addWallPanels(0, -this.config.depth / 2);
        if (this.config.addWallLights) this.addWallLights(0, -this.config.depth / 2);
    }
    
    /**
     * 创建南墙
     */
    createSouthWall() {
        const material = this.createWallMaterial();
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(this.config.width, this.config.height, 0.3),
            material
        );
        wall.position.set(0, this.config.height / 2, this.config.depth / 2);
        wall.receiveShadow = true;
        this.scene.add(wall);
        this.walls.push(wall);
        
        if (this.config.addBaseboard) this.addBaseboard(0, this.config.depth / 2);
        if (this.config.addCrownMolding) this.addCrownMolding(0, this.config.depth / 2);
        if (this.config.addWallPanels) this.addWallPanels(0, this.config.depth / 2);
        if (this.config.addWallLights) this.addWallLights(0, this.config.depth / 2);
    }
    
    /**
     * 创建西墙
     */
    createWestWall() {
        const material = this.createWallMaterial();
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, this.config.height, this.config.depth),
            material
        );
        wall.position.set(-this.config.width / 2, this.config.height / 2, 0);
        wall.receiveShadow = true;
        this.scene.add(wall);
        this.walls.push(wall);
        
        if (this.config.addBaseboard) this.addBaseboard(-this.config.width / 2, 0, true);
        if (this.config.addCrownMolding) this.addCrownMolding(-this.config.width / 2, 0, true);
        if (this.config.addWallPanels) this.addWallPanels(-this.config.width / 2, 0, true);
        if (this.config.addWallLights) this.addWallLights(-this.config.width / 2, 0, true);
    }
    
    /**
     * 创建东墙（修复：添加这个方法）
     */
    createEastWall() {
        const material = this.createWallMaterial();
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, this.config.height, this.config.depth),
            material
        );
        wall.position.set(this.config.width / 2, this.config.height / 2, 0);
        wall.receiveShadow = true;
        this.scene.add(wall);
        this.walls.push(wall);
        
        if (this.config.addBaseboard) this.addBaseboard(this.config.width / 2, 0, true);
        if (this.config.addCrownMolding) this.addCrownMolding(this.config.width / 2, 0, true);
        if (this.config.addWallPanels) this.addWallPanels(this.config.width / 2, 0, true);
        if (this.config.addWallLights) this.addWallLights(this.config.width / 2, 0, true);
    }
    
    /**
     * 添加踢脚线
     */
    addBaseboard(x, z, isSideWall = false) {
        const baseboardMat = new THREE.MeshStandardMaterial({
            color: 0xbc9a6c,
            metalness: 0.3,
            roughness: 0.4
        });
        
        let baseboard;
        if (isSideWall) {
            baseboard = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.12, this.config.depth - 0.4),
                baseboardMat
            );
            baseboard.position.set(x, 0.06, z);
        } else {
            baseboard = new THREE.Mesh(
                new THREE.BoxGeometry(this.config.width - 0.4, 0.12, 0.3),
                baseboardMat
            );
            baseboard.position.set(x, 0.06, z);
        }
        baseboard.receiveShadow = true;
        this.scene.add(baseboard);
    }
    
    /**
     * 添加顶角线
     */
    addCrownMolding(x, z, isSideWall = false) {
        const moldingMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.7,
            roughness: 0.2
        });
        
        let molding;
        if (isSideWall) {
            molding = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.15, this.config.depth - 0.4),
                moldingMat
            );
            molding.position.set(x, this.config.height - 0.08, z);
        } else {
            molding = new THREE.Mesh(
                new THREE.BoxGeometry(this.config.width - 0.4, 0.15, 0.3),
                moldingMat
            );
            molding.position.set(x, this.config.height - 0.08, z);
        }
        molding.castShadow = true;
        this.scene.add(molding);
    }
    
    /**
     * 添加墙板装饰
     */
    addWallPanels(x, z, isSideWall = false) {
        const panelMat = new THREE.MeshStandardMaterial({
            color: this.style.accent,
            metalness: 0.15,
            roughness: 0.5
        });
        
        const panelHeight = 1.2;
        const panelWidth = 1.0;
        const startY = 0.3;
        
        let count = isSideWall ? Math.floor(this.config.depth / panelWidth) : Math.floor(this.config.width / panelWidth);
        count = Math.min(count, 8);
        
        for (let i = 0; i < count; i++) {
            let panelX, panelZ;
            if (isSideWall) {
                panelX = x;
                panelZ = -this.config.depth / 2 + (i + 0.5) * (this.config.depth / count);
            } else {
                panelX = -this.config.width / 2 + (i + 0.5) * (this.config.width / count);
                panelZ = z;
            }
            
            const panel = new THREE.Mesh(
                new THREE.BoxGeometry(panelWidth - 0.1, panelHeight, 0.05),
                panelMat
            );
            panel.position.set(panelX, startY + panelHeight / 2, panelZ + (isSideWall ? 0.16 : 0.16));
            panel.castShadow = true;
            this.scene.add(panel);
        }
    }
    
    /**
     * 添加壁灯
     */
    addWallLights(x, z, isSideWall = false) {
        const lampMat = new THREE.MeshStandardMaterial({
            color: 0xffaa66,
            emissive: 0xff6600,
            emissiveIntensity: 0.2,
            metalness: 0.8
        });
        
        const positions = [1.8, 3.2, 4.6];
        
        positions.forEach(y => {
            const lamp = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 16, 16),
                lampMat
            );
            
            if (isSideWall) {
                lamp.position.set(x, y, z);
            } else {
                lamp.position.set(x, y, z);
            }
            lamp.castShadow = true;
            this.scene.add(lamp);
            
            const light = new THREE.PointLight(0xffaa66, 0.25, 4);
            light.position.set(x, y, z);
            this.scene.add(light);
        });
    }
    
    /**
     * 获取所有墙壁
     */
    getWalls() {
        return this.walls;
    }
}