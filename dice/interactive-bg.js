/**
 * Clean background parallax (horizontal only)
 * + pawn eye tracking
 * No stars, no canvas, no vertical gaps
 */

class InteractiveBackground {
  constructor() {
    // mouse
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    // background movement
    this.currentBgX = 0;
    this.targetBgX = 0;
    this.maxBgShift = 10;

    // eye movement
    this.currentEyeX = 0;
    this.currentEyeY = 0;
    this.targetEyeX = 0;
    this.targetEyeY = 0;
    this.maxEyeShift = 4.5;

    // elements
    this.pawn = null;
    this.eyes = [];

    // bind
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    this.init();
  }

  init() {
    this.pawn = document.getElementById("pawnMascot");
    this.eyes = Array.from(document.querySelectorAll(".pawn-eye"));

    window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", this.handleMouseLeave);
    window.addEventListener("resize", this.handleResize);

    this.handleResize();
    this.animate();
  }

  handleResize() {
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
  }

  handleMouseLeave() {
    this.targetBgX = 0;
    this.targetEyeX = 0;
    this.targetEyeY = 0;
  }

  handleMouseMove(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    // ✅ ONLY horizontal parallax (fixes white gaps)
    const normalizedX = this.mouseX / window.innerWidth - 0.5;
    this.targetBgX = normalizedX * this.maxBgShift;

    this.updateEyeTargets();
  }

  updateEyeTargets() {
    if (!this.pawn || !this.eyes.length) return;

    const rect = this.pawn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.36;

    const dx = this.mouseX - centerX;
    const dy = this.mouseY - centerY;

    const angle = Math.atan2(dy, dx);
    const distance = Math.min(
      this.maxEyeShift,
      Math.hypot(dx, dy) * 0.015
    );

    this.targetEyeX = Math.cos(angle) * distance;
    this.targetEyeY = Math.sin(angle) * distance;
  }

  animate() {
    // smooth background movement
    this.currentBgX += (this.targetBgX - this.currentBgX) * 0.08;

    // smooth eye movement
    this.currentEyeX += (this.targetEyeX - this.currentEyeX) * 0.18;
    this.currentEyeY += (this.targetEyeY - this.currentEyeY) * 0.18;

    // ✅ Y locked to center (critical fix)
    document.body.style.backgroundPosition =
      `calc(50% + ${this.currentBgX}px) center`;

    // move eyes
    for (const eye of this.eyes) {
      eye.style.transform =
        `translate3d(${this.currentEyeX}px, ${this.currentEyeY}px, 0)`;
    }

    requestAnimationFrame(this.animate);
  }
}

// init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new InteractiveBackground();
  });
} else {
  new InteractiveBackground();
}
