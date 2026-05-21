/**
 * 展品配置数据
 * 与展示逻辑分离，方便独立维护和扩展
 */
export const displayCases = [
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
