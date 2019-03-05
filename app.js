new Vue({
  el: "#app",
  data: {
    canvas: null,
    ctx: null,
    x: { curr: 0, next: 0 },
    y: { curr: 0, next: 0 },
    listX: [],
    listY: [],
    shapeSelected: [false, false, false, false], // [ line, triangle, rectangle, circle ]
    isMouseDown: false
  },
  mounted() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.ctx.lineWidth = 2;
  },
  methods: {
    stopDrawing() {
      this.isMouseDown = false;
    },
    startDrawing(e) {
      this.isMouseDown = true;
      this.x.curr = e.offsetX;
      this.y.curr = e.offsetY;
    },
    draw(e) {
      if (this.isMouseDown) {
        this.x.next = e.offsetX;
        this.y.next = e.offsetY;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x.curr, this.y.curr);
        this.ctx.lineTo(this.x.next, this.y.next);
        this.ctx.stroke();

        this.x.curr = this.x.next;
        this.y.curr = this.y.next;

        this.listX.push(this.x.curr, this.x.next);
        this.listY.push(this.y.curr, this.y.next);
      }
    },
    clearCanvas(x, y, w, h) {
      this.ctx.clearRect(x, y, w, h);
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

      this.clearCanvas(minX, minY, width, height);
      this.ctx.fillRect(minX, minY, width, height);
      this.ctx.stroke();
    }
  }
});