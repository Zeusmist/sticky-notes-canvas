/* eslint-disable eqeqeq */
let ctx,
  drawPosition = { x: 0, y: 0 };

const setPosition = (e) => {
  drawPosition.x = e.layerX;
  drawPosition.y = e.layerY;
};

const toolAction = (e, type) => {
  // mouse must be pressed down
  if (e.buttons !== 1) return;
  const isPencil = type == "pencil";

  const color = isPencil ? "#000" : "#FFF";

  ctx.beginPath(); // begin
  ctx.lineWidth = isPencil ? 1 : 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;

  ctx.moveTo(drawPosition.x, drawPosition.y); // from
  setPosition(e);
  ctx.lineTo(drawPosition.x, drawPosition.y); // to
  ctx.stroke(); // draw it!
};

const draw = (e) => toolAction(e, "pencil");
const clean = (e) => toolAction(e, "eraser");

export const startToolDrag = (type, canvasContext) => {
  ctx = canvasContext;
  if (type == "pencil") document.addEventListener("mousemove", draw);
  if (type == "eraser") document.addEventListener("mousemove", clean);

  document.addEventListener("mousedown", setPosition);
  document.addEventListener("mouseenter", setPosition);
};

export const stopToolDrag = (type, canvasContext) => {
  ctx = canvasContext;
  if (type == "pencil") document.removeEventListener("mousemove", draw);
  if (type == "eraser") document.removeEventListener("mousemove", clean);

  document.removeEventListener("mousedown", setPosition);
  document.removeEventListener("mouseenter", setPosition);
};
