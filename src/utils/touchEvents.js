export const isHit = (noteObject, touch_x, touch_y) => {
  /**
   * take the XY coordinates of the touch,
   * then check to see if it's greater than the top and left sides of the note,
   * and less than the bottom and right sides of the note.
   * but we offset everything by half the rectangle's width and height
   * because our rectangle's centerpoint is at the center, not the top left.
   *
   * TODO: How is the centerpoint in the center and not the top left??
   */

  /**
   * returns true if
   *
   */

  if (
    touch_x > noteObject.x &&
    touch_x <= noteObject.x + noteObject.width &&
    touch_y > noteObject.y &&
    touch_y <= noteObject.y + noteObject.height

    // touch_x > noteObject.x - noteObject.width * 0.5 &&
    // touch_y > noteObject.y - noteObject.height * 0.5 &&
    // touch_x < noteObject.x + noteObject.width - noteObject.width * 0.5 &&
    // touch_y < noteObject.y + noteObject.height - noteObject.height * 0.5
  ) {
    return true;
  }
  return false;
};
