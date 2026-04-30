// js/main.js
import * as THREE from 'three';
import { createScene } from './scene/setup.js';
import { createCamera } from './scene/camera.js';
import { createRenderer } from './scene/renderer.js';
import { setupLights } from './lights/lighting.js';
import { MegaMuseum } from './rooms/MegaMuseum.js';
import { FirstPersonControls } from './controls/FirstPersonControls.js';
import { HighEndDisplayCaseManager } from './exhibits/HighEndDisplayCase.js';  // 改用高端展台
import { settings } from './config/setting.js';

// ========== 隐藏加载提示 ==========
const loadingDiv = document.getElementById('loading');
if (loadingDiv) {
    loadingDiv.style.display = 'none';
}

// ========== 初始化核心组件 ==========
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

// 设置相机初始位置
camera.position.set(0, 1.6, 7);

// ========== 添加控制器 ==========
const playerControls = new FirstPersonControls(camera, renderer.domElement, scene, {
    moveSpeed: 5,
    lookSpeed: 0.002,
    height: 1.6
});

// ========== 添加光源 ==========
setupLights(scene);

// ========== 构建博物馆 ==========
const museum = new MegaMuseum(scene, {
    width: 24,
    depth: 18,
    height: 6,
    floorType: 'white',
    wallType: 'marble',
    ceilingType: 'tray',
    addBaseboard: false,
    addCrownMolding: false,
    addWallPanels: false,
    addWallLights: false,
    addChandelier: false,
    addMedallion: false
});
museum.build();

// ========== 创建高端展览台管理器 ==========
const displayCaseManager = new HighEndDisplayCaseManager(scene);

// ========== 添加高端展览台（无内部展品） ==========
const displayCases = [
    // 中央主展台
    {
        position: { x: 0, z: 0 },
        name: '佛像雕塑',
        description: '慈悲庄严的佛教造像艺术。',
        baseWidth: 1.4,
        baseDepth: 1.4,
        baseHeight: 0.55,
        glassWidth: 1.2,
        glassDepth: 1.2,
        glassHeight: 0.9,
        addGlow: false,
        modelPath: 'models/buddha_statue.glb',      // ← 添加模型路径
        modelScale: 0.5,
        modelYOffset: -0.25,        // ← 新增：垂直偏移（正数抬高，负数降低）
        modelXOffset: 0,        // ← 新增：水平偏移（X轴）
        modelZOffset: 0         // ← 新增：水平偏移（Z轴）
    },
    // 东侧展台
    {
        position: { x: 0, z: -3 },
        name: '埃及猫神（巴斯特）',
        description: '豪猫',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/egyptian_cat_statue.glb',      // ← 添加模型路径
        modelScale: 0.3
    },
    // 西侧展台
    {
        position: { x: 0, z: 3},
        name: '青铜器皿',
        description: '商周时期的青铜礼器，纹饰精美。',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/golden_and_obsidian_vases_free_version.glb',      // ← 添加模型路径
        modelScale: 0.3,
        modelYOffset: -0.25,        // ← 新增：垂直偏移（正数抬高，负数降低）
        modelXOffset: 0,        // ← 新增：水平偏移（X轴）
        modelZOffset: 0         // ← 新增：水平偏移（Z轴）
    },
    // 北侧展台1
    {
        position: { x: -3, z: 0 },
        name: '青铜壶',
        description: '商周时期的青铜壶，精美的造型。',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/rustic_bronze_bottle.glb',      // ← 添加模型路径
        modelScale: 0.03,
        modelYOffset: 0.1,        // ← 新增：垂直偏移（正数抬高，负数降低）
        modelXOffset: 0,        // ← 新增：水平偏移（X轴）
        modelZOffset: -0.2         // ← 新增：水平偏移（Z轴）
    },
    // 北侧展台2
    {
        position: { x: -3, z: -3 },
        name: '兵马俑',
        description: '兵马俑是中国古代军事艺术，历经千年风雨，历久弥坚。',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/terracotta_army.glb',      // ← 添加模型路径
        modelScale: 0.2
    },
    // 角落展台1
    {
        position: { x: -3, z: 3 },
        name: '青花瓷瓶',
        description: '商周时期的青花瓷瓶，精美的造型。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/chinese_pottery_vase.glb',      // ← 添加模型路径
        modelScale: 0.005
    },
    // 角落展台2
    {
        position: { x: 3, z: 3 },
        name: '青花瓷',
        description: '商周时期的青花瓷，精美的造型。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/baluster_vase_from_a_five-piece_garniture.glb',      // ← 添加模型路径
        modelScale: 1
    },
    // 角落展台3
    {
        position: { x: 3, z: 0 },
        name: '天使雕像',
        description: '天使雕像，神圣的造型。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/graveyard_angel_statue.glb',      // ← 添加模型路径
        modelScale: 0.04,
        modelYOffset: -0.3,        // ← 新增：垂直偏移（正数抬高，负数降低）
        modelXOffset: 0,        // ← 新增：水平偏移（X轴）
        modelZOffset: 0         // ← 新增：水平偏移（Z轴）
    },
    // 角落展台4
    {
        position: { x: 3, z: -3 },
        name: '青花瓷',
        description: '商周时期的青花瓷，精美的造型。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/baluster_vase_one_of_three_in_a_five-piece.glb',      // ← 添加模型路径
        modelScale: 0.7,
        modelYOffset: -0.5,        // ← 新增：垂直偏移（正数抬高，负数降低）
        modelXOffset: 0.1,        // ← 新增：水平偏移（X轴）
        modelZOffset: 0.4         // ← 新增：水平偏移（Z轴）
    }
];

// 批量添加展览台
displayCaseManager.addDisplayCases(displayCases);

// ========== 添加准星 ==========
const crosshair = document.createElement('div');
crosshair.style.position = 'absolute';
crosshair.style.top = '50%';
crosshair.style.left = '50%';
crosshair.style.width = '4px';
crosshair.style.height = '4px';
crosshair.style.backgroundColor = 'white';
crosshair.style.borderRadius = '50%';
crosshair.style.transform = 'translate(-50%, -50%)';
crosshair.style.zIndex = '1000';
crosshair.style.pointerEvents = 'none';
document.body.appendChild(crosshair);

// ========== 添加控制提示 ==========
const controlsInfo = document.createElement('div');
controlsInfo.style.position = 'absolute';
controlsInfo.style.bottom = '20px';
controlsInfo.style.left = '20px';
controlsInfo.style.backgroundColor = 'rgba(0,0,0,0.7)';
controlsInfo.style.color = 'white';
controlsInfo.style.padding = '12px 20px';
controlsInfo.style.borderRadius = '8px';
controlsInfo.style.fontFamily = 'monospace';
controlsInfo.style.fontSize = '12px';
controlsInfo.style.zIndex = '100';
controlsInfo.style.pointerEvents = 'none';
controlsInfo.innerHTML = `
    <strong>🎮 第一人称控制</strong><br>
    🖱️ 点击画面锁定鼠标<br>
    ⌨️ WASD 移动 | 🖱️ 鼠标旋转视角<br>
    🔓 ESC 解锁鼠标<br>
    🏛️ 共有 ${displayCaseManager.getAll().length} 个展览台<br>
    💡 靠近展台自动显示信息
`;
document.body.appendChild(controlsInfo);

// ========== 时钟 ==========
const clock = new THREE.Clock();

// ========== 窗口适配 ==========
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ========== 动画循环 ==========
function animate() {
    const deltaTime = Math.min(clock.getDelta(), 0.033);
    
    // 更新第一人称控制器
    playerControls.update(deltaTime);
    
    // 更新展台靠近检测（传入玩家位置）
    displayCaseManager.updateProximity(playerControls.position);
    
    // 渲染场景
    renderer.render(scene, camera);
    
    requestAnimationFrame(animate);
}
animate();

// ========== 键盘交互（按 E 查看详情） ==========
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') {
        // 查找当前最近的展台
        let nearestCase = null;
        let minDistance = 2.0;
        
        displayCaseManager.getAll().forEach(displayCase => {
            if (displayCase.isPlayerNear) {
                const pos = displayCase.getPosition();
                const dx = playerControls.position.x - pos.x;
                const dz = playerControls.position.z - pos.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCase = displayCase;
                }
            }
        });
        
        if (nearestCase) {
            const info = nearestCase.getInfo();
            // 可以添加更详细的弹窗或语音提示
            console.log(`📋 展品信息：${info.name} - ${info.description}`);
            
            // 临时显示更详细的信息
            const tempPanel = document.createElement('div');
            tempPanel.style.position = 'absolute';
            tempPanel.style.top = '50%';
            tempPanel.style.left = '50%';
            tempPanel.style.transform = 'translate(-50%, -50%)';
            tempPanel.style.background = 'rgba(0,0,0,0.9)';
            tempPanel.style.color = '#d4af37';
            tempPanel.style.padding = '20px 40px';
            tempPanel.style.borderRadius = '16px';
            tempPanel.style.fontFamily = 'monospace';
            tempPanel.style.zIndex = '300';
            tempPanel.style.border = '1px solid #d4af37';
            tempPanel.style.textAlign = 'center';
            tempPanel.innerHTML = `
                <h2 style="margin:0 0 10px 0">${info.name}</h2>
                <p style="margin:0; color:#e0d8c8">${info.description}</p>
                <p style="margin:10px 0 0 0; font-size:12px; color:#aa9977">按任意键关闭</p>
            `;
            document.body.appendChild(tempPanel);
            
            const closeHandler = () => {
                tempPanel.remove();
                document.removeEventListener('keydown', closeHandler);
                document.removeEventListener('click', closeHandler);
            };
            document.addEventListener('keydown', closeHandler, { once: true });
            document.addEventListener('click', closeHandler, { once: true });
        }
    }
});

// ========== 控制台输出 ==========
console.log('✅ 博物馆构建完成！');
console.log('🏛️ 博物馆尺寸：24 x 18 x 6');
console.log('📦 高端展览台数量：', displayCaseManager.getAll().length);
console.log('🎮 第一人称控制已启用');
console.log('💡 提示：靠近展台自动显示信息，按 E 键查看详情');
console.log('📍 展览台位置：');
displayCaseManager.getAll().forEach((dc, i) => {
    const pos = dc.getPosition();
    console.log(`   ${i + 1}. ${dc.config.name} - (${pos.x.toFixed(1)}, ${pos.z.toFixed(1)})`);
});