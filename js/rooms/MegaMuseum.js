// js/rooms/MegaMuseum.js
import * as THREE from 'three';
import { MarbleFloor } from '../materials/MarbleFloor.js';
import { ElegantWall } from '../materials/ElegantWall.js';
import { ElegantCeiling } from '../materials/ElegantCeiling.js';

/**
 * 标准博物馆
 */
export class MegaMuseum {
    constructor(scene, options = {}) {
        this.scene = scene;
        
        // 博物馆尺寸
        this.width = options.width || 24;
        this.depth = options.depth || 18;
        this.height = options.height || 6;
        
        // 材质配置
        this.floorType = options.floorType || 'classic';
        this.wallType = options.wallType || 'marble';
        this.ceilingType = options.ceilingType || 'coffered';
        
        // 天花板装饰选项
        this.ceilingOptions = {
            addCrownMolding: options.addCrownMolding !== false,
            addChandelier: options.addChandelier || false,
            addMedallion: options.addMedallion || false,
            castShadow: false  // 新增：控制天花板是否投射阴影
        };
        
        // 墙壁装饰选项
        this.wallDecor = {
            addBaseboard: options.addBaseboard !== false,
            addCrownMolding: options.addCrownMolding !== false,
            addWallPanels: options.addWallPanels || false,
            addWallLights: options.addWallLights || false
        };

        // 地板美缝选项
        this.addGrout = options.addGrout !== false;

        this.floor = null;
        this.walls = null;
        this.ceiling = null;
    }
    
    /**
     * 构建博物馆
     */
    build() {
        this.createFloor();
        this.createWalls();
        this.createCeiling();
        this.createEntrance();
        
        return this;
    }
    
    /**
     * 创建大理石地板
     */
    createFloor() {
        this.floor = new MarbleFloor(this.scene, {
            width: this.width,
            depth: this.depth,
            type: this.floorType,
            tileSize: 1.2,
            addGrout: this.addGrout,
            addReflection: true,
            roughness: 0.25,
            metalness: 0.5
        });
        this.floor.build();
    }
    
    /**
     * 创建高端墙壁
     */
    createWalls() {
        this.walls = new ElegantWall(this.scene, {
            width: this.width,
            depth: this.depth,
            height: this.height,
            type: this.wallType,
            addBaseboard: this.wallDecor.addBaseboard,
            addCrownMolding: this.wallDecor.addCrownMolding,
            addWallPanels: this.wallDecor.addWallPanels,
            addWallLights: this.wallDecor.addWallLights,
            textureScale: 1.5
        });
        this.walls.build();
    }
    
    /**
     * 创建高端天花板（修改：不投射阴影）
     */
    createCeiling() {
        this.ceiling = new ElegantCeiling(this.scene, {
            width: this.width,
            depth: this.depth,
            height: this.height,
            type: this.ceilingType,
            addCrownMolding: this.ceilingOptions.addCrownMolding,
            addChandelier: this.ceilingOptions.addChandelier,
            addMedallion: this.ceilingOptions.addMedallion,
            castShadow: this.ceilingOptions.castShadow  // 传递阴影设置
        });
        this.ceiling.build();
    }
    
    /**
     * 创建入口
     */
    createEntrance() {
        const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0xbc9a6c });
        const doorWidth = 2.5;
        const doorHeight = 3;
        
        const leftPillar = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, doorHeight, 0.2),
            doorFrameMat
        );
        leftPillar.position.set(-1.3, doorHeight / 2, this.depth / 2 + 0.05);
        leftPillar.castShadow = false;  // 门框不投射阴影
        this.scene.add(leftPillar);
        
        const rightPillar = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, doorHeight, 0.2),
            doorFrameMat
        );
        rightPillar.position.set(1.3, doorHeight / 2, this.depth / 2 + 0.05);
        rightPillar.castShadow = false;
        this.scene.add(rightPillar);
        
        const lintel = new THREE.Mesh(
            new THREE.BoxGeometry(doorWidth, 0.2, 0.2),
            doorFrameMat
        );
        lintel.position.set(0, doorHeight, this.depth / 2 + 0.05);
        lintel.castShadow = false;
        this.scene.add(lintel);
    }
}