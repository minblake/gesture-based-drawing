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
    next: { x: 0, y: 0 },
    curr: { x: 0, y: 0 },
    listX: [],
    listY: [],
    state: [],
    shapeSelected: [true, false, false, false] // [ line, triangle, rectangle, circle ]
    // isTouching: false
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
    stopDrawing() {
      console.log("stop");
      // this.isTouching = false;
      // this.drawRectangle();
    },
    draw(pos) {
      this.next = { ...pos };

      if (this.listX.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.curr.x, this.curr.y);
        this.ctx.lineTo(this.next.x, this.next.y);
        this.ctx.stroke();
      }
      this.curr = { ...this.next };

      this.listX.push(this.next.x);
      this.listY.push(this.next.y);
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.listX = [];
      this.listY = [];
    },
    drawRectangle() {
      const maxX = Math.max(...this.listX);
      const minX = Math.min(...this.listX);
      const maxY = Math.max(...this.listY);
      const minY = Math.min(...this.listY);
      const width = maxX - minX;
      const height = maxY - minY;

      console.log(this.listX);
      this.clearCanvas();
      this.ctx.fillRect(minX, minY, width, height);
      this.ctx.stroke();
    }
  }
});
