Vue.directive("pan", {
  bind: function(el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el);
      mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      mc.on("pan", binding.value);
    }
  }
});

const vm = new Vue({
  el: "#app",
  data: {
    canvas: null,
    canvasDim: { x: 0, y: 0 },
    ctx: null,
    curr: [],
    prev: [],
    listX: [],
    listY: [],
    shapes: [],
    shapeSelected: [true, false, false, false] // [ line, triangle, rectangle, circle ]
  },
  mounted() {
    this.canvas = document.getElementById("drawing-board");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 2;

    const rect = this.canvas.getBoundingClientRect();
    this.canvasDim.x = rect.left;
    this.canvasDim.y = rect.top;
  },
  methods: {
    onPan({ center, eventType }) {
      eventType === 2
        ? this.draw([center.x - this.canvasDim.x, center.y - this.canvasDim.y])
        : this.stopDrawing();
    },
    clearList() {
      this.listX = [];
      this.listY = [];
    },
    stopDrawing() {
      if (this.shapeSelected[0]) {
        const curr = [this.listX.shift(), this.listY.shift()];
        const dest = [this.listX.pop(), this.listY.pop()];
        this.createLine(curr, dest);
      } else if (this.shapeSelected[1]) {
      } else if (this.shapeSelected[2]) {
        const { min, max } = this.getMinAndMax();
        this.createRectangle(min, max);
      } else {
      }
      this.clearCanvas(true);
      this.drawShapes();
    },
    draw(pos) {
      this.curr = [...pos];

      if (this.listX.length > 1) {
        this.drawLine(this.prev, this.curr);
      }
      this.prev = [...this.curr];

      this.listX.push(this.curr[0]);
      this.listY.push(this.curr[1]);
    },
    clearCanvas(isRedrawing) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.clearList();

      if (!isRedrawing) this.shapes = [];
    },
    drawShapes() {
      for (let i = 0; i < this.shapes.length; i++) {
        const { type, coord } = this.shapes[i];
        switch (type) {
          case "line":
            this.drawLine(coord.curr, coord.dest);
            break;
          case "rect":
            this.ctx.fillRect(...coord);
            this.ctx.stroke();
            break;
        }
      }
    },
    drawLine(curr, dest) {
      this.ctx.beginPath();
      this.ctx.moveTo(curr[0], curr[1]);
      this.ctx.lineTo(dest[0], dest[1]);
      this.ctx.stroke();
    },
    createLine(curr, dest) {
      this.shapes.push({
        type: "line",
        coord: { curr, dest }
      });
    },
    createRectangle(min, max) {
      const width = max.x - min.x;
      const height = max.y - min.y;

      this.shapes.push({ type: "rect", coord: [min.x, min.y, width, height] });
    },
    getMinAndMax() {
      return {
        min: { x: Math.min(...this.listX), y: Math.min(...this.listY) },
        max: { x: Math.max(...this.listX), y: Math.max(...this.listY) }
      };
    }
  }
});
