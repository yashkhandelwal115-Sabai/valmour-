class CinematicHeroController {
  constructor(element) {
    this.hero = element;
    this.canvas = this.hero.querySelector('canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Check for reduced motion
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!this.prefersReducedMotion) {
      this.initSequence();
    } else {
      // Fallback for accessibility: jump straight to phase 4
      this.hero.classList.add('phase-4');
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initSequence() {
    // Phase 2: Center & Zoom in (Walk to center)
    setTimeout(() => {
      this.hero.classList.add('phase-2');
    }, 100); // Trigger immediately after load to start transition

    // Phase 3: Hand reveal -> Particle Burst & Text Reveal
    setTimeout(() => {
      this.hero.classList.add('phase-3');
      this.createBurst();
    }, 3000); // 3 seconds for the pan/zoom

    // Phase 4: Subtext and Button Reveal
    setTimeout(() => {
      this.hero.classList.add('phase-4');
    }, 5500); // 2.5 seconds after burst
  }

  createBurst() {
    this.isRunning = true;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Create 200 gold particles for the burst
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 20 + 5;
      this.particles.push({
        x: centerX,
        y: centerY + 50, // Slightly below center like a hand opening
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5, // Bias upward
        radius: Math.random() * 2.5 + 0.5,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.005,
        color: `rgba(212, 175, 55, ` // Base gold color
      });
    }
    
    this.animateParticles();
  }

  animateParticles() {
    if (!this.isRunning) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let activeParticles = false;

    this.particles.forEach(p => {
      if (p.alpha <= 0) return;
      activeParticles = true;
      
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      
      // Gravity and friction
      p.vy += 0.2; 
      p.vx *= 0.94;
      p.vy *= 0.94;
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + p.alpha + ')';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#d4af37';
      this.ctx.fill();
    });

    if (activeParticles) {
      requestAnimationFrame(() => this.animateParticles());
    } else {
      this.isRunning = false;
      this.startAmbientParticles();
    }
  }

  startAmbientParticles() {
    this.isRunning = true;
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * -1 - 0.5, // Float up
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    this.animateAmbient();
  }

  animateAmbient() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around
      if (p.y < 0) p.y = this.canvas.height;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = '#d4af37';
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animateAmbient());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.cinematic-hero');
  if (hero) {
    new CinematicHeroController(hero);
  }
});
