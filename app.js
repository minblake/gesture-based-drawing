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
    curr: { x: 0, y: 0 },
    prev: { x: 0, y: 0 },
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
        ? this.draw({
            x: center.x - this.canvasDim.x,
            y: center.y - this.canvasDim.y
          })
        : this.stopDrawing();
    },
    clearList() {
      this.listX = [];
      this.listY = [];
    },
    stopDrawing() {
      this.createRectangle();
      this.clearCanvas(true);
      this.drawShapes();
    },
    draw(pos) {
      this.curr = { ...pos };

      if (this.listX.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prev.x, this.prev.y);
        this.ctx.lineTo(this.curr.x, this.curr.y);
        this.ctx.stroke();
      }
      this.prev = { ...this.curr };

      this.listX.push(this.curr.x);
      this.listY.push(this.curr.y);
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
          case "rect":
            this.ctx.fillRect(...coord);
            this.ctx.stroke();
        }
      }
    },
    createRectangle() {
      const maxX = Math.max(...this.listX);
      const minX = Math.min(...this.listX);
      const maxY = Math.max(...this.listY);
      const minY = Math.min(...this.listY);
      const width = maxX - minX;
      const height = maxY - minY;

      this.shapes.push({ type: "rect", coord: [minX, minY, width, height] });
    }
  }
});
