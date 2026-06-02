// Canvas animation - 0/1 floating numbers background
// Ported from original canvas.js to a React hook

import { useEffect, useRef } from 'react';

class NumberElementConfig {
  constructor(values, xMinMax, yMinMax, sizeMinMax, speedMinMax) {
    this.values = values;
    this.x = xMinMax;
    this.y = yMinMax;
    this.size = sizeMinMax;
    this.speed = speedMinMax;
  }
}

function random(min, max) {
  if (typeof max === 'undefined') {
    return Math.random() * (min[1] - min[0]) + min[0];
  }
  return Math.random() * (max - min) + min;
}

class NumberElement {
  constructor(config) {
    this.config = config;
    this.spawn();
  }

  spawn() {
    this.value = this.config.values[Math.floor(random(0, 2))];
    this.size = random(this.config.size);
    this.speed = random(this.config.speed);
    this.x = random(this.config.x);
    this.y = random(this.config.y);
    this.viewportOffset = this.config.size[1] + 20;
    if (Math.abs(this.speed) < 1) {
      this.speed += (this.speed < 0 ? -1 : 1);
    }
    this.setSpawnPosition();
  }

  setSpawnPosition() {
    if (this.speed < 0) {
      const key = ['x', 'y'][Math.floor(random(0, 2))];
      const value = key === 'x' ? window.innerWidth : window.innerHeight;
      this[key] = value + this.size;
    } else {
      const key = ['x', 'y'][Math.floor(random(0, 2))];
      this[key] = 0 - this.size;
    }
  }

  isInViewport() {
    return !(
      this.x < 0 - this.viewportOffset ||
      this.y < 0 - this.viewportOffset ||
      this.x > window.innerWidth + this.viewportOffset ||
      this.y > window.innerHeight + this.viewportOffset
    );
  }

  move() {
    this.x += this.speed;
    this.y += this.speed;
  }
}

class NumberElementCollector {
  constructor(count = 100, spawnTimeout = 20) {
    this.elements = [];
    const generator = () => {
      if (this.elements.length < count) {
        this.elements.push(new NumberElement(
          new NumberElementConfig(
            ['0', '1'],
            [0, window.innerWidth],
            [0, window.innerHeight],
            [15, 50],
            [-12, 12]
          )
        ));
        setTimeout(generator, spawnTimeout);
      }
    };
    generator();
  }

  moveAll() {
    for (const el of this.elements) {
      el.move();
      if (!el.isInViewport()) el.spawn();
    }
  }
}

export function useCanvasAnimation(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const collector = new NumberElementCollector(100, 20);
    let animFrameId;

    const process = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      collector.moveAll();

      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (const el of collector.elements) {
        ctx.font = el.size / 1.5 + 'px arial black';
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'left';
        ctx.fillText(el.value, el.x, el.y);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.stroke();

      animFrameId = requestAnimationFrame(process);
    };

    process();
    return () => cancelAnimationFrame(animFrameId);
  }, [canvasRef]);
}
