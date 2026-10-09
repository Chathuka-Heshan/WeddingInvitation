export function initPetalCanvas() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const TOTAL_PETALS = 35;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 10 + 8; // Size between 8 and 18
      this.speedY = Math.random() * 0.8 + 0.5; // Slow gentle fall
      this.speedX = Math.random() * 0.4 - 0.2;
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationDistance = Math.random() * 20 + 10;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      
      // Color palette: Pure white petals & soft light pink petals
      const isWhite = Math.random() > 0.4;
      this.color = isWhite 
        ? 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.4) + ')'
        : 'rgba(252, 231, 240, ' + (Math.random() * 0.6 + 0.3) + ')';
      
      this.edgeColor = isWhite
        ? 'rgba(255, 240, 245, 0.6)'
        : 'rgba(244, 114, 182, 0.4)';
    }

    update() {
      this.y += this.speedY;
      this.angle += this.oscillationSpeed;
      this.x += Math.sin(this.angle) * 0.5 + this.speedX;
      this.rotationSpeed += (Math.random() - 0.5) * 0.001;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Draw Petal Shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, -this.size / 4, this.size / 2, this.size);
      ctx.bezierCurveTo(0, this.size * 1.2, -this.size / 2, this.size, -this.size / 2, 0);
      ctx.closePath();

      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(244, 114, 182, 0.15)';
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.strokeStyle = this.edgeColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}
