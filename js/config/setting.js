// 全局配置文件
export const settings = {
    // 场景配置
    scene: {
        background: 0x0a0a2a,
        fogDensity: 0.008
    },
    
    // 房间配置
    room: {
        width: 10,
        depth: 10,
        height: 3.5
    },
    
    // 相机配置
    camera: {
        fov: 45,
        near: 0.1,
        far: 1000,
        position: { x: 4, y: 2, z: 4 },
        target: { x: 0, y: 1.5, z: 0 }
    },
    
    // 控制器配置
    controls: {
        enableDamping: true,
        dampingFactor: 0.05,
        zoomSpeed: 1.2,
        rotateSpeed: 1.0,
        panSpeed: 0.8
    },
    
    // 材质颜色
    colors: {
        wall: 0xcdba92,
        floor: 0x8b5a2b,
        ceiling: 0xe8e0c8,
        pedestal: 0xaa8866,
        baseboard: 0xb87c4f
    },
    
    // 展品配置
    exhibits: {
        cubeColors: [0xff5733, 0x33ff57, 0x3357ff, 0xff33f1, 0xffd733, 0x33fff5],
        sphereColor: 0xffaa44,
        cylinderColor: 0x44aaff,
        torusColor: 0x66cc99
    }
};