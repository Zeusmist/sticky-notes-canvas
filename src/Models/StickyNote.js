export default class StickyNote {
  constructor(color) {
    this.x = 50;
    this.y = 50;
    this.width = 100;
    this.height = 100;
    this.isDragging = false;
    this.color = color ?? "#2793ef";
  }

  render = (ctx, cnt) => {
    ctx.save(); // why this?

    ctx.beginPath();
    ctx.rect(
      // this.x - this.width * 0.5,
      // this.y - this.height * 0.5,
      this.x,
      this.y,
      this.width,
      this.height
    );
    ctx.fillStyle = this.color; // choose color
    ctx.fill(); // play with this

    ctx.restore(); // why this?
  };
}

// export default function StickyNote(x, y, color) {
//   this.x = x;
//   this.y = y;
//   this.width = 100;
//   this.height = 100;
//   this.isDragging = false;
//   this.color = color ?? "#2793ef";

//   this.render = (ctx, cnt) => {
//     console.log("rendered at position ", cnt);

//     ctx.save(); // why this?

//     ctx.beginPath();
//     ctx.rect(
//       this.x - this.width * 0.5,
//       this.y - this.height * 0.5,
//       this.width,
//       this.height
//     );
//     ctx.fillStyle = this.color; // choose color
//     ctx.fill(); // play with this

//     ctx.restore(); // why this?
//   };
// }
