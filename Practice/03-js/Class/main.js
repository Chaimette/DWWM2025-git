import Ball from './Ball.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const btnContainer = document.createElement('div');
btnContainer.className = 'btn-container';
document.body.appendChild(btnContainer);
const deleteButton = document.createElement('button');
deleteButton.innerText = "Delete Last Ball";

const clearButton = document.createElement('button');
clearButton.innerText = "Clear";
btnContainer.appendChild(deleteButton);
btnContainer.appendChild(clearButton);
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.8;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const balls = [];

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ball = new Ball(canvas, x, y);
  balls.push(ball);
});

deleteButton.addEventListener('click', () => {
  if (balls.length > 0) {
    balls.pop();
  }
});

clearButton.addEventListener('click', () => {
  balls.length = 0;
  
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < balls.length; i++) {
    balls[i].update(balls);
    balls[i].draw();
  }
  if (balls.length === 0) {
    clearButton.disabled = true;
    deleteButton.disabled = true;
  }
  else {
    clearButton.disabled = false;
    deleteButton.disabled = false;
  }
  requestAnimationFrame(animate);
}

animate();