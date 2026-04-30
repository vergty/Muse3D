/**
 * 全局加载进度管理器
 * 统一管理 GLB 模型加载状态，显示进度条
 */
export class LoadingManager {
    constructor() {
        this.total = 0;
        this.loaded = 0;
        this.failed = 0;

        this.el = document.getElementById('loading');
        if (this.el) {
            this.el.innerHTML = '';
            this.el.className = 'loading loading-progress';
            this.el.innerHTML = `
                <div class="loading-title">🏛️ 正在加载博物馆展品...</div>
                <div class="loading-bar-bg"><div class="loading-bar-fill"></div></div>
                <div class="loading-text">0 / 0</div>
            `;
            this.barFill = this.el.querySelector('.loading-bar-fill');
            this.textEl = this.el.querySelector('.loading-text');
        }
    }

    setTotal(n) {
        this.total = n;
        this.update();
    }

    onSuccess(name) {
        this.loaded++;
        this.update();
    }

    onError(name) {
        this.failed++;
        this.update();
    }

    update() {
        if (!this.el) return;
        const done = this.loaded + this.failed;
        const pct = this.total > 0 ? (done / this.total) * 100 : 0;
        if (this.barFill) this.barFill.style.width = `${pct}%`;
        if (this.textEl) {
            this.textEl.textContent = `已加载 ${this.loaded} / ${this.total}${this.failed > 0 ? `（${this.failed} 失败）` : ''}`;
        }
        if (done >= this.total && this.total > 0) {
            if (this.barFill) this.barFill.style.width = '100%';
            setTimeout(() => this.hide(), 500);
        }
    }

    hide() {
        if (this.el) {
            this.el.style.opacity = '0';
            setTimeout(() => { this.el.style.display = 'none'; }, 300);
        }
    }
}
