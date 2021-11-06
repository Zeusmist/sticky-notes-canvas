export default class TouchTracker {
  // canvas: html canvas element
  // touchEventHandler: callback used to handle touch events
  constructor(canvas, touchEventHandler) {
    this.canvas = canvas;
    this.touchEventHandler = touchEventHandler;
  }

  processEvent = (evt) => {
    // returns the postion of the touch event

    const rect = this.canvas.getBoundingClientRect();
    const offsetTop = rect.top;
    const offsetLeft = rect.left;

    if (evt.touches) {
      // for mobile devices
      // index 0 for the first or only finger
      return {
        x: evt.touches[0].clientX - offsetLeft,
        y: evt.touches[0].clientY - offsetTop,
      };
    } else {
      return {
        x: evt.clientX - offsetLeft,
        y: evt.clientY - offsetTop,
      };
    }
  };

  onDown = (evt) => {
    evt.preventDefault();
    const coords = this.processEvent(evt);
    this.touchEventHandler("down", coords.x, coords.y);
  };

  onUp = (evt) => {
    evt.preventDefault();
    this.touchEventHandler("up");
  };

  onMove = (evt) => {
    evt.preventDefault();
    const coords = this.processEvent(evt);
    this.touchEventHandler("move", coords.x, coords.y);
  };

  setEvents = () => {
    // set event handlers for the canvas element
    this.canvas.ontouchmove = this.onMove;
    this.canvas.onmousemove = this.onMove;
    this.canvas.ontouchstart = this.onDown;
    this.canvas.onmousedown = this.onDown;
    this.canvas.ontouchend = this.onUp;
    this.canvas.onmouseup = this.onUp;
  };
}
