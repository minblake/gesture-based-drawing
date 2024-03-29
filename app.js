Vue.directive("pan", {
  bind: function(el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el);
      mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      mc.on("pan", binding.value);
    }
  }
});

new Vue({
  el: "#app",
  data: {
    canvas: null,
    ctx: null,
    canvasDim: [0, 0],
    curr: [0, 0],
    prev: [0, 0],
    history: [],
    shapes: [],
    color: "black",
    shape: "line"
  },
  mounted() {
    this.canvas = document.getElementById("drawing-board");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 2;

    const rect = this.canvas.getBoundingClientRect();
    this.canvasDim = [rect.left, rect.top];
  },
  methods: {
    onPan(e) {
      e.eventType === 2 ? this.draw(e) : this.stopDrawing();
    },
    draw({ center }) {
      const x = center.x - this.canvasDim[0];
      const y = center.y - this.canvasDim[1];
      this.ctx.strokeStyle = this.color;

      if (this.history.length < 1) this.prev = [x, y];

      this.curr = [x, y];

      this.drawLine({
        curr: [...this.prev],
        dest: [...this.curr]
      });
      this.prev = [x, y];

      this.history.push({ x, y });
    },
    drawLine({ curr, dest }) {
      this.ctx.beginPath();
      this.ctx.moveTo(...curr);
      this.ctx.lineTo(...dest);
      this.ctx.closePath();
      this.ctx.stroke();
    },
    drawTriangle({ p1, p2, p3 }) {
      this.ctx.beginPath();
      this.ctx.moveTo(...p1);
      this.ctx.lineTo(...p2);
      this.ctx.lineTo(...p3);
      this.ctx.lineTo(...p1);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.fill();
    },
    drawRectangle({ lt, rt, lb, rb }) {
      this.ctx.beginPath();
      this.ctx.moveTo(...lt);
      this.ctx.lineTo(...rt);
      this.ctx.lineTo(...rb);
      this.ctx.lineTo(...lb);
      this.ctx.lineTo(...lt);
      this.ctx.fill();
      this.ctx.stroke();
    },
    drawCircle({ x, y, r }) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.fill();
    },
    drawShapes() {
      for (let i = 0; i < this.shapes.length; i++) {
        const { type, color, args } = this.shapes[i];
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        switch (type) {
          case "line":
            this.drawLine(args);
            break;
          case "triangle":
            this.drawTriangle(args);
            break;
          case "rectangle":
            this.drawRectangle(args);
            break;
          case "circle":
            this.drawCircle(args);
            break;
        }
      }
    },
    createLine() {
      const curr = this.history.shift();
      const dest = this.history.pop();
      this.shapes.push({
        type: "line",
        color: this.color,
        args: {
          curr: [curr.x, curr.y],
          dest: [dest.x, dest.y]
        }
      });
    },
    createTriangle({ minX, minY, maxX, maxY }) {
      const p1 = [minX.x, minX.y];
      const p3 = [maxX.x, maxX.y];
      let p2;

      if (
        Math.abs(minY.y - maxX.y) > Math.abs(maxY.y - maxX.y) &&
        Math.abs(minY.y - minX.y) > Math.abs(maxY.y - maxX.y)
      ) {
        p2 = [minY.x, minY.y];
      } else {
        p2 = [maxY.x, maxY.y];
      }

      this.shapes.push({
        type: "triangle",
        color: this.color,
        args: { p1, p2, p3 }
      });
    },
    createRectangle({ minX, minY, maxX, maxY }) {
      const w = maxX.x - minX.x;
      const h = maxY.y - minY.y;
      const lt = [minX.x, minY.y];
      const rt = [minX.x + w, minY.y];
      const lb = [minX.x, maxY.y];
      const rb = [minX.x + w, maxY.y];

      this.shapes.push({
        type: "rectangle",
        color: this.color,
        args: { lt, rt, lb, rb }
      });
    },
    createCircle({ minX, minY, maxX, maxY }) {
      const radX = (maxX.x - minX.x) / 2;
      const radY = (maxY.y - minY.y) / 2;
      const r = (radX + radY) / 2;
      const x = minX.x + radX;
      const y = minY.y + radY;

      this.shapes.push({
        type: "circle",
        color: this.color,
        args: { x, y, r }
      });
    },
    stopDrawing() {
      const minMax = this.findMinMax();
      switch (this.shape) {
        case "line":
          this.createLine();
          break;
        case "triangle":
          this.createTriangle(minMax);
          break;
        case "rectangle":
          this.createRectangle(minMax);
          break;
        case "circle":
          this.createCircle(minMax);
          break;
      }
      this.redraw();
      this.drawShapes();
    },
    redraw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.history = [];
    },
    clearCanvas() {
      this.redraw();
      this.shapes = [];
    },
    findMinMax() {
      const coords = this.history;
      const xList = coords.map(c => c.x);
      const yList = coords.map(c => c.y);

      let minX = coords[xList.indexOf(Math.min(...xList))];
      let maxX = coords[xList.indexOf(Math.max(...xList))];
      let minY = coords[yList.indexOf(Math.min(...yList))];
      let maxY = coords[yList.indexOf(Math.max(...yList))];

      return { minX, minY, maxX, maxY };
    }
  }
});
