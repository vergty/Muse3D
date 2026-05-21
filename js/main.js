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
import { LoadingManager } from './utils/LoadingManager.js';
import { ExhibitViewController } from './controls/ExhibitViewController.js';
import { displayCases } from './data/exhibits.js';

// ========== 加载进度管理 ==========
const loadingManager = new LoadingManager();

// ========== 初始化核心组件 ==========
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

// ========== 展品特写查看控制器 ==========
const exhibitViewer = new ExhibitViewController(camera, renderer.domElement);

// 退出特写模式时恢复第一人称控制
exhibitViewer.onExit = () => {
    playerControls.enabled = true;
};

// ========== 添加控制器 ==========
const playerControls = new FirstPersonControls(camera, renderer.domElement, scene, {
    moveSpeed: 5,
    lookSpeed: 0.002,
    height: 1.6,
    boundX: 17.5,
    boundZ: 13.5
});

// 设置初始位置：房间南侧，面朝中心
playerControls.resetPosition(0, 12);

// ========== 添加光源 ==========
setupLights(scene);

// ========== 构建博物馆（现代明亮博物馆风格）==========
const ROOM_WIDTH = 36;
const ROOM_DEPTH = 28;
const ROOM_HEIGHT = 6;

const museum = new MegaMuseum(scene, {
    width: ROOM_WIDTH,
    depth: ROOM_DEPTH,
    height: ROOM_HEIGHT,
    floorType: 'white',
    addGrout: false,
    wallType: 'modern',
    ceilingType: 'modern',
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

// ========== 添加高端展览台（大房间分散布局 + 详细描述）==========

// 批量添加展览台（带加载回调）
const modelCount = displayCases.filter(c => c.modelPath).length;
loadingManager.setTotal(modelCount);

const casesWithCallbacks = displayCases.map(config => ({
    ...config,
    onModelLoad: () => loadingManager.onSuccess(config.name),
    onModelError: () => loadingManager.onError(config.name)
}));

displayCaseManager.addDisplayCases(casesWithCallbacks);

// 注册展品碰撞盒
displayCaseManager.getAll().forEach(displayCase => {
    playerControls.addObstacle(displayCase.getCollisionBox());
});

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
    💡 靠近展台自动显示信息<br>
    🔭 按 F 键切换俯瞰全景
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

// ========== 俯瞰模式 ==========
let isTopView = false;
let savedPlayerState = null;

function enterTopView() {
    savedPlayerState = {
        position: playerControls.position.clone(),
        euler: playerControls.euler.clone(),
        fov: camera.fov
    };
    // 隐藏天花板，从上方看室内
    if (museum.ceiling && museum.ceiling.ceilingGroup) {
        museum.ceiling.ceilingGroup.visible = false;
    }
    camera.fov = 100;
    camera.updateProjectionMatrix();
    camera.position.set(0, 9, 0);
    camera.rotation.set(-Math.PI / 2, 0, 0);
    isTopView = true;
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
}

function exitTopView() {
    if (savedPlayerState) {
        playerControls.position.copy(savedPlayerState.position);
        playerControls.euler.copy(savedPlayerState.euler);
        playerControls.updateCamera();
        camera.fov = savedPlayerState.fov || 75;
        camera.updateProjectionMatrix();
    }
    if (museum.ceiling && museum.ceiling.ceilingGroup) {
        museum.ceiling.ceilingGroup.visible = true;
    }
    isTopView = false;
}

// ========== 动画循环 ==========
function animate() {
    const deltaTime = Math.min(clock.getDelta(), 0.033);

    // 展品查看模式或俯瞰模式下暂停第一人称控制
    if (!exhibitViewer.isActive && !isTopView) {
        playerControls.update(deltaTime);
        displayCaseManager.updateProximity(playerControls.position);
    }

    // 渲染场景
    renderer.render(scene, camera);
    
    requestAnimationFrame(animate);
}
animate();

// ========== 键盘交互（按 E 查看详情，按 F 切换俯瞰） ==========
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF') {
        if (isTopView) exitTopView();
        else enterTopView();
        return;
    }
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
            console.log(`📋 进入展品查看模式：${info.name}`);
            playerControls.enabled = false;
            exhibitViewer.enter(nearestCase, info.longDescription);
        }
    }
});

// ========== 控制台输出 ==========
console.log('✅ 博物馆构建完成！');
console.log(`🏛️ 博物馆尺寸：${ROOM_WIDTH} x ${ROOM_DEPTH} x ${ROOM_HEIGHT}`);
console.log('📦 高端展览台数量：', displayCaseManager.getAll().length);
console.log('🎮 第一人称控制已启用');
console.log('💡 提示：靠近展台自动显示信息，按 E 键查看详情，按 F 键切换俯瞰全景');
console.log('📍 展览台位置：');
displayCaseManager.getAll().forEach((dc, i) => {
    const pos = dc.getPosition();
    console.log(`   ${i + 1}. ${dc.config.name} - (${pos.x.toFixed(1)}, ${pos.z.toFixed(1)})`);
});