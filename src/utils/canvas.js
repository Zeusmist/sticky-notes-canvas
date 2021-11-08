/* eslint-disable eqeqeq */
let canvas,
  ctx,
  drawPosition = { x: 0, y: 0 };

const localStorage_canvas = "ls_canvas_david_obidu";

const setPosition = (e) => {
  drawPosition.x = e.layerX;
  drawPosition.y = e.layerY;
};

export const saveCanvasToStorage = (_canvas) => {
  const imageBase64String = _canvas ? _canvas.toDataURL() : canvas.toDataURL();
  window.localStorage.setItem(
    localStorage_canvas,
    JSON.stringify(imageBase64String)
  );
};

export const reloadCanvas = (context) => {
  const savedCanvas = JSON.parse(
    window.localStorage.getItem(localStorage_canvas)
  );
  if (savedCanvas) {
    var img = new window.Image();
    img.addEventListener("load", function () {
      context.drawImage(img, 0, 0);
    });
    img.setAttribute("src", savedCanvas);
  }
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
  saveCanvasToStorage();
};

const draw = (e) => toolAction(e, "pencil");
const clean = (e) => toolAction(e, "eraser");

export const startToolDrag = (type, canvasContext, _canvas) => {
  canvas = _canvas;
  ctx = canvasContext;
  if (type == "pencil") document.addEventListener("mousemove", draw);
  if (type == "eraser") document.addEventListener("mousemove", clean);

  document.addEventListener("mousedown", setPosition);
  document.addEventListener("mouseenter", setPosition);
};

export const stopToolDrag = (type, canvasContext, _canvas) => {
  canvas = _canvas;
  ctx = canvasContext;
  if (type == "pencil") document.removeEventListener("mousemove", draw);
  if (type == "eraser") document.removeEventListener("mousemove", clean);

  document.removeEventListener("mousedown", setPosition);
  document.removeEventListener("mouseenter", setPosition);
};
