import * as THREE from 'three';

/**
 * 墙壁信息展板
 * 使用 Canvas 贴图 + MeshBasicMaterial，完全不受光照影响
 */
export class WallInfoBoard {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.config = {
            position: options.position || { x: 0, y: 2.5, z: 0 },
            rotation: options.rotation || { x: 0, y: 0, z: 0 },
            width: options.width || 5,
            height: options.height || 2.6,
            title: options.title || '展览说明',
            content: options.content || ''
        };
    }

    build() {
        const texture = this.createCanvasTexture();

        // MeshBasicMaterial 完全不受光照影响，像屏幕一样自发光
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(this.config.width, this.config.height),
            material
        );

        board.position.set(
            this.config.position.x,
            this.config.position.y,
            this.config.position.z
        );
        board.rotation.set(
            this.config.rotation.x,
            this.config.rotation.y,
            this.config.rotation.z
        );

        // 添加边框装饰（深色木质边框）
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x5c4033,
            metalness: 0.3,
            roughness: 0.5
        });

        const ft = 0.1;
        const fw = this.config.width + ft;
        const fh = this.config.height + ft;

        const frame = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.08), frameMat);
        frame.position.copy(board.position);
        frame.rotation.copy(board.rotation);
        frame.position.z -= 0.03;

        this.scene.add(frame);
        this.scene.add(board);

        return this;
    }

    createCanvasTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // 黑板背景（深墨绿色，更像真实黑板）
        ctx.fillStyle = '#0d1f0d';
        ctx.fillRect(0, 0, w, h);

        // 外边框
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 16;
        ctx.strokeRect(24, 24, w - 48, h - 48);

        // 内边框
        ctx.strokeStyle = '#6b5a45';
        ctx.lineWidth = 6;
        ctx.strokeRect(50, 50, w - 100, h - 100);

        // 标题分割线
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(100, 160);
        ctx.lineTo(w - 100, 160);
        ctx.stroke();

        // 标题（白色粗体，带阴影）
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 96px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.fillText(this.config.title, w / 2, 100);
        ctx.shadowColor = 'transparent';

        // 正文（浅灰白色）
        ctx.fillStyle = '#e8e0d0';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        this.drawWrappedText(ctx, this.config.content, 100, 240, w - 200, 72);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return texture;
    }

    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        const paragraphs = text.split('\n');
        let currentY = y;

        for (const para of paragraphs) {
            if (para.trim() === '') {
                currentY += lineHeight * 0.5;
                continue;
            }

            const chars = para.split('');
            let line = '';

            for (const char of chars) {
                const testLine = line + char;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && line !== '') {
                    ctx.fillText(line, x, currentY);
                    line = char;
                    currentY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, currentY);
            currentY += lineHeight * 1.3;
        }
    }
}
