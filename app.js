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
    dirCount: [0, 0, 0, 0],
    shapeSelected: [true, false, false, false]
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
      this.ctx.stroke();
      this.ctx.fill();
    },
    drawRectangle({ x, y, w, h }) {
      this.ctx.fillRect(x, y, w, h);
      this.ctx.stroke();
    },
    drawShapes() {
      for (let i = 0; i < this.shapes.length; i++) {
        const { type, args } = this.shapes[i];
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
            break;
        }
      }
    },
    createLine() {
      const curr = this.history.shift();
      const dest = this.history.pop();
      this.shapes.push({
        type: "line",
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
        args: { p1, p2, p3 }
      });
    },
    createRectangle({ minX, minY, maxX, maxY }) {
      const x = minX.x;
      const y = minY.y;
      const w = maxX.x - x;
      const h = maxY.y - y;

      this.shapes.push({
        type: "rectangle",
        args: { x, y, w, h }
      });
    },
    stopDrawing() {
      const minMax = this.findMinMax();
      switch (true) {
        // line
        case this.shapeSelected[0]:
          this.createLine();
          break;
        // triangle
        case this.shapeSelected[1]:
          this.createTriangle(minMax);
          break;
        // rectangle
        case this.shapeSelected[2]:
          this.createRectangle(minMax);
          break;
        // circle
        case this.shapeSelected[3]:
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
