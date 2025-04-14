export default class Ball {
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.x = x;
    this.y = y;
    // Rayon défini entre 10 et 30px
    this.radius = 10 + Math.random() * 20;

    // Vitesse et direction aléatoires entre -5 et 5 px par frame
    this.dx = (Math.random() - 0.5) * 10;
    // Vérifie la valeur de dx et dy pour éviter les valeurs trop petites, et set une vitesse minimum
    if (Math.abs(this.dx) < 1) this.dx = this.dx > 0 ? 1 : -1;

    this.dy = (Math.random() - 0.5) * 10;
    if (Math.abs(this.dy) < 1) this.dy = this.dy > 0 ? 1 : -1;

    this.color = this.getRandomColor();
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  update(balls) {
    // On détecte les collisions avec les bords du canvas et la direction est inversée
    if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    // On vérifie aussi si la balle sort du canvas et on la replace à l'intérieur
    if (this.x + this.radius > this.canvas.width) {
      this.x = this.canvas.width - this.radius;
    } else if (this.x - this.radius < 0) {
      this.x = this.radius;
    }

    if (this.y + this.radius > this.canvas.height) {
      this.y = this.canvas.height - this.radius;
    } else if (this.y - this.radius < 0) {
      this.y = this.radius;
    }

    // On vérifie les collisions avec les autres balles
    for (let i = 0; i < balls.length; i++) {
      let otherBall = balls[i];
      // On ignore current ball
      if (this === otherBall) continue;

      // No idea how this works, but it does, please don't ask me to explain
      const dx = this.x - otherBall.x;
      const dy = this.y - otherBall.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // On vérifie si la distance entre les deux balles est inférieure à la somme de leurs rayons
      if (distance < this.radius + otherBall.radius) {
        // On calcule l'angle de la collision, mais je pige que dalle
        //Chuis pas venue ici pour souffrir, okay?
        const angle = Math.atan2(dy, dx);
        // On déplace les balles pour éviter le chevauchement en fonction de l'angle de la collision et de la distance entre elles
        const overlap = this.radius + otherBall.radius - distance + 1;
        const moveX = (Math.cos(angle) * overlap) / 2;
        const moveY = (Math.sin(angle) * overlap) / 2;
        this.x += moveX;
        this.y += moveY;
        otherBall.x -= moveX;
        otherBall.y -= moveY;

        // On calcule la nouvelle vitesse et direction des balles après la collision
        const thisSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        const otherSpeed = Math.sqrt(
          otherBall.dx * otherBall.dx + otherBall.dy * otherBall.dy
        );

        const thisAngle = Math.atan2(this.dy, this.dx);
        const otherAngle = Math.atan2(otherBall.dy, otherBall.dx);

        // On utilise la formule de réflexion pour calculer les nouvelles vitesses
        const newThisAngle = 2 * angle - thisAngle;
        const newOtherAngle = 2 * angle - otherAngle - Math.PI;

        // On applique la vitesse et la direction
        // On utilise la vitesse d'origine pour éviter les collisions multiples
        this.dx = Math.cos(newThisAngle) * thisSpeed;
        this.dy = Math.sin(newThisAngle) * thisSpeed;
        otherBall.dx = Math.cos(newOtherAngle) * otherSpeed;
        otherBall.dy = Math.sin(newOtherAngle) * otherSpeed;
      }
    }
    // Maj de la position de la balle
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
}
