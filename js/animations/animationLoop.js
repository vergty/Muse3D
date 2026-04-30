// 动画循环管理器
export class AnimationLoop {
    constructor(renderer, scene, camera, controls, exhibits) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.exhibits = exhibits;
        this.time = 0;
    }
    
    start() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.update();
            this.render();
        };
        animate();
    }
    
    update() {
        this.time += 0.016;
        
        // 更新展品动画
        if (this.exhibits && this.exhibits.length > 0) {
            // 立方体旋转
            if (this.exhibits[0]) {
                this.exhibits[0].rotation.x += 0.008;
                this.exhibits[0].rotation.y += 0.012;
            }
            
            // 球体浮动和旋转
            if (this.exhibits[1]) {
                this.exhibits[1].position.y = 0.55 + Math.sin(Date.now() * 0.003) * 0.08;
                this.exhibits[1].rotation.x += 0.01;
                this.exhibits[1].rotation.y += 0.02;
            }
            
            // 圆柱体旋转
            if (this.exhibits[2]) {
                this.exhibits[2].rotation.y += 0.015;
            }
            
            // 环形旋转
            if (this.exhibits[3]) {
                this.exhibits[3].rotation.x += 0.01;
                this.exhibits[3].rotation.y += 0.02;
                this.exhibits[3].rotation.z += 0.005;
            }
        }
        
        // 更新控制器
        this.controls.update();
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}