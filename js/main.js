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
const displayCases = [
    // 中央主展台
    {
        position: { x: 0, z: 0 },
        name: '佛像雕塑',
        description: '慈悲庄严的佛教造像艺术。',
        longDescription: '这尊佛像雕塑展现了佛教造像艺术的巅峰水准。佛像面容安详，双目微垂，流露出慈悲与智慧的光芒。雕塑采用传统的禅定坐姿，双手结印，衣褶流畅自然，体现了古代工匠对形体比例与神韵表达的深刻理解。佛教造像不仅是宗教信仰的载体，更是东方美学的杰出代表，其庄严宁静的气质能够引导观者进入内心的平和之境。',
        baseWidth: 1.4,
        baseDepth: 1.4,
        baseHeight: 0.55,
        glassWidth: 1.2,
        glassDepth: 1.2,
        glassHeight: 0.9,
        addGlow: false,
        modelPath: 'models/buddha_statue.glb',
        modelScale: 0.5,
        modelYOffset: -0.25,
        modelXOffset: 0,
        modelZOffset: 0
    },
    // 北侧展台
    {
        position: { x: 0, z: -9 },
        name: '埃及猫神（巴斯特）',
        description: '古埃及神话中的猫神巴斯特，象征家庭与守护。',
        longDescription: '巴斯特（Bastet）是古埃及神话中备受尊崇的猫神，最初以狮头女战神的形象出现，后逐渐演变为温柔的猫首人身女神。她被视为家庭、生育与守护之神，古埃及人相信巴斯特能够驱散邪灵、保护家园。这件雕像以青铜铸造，猫身端坐，双耳竖立，眼神中透露出神秘而威严的气息，是古埃及宗教信仰与猫崇拜文化的珍贵见证。',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/egyptian_cat_statue.glb',
        modelScale: 0.3
    },
    // 南侧展台
    {
        position: { x: 0, z: 9 },
        name: '青铜器皿',
        description: '商周时期的青铜礼器，纹饰精美。',
        longDescription: '这组青铜器皿出自中国商周时期，是青铜时代礼器文化的杰出代表。青铜器采用失蜡法与陶范法结合的复杂铸造工艺，器身布满精美的饕餮纹与云雷纹，线条刚劲有力、层次分明。商周青铜礼器不仅是祭祀活动中沟通天地的神圣器物，更是王权与等级的象征，其纹饰中蕴含的图腾信仰与宇宙观念，至今仍是研究古代中国文明的重要窗口。',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/golden_and_obsidian_vases_free_version.glb',
        modelScale: 0.3,
        modelYOffset: -0.25,
        modelXOffset: 0,
        modelZOffset: 0
    },
    // 西侧展台1
    {
        position: { x: -9, z: 0 },
        name: '青铜壶',
        description: '商周时期的青铜壶，精美的造型。',
        longDescription: '这件青铜壶是商周时期青铜铸造工艺的典范之作。壶身呈鼓腹状，颈部修长，圈足稳重，整体造型端庄典雅。器表装饰有繁复的兽面纹与几何纹饰，铸工精湛，纹饰清晰可辨。青铜壶在古代既是盛酒或盛水的实用器皿，也是宗庙祭祀中不可或缺的礼器，其形制与纹饰的演变，反映了商周时期社会礼制与审美观念的深刻变迁。',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/rustic_bronze_bottle.glb',
        modelScale: 0.03,
        modelYOffset: 0.1,
        modelXOffset: 0,
        modelZOffset: -0.2
    },
    // 西侧展台2
    {
        position: { x: -9, z: -9 },
        name: '兵马俑',
        description: '兵马俑是中国古代军事艺术，历经千年风雨，历久弥坚。',
        longDescription: '秦始皇兵马俑被誉为"世界第八大奇迹"，是中国古代军事艺术与雕塑技艺的巅峰之作。这些陶俑出土于秦始皇陵陪葬坑，数量超过八千件，包括步兵、骑兵、战车兵及各级将领，阵容庞大、排列有序。最令人惊叹的是，每个陶俑的面部表情、发型、铠甲细节各不相同，真正做到了"千人千面"。兵马俑不仅展现了秦帝国的强大军事实力，更为后世研究秦代服饰、兵器与军事制度提供了无可替代的实物资料。',
        baseWidth: 1.2,
        baseDepth: 1.2,
        addGlow: false,
        modelPath: 'models/terracotta_army.glb',
        modelScale: 0.2
    },
    // 东侧展台1
    {
        position: { x: 9, z: 0 },
        name: '天使雕像',
        description: '天使雕像，神圣的造型。',
        longDescription: '这尊天使雕像是西方宗教雕塑艺术的经典之作。天使双翼展开，面容宁静而圣洁，衣袍随风飘动，呈现出一种超凡脱俗的美感。雕像采用大理石材质，质地细腻温润，工匠通过对光影与肌理的精妙处理，赋予冰冷的石头以生命的温度。在西方文化中，天使是神与人之间的使者，象征着守护、希望与 divine 的启示，这尊雕像正是这种信仰与美学的完美融合。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/graveyard_angel_statue.glb',
        modelScale: 0.04,
        modelYOffset: -0.3,
        modelXOffset: 0,
        modelZOffset: 0
    },
    // 东侧展台2
    {
        position: { x: 9, z: -9 },
        name: '青花瓷瓶（五件套之一）',
        description: '商周时期的青花瓷，精美的造型。',
        longDescription: '这件青花瓷瓶出自一套五件套的 garniture 组合，是明清时期景德镇官窑的精品之作。瓶身以钴料在白瓷胎上绘制纹饰，再罩以透明釉，经高温一次烧成，呈现出白地蓝花的典雅效果。纹饰题材丰富，包括山水人物、花鸟虫鱼与吉祥图案，笔法细腻流畅，发色浓艳而不俗。五件套 garniture 常见于欧洲贵族的宫殿陈设，是中国外销瓷中的顶级品类，见证了东西方文明交流的辉煌历史。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/baluster_vase_from_a_five-piece_garniture.glb',
        modelScale: 1
    },
    // 西南角落
    {
        position: { x: -9, z: 9 },
        name: '青花瓷瓶',
        description: '商周时期的青花瓷瓶，精美的造型。',
        longDescription: '这件青花瓷瓶代表了中国陶瓷艺术的最高成就。青花瓷器以高岭土为胎、钴料为彩，在高温还原焰中烧制而成，呈现出独特的白地蓝花效果。此瓶造型优美，颈部细长、腹部圆润、圈足稳重，瓶身绘有精美的缠枝莲纹，寓意生生不息、富贵连绵。青花瓷自元代成熟以来，历经明清两代的发展，不仅是中国宫廷的御用珍品，更通过海上丝绸之路远销海外，成为世界认识中国文化的重要名片。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/chinese_pottery_vase.glb',
        modelScale: 0.005
    },
    // 东南角落
    {
        position: { x: 9, z: 9 },
        name: '青花瓷（五件套之三）',
        description: '商周时期的青花瓷，精美的造型。',
        longDescription: '这件青花瓷是五件套组合中的第三件，器型为经典的 baluster 瓶式，腹部鼓圆、颈部外撇，整体比例协调优美。瓶身以青花绘制山水庭院图景，远山近水、亭台楼阁层次分明，仿佛一幅立体的水墨画卷。青花发色浓艳而不失清雅，釉面光洁如镜，充分展现了景德镇御窑厂工匠高超的绘画与烧造技艺。此类成套瓷器多陈设于宫殿壁炉之上，既是实用花器，也是彰显品位的艺术装饰。',
        baseWidth: 1.0,
        baseDepth: 1.0,
        glassHeight: 0.7,
        addGlow: false,
        modelPath: 'models/baluster_vase_one_of_three_in_a_five-piece.glb',
        modelScale: 0.7,
        modelYOffset: -0.5,
        modelXOffset: 0.1,
        modelZOffset: 0.4
    }
];

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