# Muse3D - 3D 数字博物馆

基于 Three.js 的交互式 3D 数字博物馆，支持第一人称漫游、展品特写查看、碰撞检测和 PBR 材质渲染。

## 功能特性

- **第一人称漫游** — WASD 移动 + 鼠标旋转视角，Pointer Lock API 锁定鼠标
- **AABB 碰撞检测** — 墙体与展台碰撞检测，支持滑动碰撞响应
- **展品特写模式** — 按 E 键进入，球坐标环绕旋转查看展品细节
- **俯瞰全景模式** — 按 F 键切换到俯瞰视角
- **五层光照系统** — 环境光 + 半球光 + 方向光（带阴影） + 9 盏聚光灯 + 柔和补光
- **PBR 材质** — MeshStandardMaterial / MeshPhysicalMaterial，支持金属度-粗糙度工作流和物理透射
- **11 个 glTF 展品模型** — 涵盖雕塑、陶器、佛像等文物类型
- **自动靠近检测** — 靠近展台自动显示信息面板

## 技术栈

| 技术 | 用途 |
|------|------|
| Three.js 0.128 | 3D 渲染引擎 |
| JavaScript ES6 Modules | 模块化架构 |
| Pointer Lock API | 第一人称鼠标控制 |
| WebGL 2.0 | GPU 硬件加速渲染 |
| glTF 2.0 (.glb) | PBR 模型格式 |
| Import Map | 浏览器原生模块加载 |

## 项目结构

```
├── index.html              # 入口页面
├── css/style.css           # 样式
├── js/
│   ├── main.js             # 主入口，游戏循环
│   ├── controls/
│   │   ├── FirstPersonControls.js   # 第一人称控制器
│   │   └── ExhibitViewController.js # 展品特写控制器
│   ├── exhibits/
│   │   ├── HighEndDisplayCase.js    # 高端展台类 + 管理器
│   │   └── WallInfoBoard.js         # 墙面信息板
│   ├── rooms/
│   │   └── MegaMuseum.js            # 博物馆房间构建
│   ├── materials/
│   │   ├── MarbleFloor.js           # 大理石地板
│   │   ├── ElegantWall.js           # 优雅墙面
│   │   └── ElegantCeiling.js        # 优雅天花板
│   ├── lights/
│   │   └── lighting.js              # 光照配置
│   ├── data/
│   │   └── exhibits.js              # 展品数据配置
│   ├── config/
│   │   └── setting.js               # 全局配置
│   ├── scene/
│   │   ├── setup.js                 # 场景初始化
│   │   ├── camera.js                # 相机创建
│   │   └── renderer.js              # 渲染器创建
│   └── utils/
│       └── LoadingManager.js        # 加载进度管理
└── models/                   # glTF 展品模型（.glb）
```

## 快速开始

1. 克隆仓库：
```bash
git clone https://github.com/vergty/Muse3D.git
cd Muse3D
```

2. 启动本地服务器（任选一种）：
```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code Live Server 插件
```

3. 浏览器打开 `http://localhost:8080`

## 操作指南

| 按键 | 功能 |
|------|------|
| 鼠标点击 | 锁定鼠标，进入第一人称 |
| W/A/S/D | 前后左右移动 |
| 鼠标移动 | 旋转视角 |
| E | 进入展品特写查看模式 |
| F | 切换俯瞰全景模式 |
| ESC | 解锁鼠标 / 退出特写模式 |

## 许可证

MIT License - 详见 [LICENSE](LICENSE)
