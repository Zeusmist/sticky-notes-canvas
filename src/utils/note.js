/* eslint-disable eqeqeq */
import reactDomServer from "react-dom/server";
import { X } from "react-feather";
import ColorPicker from "../components/ColorPicker";

export const colors = [
  { color: "yellow" },
  { color: "#E77601" },
  { color: "#C0C60A" },
  { color: "#E41D75" },
  { color: "#77F5F7" },
  { color: "#70E648" },
];

export const createNote = ({
  id,
  touchPosition,
  imageObj,
  onMouseDown,
  rootElement,
  onCreateNote,
  onDeleteNote,
  onChangeColor,
}) => {
  /**
   * Create a note using parameters passed,
   * Create note element, then add listener for touch,
   */

  const newNote = document.createElement("div");
  newNote.id = id;

  if (imageObj) {
    const newImage = document.createElement("img");
    newImage.src = imageObj.src;
    newImage.style.pointerEvents = "none";
    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newNote.appendChild(newImage);
  } else {
    newNote.className = "d-flex flex-column shadow rounded";
    newNote.style.backgroundColor = "yellow";
  }

  newNote.style.width = "200px";
  newNote.style.height = "200px";
  newNote.style.position = "absolute";
  newNote.style.left = touchPosition.x + "px";
  newNote.style.top = touchPosition.y + "px";

  newNote.addEventListener("mousedown", (e) => onMouseDown(e, id));
  rootElement.appendChild(newNote);

  if (!imageObj) {
    /* NOTE HEADER */
    const noteHeader = document.createElement("div");
    noteHeader.className = "d-flex justify-content-end m-1";
    noteHeader.style.height = "20px";

    /* COLOR BUTTON */
    const colorButton = document.createElement("div");
    colorButton.className = "dropdown";
    colorButton.innerHTML = reactDomServer.renderToStaticMarkup(
      <ColorPicker noteId={id} />
    );
    noteHeader.appendChild(colorButton);

    /* DELETE BUTTON */
    const deleteButton = document.createElement("div");
    deleteButton.className = "btn p-0";
    deleteButton.innerHTML = reactDomServer.renderToStaticMarkup(<X />);
    deleteButton.style.lineHeight = "1";
    deleteButton.onclick = () => onDeleteNote(id);
    noteHeader.appendChild(deleteButton);

    /* TEXTAREA */
    const noteBody = document.createElement("textarea");
    noteBody.style.border = "none";
    noteBody.style.backgroundColor = "transparent";
    noteBody.className = "form-control shadow-none";
    noteBody.style.flex = "1";

    newNote.appendChild(noteHeader);
    newNote.appendChild(noteBody);

    // Add onclick handler for colors here
    colors.forEach((colorObj) => {
      document.getElementById(id + colorObj.color).onclick = () =>
        onChangeColor(id, colorObj.color);
    });

    const colorContainers = document.getElementsByClassName("colorContainer");
    // Setting style here because bootstrap js overrides inline declaration
    Array.prototype.forEach.call(colorContainers, (el) => {
      el.style.minWidth = "130px";
    });
  }

  onCreateNote(newNote);
};

export const mouseDownOnNote = ({ e, selectedNote }) => {
  /* Register drag and drop listeners for note */

  if (selectedNote) {
    var x = selectedNote.offsetLeft - e.clientX,
      y = selectedNote.offsetTop - e.clientY;
    function drag(e) {
      selectedNote.style.left = e.clientX + x + "px";
      selectedNote.style.top = e.clientY + y + "px";
    }
    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  } else console.log("No selected note");
};
