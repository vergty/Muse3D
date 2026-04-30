import * as THREE from 'three';

// 添加网格辅助线
export function addGridHelper(scene, size = 20, divisions = 20) {
    const gridHelper = new THREE.GridHelper(size, divisions, 0x88aaff, 0x446688);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
    return gridHelper;
}

// 添加坐标轴辅助线
export function addAxesHelper(scene, size = 2) {
    const axesHelper = new THREE.AxesHelper(size);
    scene.add(axesHelper);
    return axesHelper;
}

// 添加粒子效果
export function addParticles(scene, count = 800, range = 8, height = 3.5) {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        particlesPositions[i * 3] = (Math.random() - 0.5) * range;
        particlesPositions[i * 3 + 1] = Math.random() * height;
        particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * range;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.03 });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    return particles;
}