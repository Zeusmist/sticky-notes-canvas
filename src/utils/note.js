/* eslint-disable eqeqeq */
import reactDomServer from "react-dom/server";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColorPicker from "../components/ColorPicker";

export const localStorage_notes = "ls_notes_david_obidu";

export const colors = [
  { color: "yellow" },
  { color: "#E77601" },
  { color: "#C0C60A" },
  { color: "#E41D75" },
  { color: "#77F5F7" },
  { color: "#70E648" },
];

export const createNote = async ({
  loadObj,
  id,
  touchPosition,
  imageObj,
  onMouseDown,
  rootElement,
  onCreateNote,
  onDeleteNote,
}) => {
  /**
   * Create a note using parameters passed,
   * Create note element, then add listener for touch,
   */

  if (loadObj?.id) id = loadObj?.id;

  const newNote = document.createElement("div");

  newNote.id = id;

  if (loadObj?.src || imageObj) {
    const newImage = document.createElement("img");
    newImage.src = loadObj?.src ?? imageObj.src;
    newImage.style.pointerEvents = "none";
    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newNote.appendChild(newImage);
  } else {
    newNote.className = "d-flex flex-column shadow rounded";
    newNote.style.backgroundColor = loadObj?.backgroundColor ?? "yellow";
  }

  newNote.style.width = "200px";
  newNote.style.height = "200px";
  newNote.style.position = "absolute";
  newNote.style.left = loadObj?.left ?? touchPosition.x + "px";
  newNote.style.top = loadObj?.top ?? touchPosition.y + "px";

  newNote.addEventListener("mousedown", (e) => onMouseDown(e, id));
  rootElement.appendChild(newNote);

  if (!loadObj?.src && !imageObj) {
    /* NOTE HEADER */
    const noteHeader = document.createElement("div");
    noteHeader.className = "d-flex justify-content-end align-items-center m-1";
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
    deleteButton.className = "btn p-0 ms-1";
    deleteButton.innerHTML = reactDomServer.renderToStaticMarkup(
      <FontAwesomeIcon icon={faTimes} />
    );
    deleteButton.onclick = () => {
      onDeleteNote(id);
      deleteNoteFromStorage(id);
    };
    noteHeader.appendChild(deleteButton);

    /* TEXTAREA */
    const noteBody = document.createElement("textarea");
    noteBody.id = `textarea-${id}`;
    noteBody.defaultValue = loadObj?.text ?? "";
    noteBody.oninput = (e) => {
      updateSavedNote(id, { text: e.target.value });
    };
    noteBody.className = "form-control shadow-none";
    noteBody.placeholder = "Write a note...";
    noteBody.style.border = "none";
    noteBody.style.backgroundColor = "transparent";
    noteBody.style.flex = "1";

    newNote.appendChild(noteHeader);
    newNote.appendChild(noteBody);

    // Add onclick handler for colors here
    colors.forEach((colorObj) => {
      document.getElementById(id + colorObj.color).onclick = () => {
        newNote.style.backgroundColor = colorObj.color;
        updateSavedNote(id, { backgroundColor: colorObj.color });
      };
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
      const top = e.clientY + y + "px";
      const left = e.clientX + x + "px";
      selectedNote.style.left = left;
      selectedNote.style.top = top;
      updateSavedNote(selectedNote.id, { top, left });
    }
    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  } else console.log("No selected note");
};

const saveAllNotesToStorage = (allNotes) => {
  window.localStorage.setItem(
    localStorage_notes,
    JSON.stringify([...allNotes])
  );
};

const updateSavedNote = (id, updateData) => {
  let allNotes = fetchSavedNotes();
  const noteIndex = allNotes.findIndex((n) => n.id == id);
  if (noteIndex > -1) {
    allNotes[noteIndex] = { ...allNotes[noteIndex], ...updateData };
  }
  saveAllNotesToStorage(allNotes);
};

const deleteNoteFromStorage = (id) => {
  let allNotes = fetchSavedNotes();
  allNotes = allNotes.filter((n) => n.id != id);
  saveAllNotesToStorage(allNotes);
};

export const saveNoteToStorage = (noteObj) => {
  /**
   * Get all saved notes
   * Check saved notes for note with same id
   * if note with same id is found, replace index with new/updated note,
   * else add new note to end of all notes array
   * then save all notes to localStorage
   */
  let allNotes = fetchSavedNotes();
  const duplicateIdIndex = allNotes.findIndex((n) => n.id == noteObj.id);
  if (duplicateIdIndex > -1) {
    // allNotes = allNotes.filter((n) => n.id != noteObj.id);
    allNotes[duplicateIdIndex] = noteObj;
  } else allNotes = [...allNotes, noteObj];

  saveAllNotesToStorage(allNotes);
};

export const fetchSavedNotes = () => {
  return JSON.parse(window.localStorage.getItem(localStorage_notes)) ?? [];
};

export const resetNotesStorage = () => {
  window.localStorage.setItem(localStorage_notes, JSON.stringify([]));
};
