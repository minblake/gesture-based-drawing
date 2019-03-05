// Vue.component("DrawingBoard", {
//   template: `
//     <canvas
//       id="canvas"
//       :width="w"
//       :height="h"
//       @mousedown="startDrawing"
//       @mousemove="draw"
//       @mouseup="stopDrawing"
//       @mouseout="stopDrawing"
//     >
//     </canvas>`,
//   props: ["w", "h"],
//   data() {
//     return {
//       canvas: null,
//       ctx: null,
//       x: { curr: 0, next: 0 },
//       y: { curr: 0, next: 0 },
//       isMouseDown: false
//     };
//   },
//   mounted() {
//     this.canvas = document.querySelector("#canvas");
//     this.ctx = canvas.getContext("2d");
//     this.ctx.lineWidth = 2;
//   },
//   methods: {
//     hello() {
//       console.log("event trigger");
//     },
//     stopDrawing() {
//       this.isMouseDown = false;
//     },
//     startDrawing(e) {
//       this.isMouseDown = true;
//       this.x.curr = e.offsetX;
//       this.y.curr = e.offsetY;
//     },
//     draw(e) {
//       if (this.isMouseDown) {
//         this.x.next = e.offsetX;
//         this.y.next = e.offsetY;
//         this.ctx.beginPath();
//         this.ctx.moveTo(this.x.curr, this.y.curr);
//         this.ctx.lineTo(this.x.next, this.y.next);
//         this.ctx.stroke();
//         this.x.curr = this.x.next;
//         this.y.curr = this.y.next;
//       }
//     }
//   }
// });

new Vue({
  el: "#app",
  data: {
    canvas: null,
    ctx: null,
    x: { curr: 0, next: 0 },
    y: { curr: 0, next: 0 },
    isMouseDown: false
  },
  mounted() {
    this.canvas = document.querySelector("#canvas");
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
      }
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, 300, 500);
    }
  }
});
