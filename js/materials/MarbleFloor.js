// js/materials/MarbleFloor.js
import * as THREE from 'three';

/**
 * 大理石地板生成器
 * 支持多种大理石纹理效果
 */
export class MarbleFloor {
    constructor(scene, options = {}) {
        this.scene = scene;
        
        // 配置选项
        this.config = {
            // 地板尺寸
            width: options.width || 24,
            depth: options.depth || 18,
            
            // 大理石类型
            type: options.type || 'classic',  // classic, white, dark, green, gold
            
            // 瓷砖大小
            tileSize: options.tileSize || 1.0,
            
            // 是否添加网格线（美缝）
            addGrout: options.addGrout !== false,
            groutColor: options.groutColor || 0xaa9977,
            groutWidth: options.groutWidth || 0.05,
            
            // 是否添加反射效果
            addReflection: options.addReflection !== false,
            
            // 光泽度
            roughness: options.roughness || 0.3,
            metalness: options.metalness || 0.4
        };
        
        // 大理石颜色方案
        this.marbleColors = {
            // 经典米黄大理石
            classic: {
                primary: 0xe8ddb0,
                secondary: 0xd4c5a0,
                veins: 0xbc9a6c,
                grout: 0xaa9977
            },
            // 白色卡拉拉大理石
            white: {
                primary: 0xf8f8f8,
                secondary: 0xe8e8e8,
                veins: 0xcccccc,
                grout: 0xdddddd
            },
            // 深色大理石
            dark: {
                primary: 0x4a4a4a,
                secondary: 0x5a5a5a,
                veins: 0x6a6a6a,
                grout: 0x3a3a3a
            },
            // 绿色大理石
            green: {
                primary: 0x8ba88b,
                secondary: 0x7a977a,
                veins: 0x5a775a,
                grout: 0x6a866a
            },
            // 金色大理石
            gold: {
                primary: 0xd4af37,
                secondary: 0xc4a027,
                veins: 0xb48c17,
                grout: 0xbc9a2a
            }
        };
        
        // 选择颜色方案
        this.colors = this.marbleColors[this.config.type] || this.marbleColors.classic;
        
        this.floorGroup = null;
    }
    
    /**
     * 构建地板
     */
    build() {
        this.floorGroup = new THREE.Group();
        
        if (this.config.addReflection) {
            this.createReflectiveFloor();
        } else {
            this.createTiledFloor();
        }
        
        // 添加网格线（美缝）
        if (this.config.addGrout) {
            this.createGroutLines();
        }
        
        this.scene.add(this.floorGroup);
        return this;
    }
    
    /**
     * 创建瓷砖地板
     */
    createTiledFloor() {
        const tileCountX = Math.ceil(this.config.width / this.config.tileSize);
        const tileCountZ = Math.ceil(this.config.depth / this.config.tileSize);
        
        const startX = -this.config.width / 2;
        const startZ = -this.config.depth / 2;
        
        for (let i = 0; i < tileCountX; i++) {
            for (let j = 0; j < tileCountZ; j++) {
                // 交替颜色
                const isAlternate = (i + j) % 2 === 0;
                const color = isAlternate ? this.colors.primary : this.colors.secondary;
                
                const tileMaterial = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: this.config.roughness,
                    metalness: this.config.metalness,
                    emissive: 0x000000
                });
                
                const tile = new THREE.Mesh(
                    new THREE.BoxGeometry(this.config.tileSize - this.config.groutWidth, 0.1, this.config.tileSize - this.config.groutWidth),
                    tileMaterial
                );
                
                tile.position.set(
                    startX + i * this.config.tileSize + this.config.tileSize / 2,
                    0,
                    startZ + j * this.config.tileSize + this.config.tileSize / 2
                );
                tile.castShadow = false;
                tile.receiveShadow = true;
                
                this.floorGroup.add(tile);
            }
        }
    }
    
    /**
     * 创建反射地板（单块大面积）
     */
    createReflectiveFloor() {
        // 创建带纹理的地板
        const canvas = this.createMarbleTexture();
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(this.config.width / 2, this.config.depth / 2);
        
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            color: this.colors.primary,
            roughness: this.config.roughness * 0.5,
            metalness: this.config.metalness + 0.3,
            emissive: 0x000000
        });
        
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(this.config.width, this.config.depth),
            floorMaterial
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        
        this.floorGroup.add(floor);
    }
    
    /**
     * 创建大理石纹理（Canvas）
     */
    createMarbleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // 背景色
        ctx.fillStyle = '#' + this.colors.primary.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制大理石纹路
        const veinColor = '#' + this.colors.veins.toString(16).padStart(6, '0');
        
        for (let i = 0; i < 200; i++) {
            ctx.beginPath();
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * canvas.height;
            
            ctx.moveTo(startX, startY);
            
            let x = startX;
            let y = startY;
            
            for (let j = 0; j < 30; j++) {
                x += (Math.random() - 0.5) * 30;
                y += (Math.random() - 0.5) * 30;
                ctx.lineTo(x, y);
            }
            
            ctx.strokeStyle = veinColor;
            ctx.lineWidth = 2 + Math.random() * 4;
            ctx.globalAlpha = 0.3 + Math.random() * 0.4;
            ctx.stroke();
        }
        
        // 添加小斑点
        for (let i = 0; i < 800; i++) {
            ctx.fillStyle = veinColor;
            ctx.globalAlpha = 0.2 + Math.random() * 0.3;
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1 + Math.random() * 3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        return canvas;
    }
    
    /**
     * 创建网格线（美缝效果）
     */
    createGroutLines() {
        const groutMaterial = new THREE.MeshStandardMaterial({
            color: this.config.groutColor,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const tileCountX = Math.ceil(this.config.width / this.config.tileSize);
        const tileCountZ = Math.ceil(this.config.depth / this.config.tileSize);
        
        const startX = -this.config.width / 2;
        const startZ = -this.config.depth / 2;
        
        // 横向网格线
        for (let i = 0; i <= tileCountX; i++) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(this.config.groutWidth, 0.02, this.config.depth),
                groutMaterial
            );
            line.position.set(startX + i * this.config.tileSize, 0.06, 0);
            line.receiveShadow = true;
            this.floorGroup.add(line);
        }
        
        // 纵向网格线
        for (let j = 0; j <= tileCountZ; j++) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(this.config.width, 0.02, this.config.groutWidth),
                groutMaterial
            );
            line.position.set(0, 0.06, startZ + j * this.config.tileSize);
            line.receiveShadow = true;
            this.floorGroup.add(line);
        }
    }
    
    /**
     * 更新地板类型
     */
    setType(type) {
        if (this.marbleColors[type]) {
            this.config.type = type;
            this.colors = this.marbleColors[type];
            this.config.groutColor = this.colors.grout;
            this.refresh();
        }
    }
    
    /**
     * 刷新地板
     */
    refresh() {
        if (this.floorGroup) {
            this.scene.remove(this.floorGroup);
        }
        this.build();
    }
}