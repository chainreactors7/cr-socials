console.log('Script started');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const points = [];
let minDist = 100;
let mouseX, mouseY;

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', () => {
  console.log('Window resized');
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

class Point {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
    }
  
    update() {
      if (this.x + this.r > innerWidth || this.x - this.r < 0) {
        this.vx = -this.vx;
      }
      if (this.y + this.r > innerHeight || this.y - this.r < 0) {
        this.vy = -this.vy;
      }
      this.x += this.vx;
      this.y += this.vy;
    }
  
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 2, 0, Math.PI * 2);
        const d = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2) / minDist;
        const alpha = Math.max(1 - d, 0).toFixed(1);
        const nodeColor = `rgba(251, 255, 255, ${alpha})`;
        const nodeBorderColor = `rgba(251, 255, 255, ${Math.min(alpha * 1.5, 1)})`;
    
        ctx.fillStyle = nodeColor;
        ctx.strokeStyle = nodeBorderColor;
        ctx.lineWidth = 4; // Increase the line width for broader lines
    
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }

function init() {
  console.log('Init called');
  points.length = 0;
  for (let i = 0; i < innerWidth / 10; i++) {
    const x = Math.random() * innerWidth;
    const y = Math.random() * innerHeight;
    const r = Math.random() * 2 + 1;
    points.push(new Point(x, y, r));
  }
}

init();

function animate() {
  console.log('Animate called');
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  points.forEach(point => {
    point.update();
    point.draw();
  });
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2) / minDist;
      if (dist <= 1) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.strokeStyle = `rgba(251,255,255,${Math.max(1 - dist, 0).toFixed(1)})`;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

animate();

addEventListener('mousemove', e => {
  console.log('Mouse moved');
  mouseX = e.clientX;
  mouseY = e.clientY;
  minDist = Math.sqrt((e.clientX - innerWidth / 2) ** 2 + (e.clientY - innerHeight / 2) ** 2) / 10 + 50;
});