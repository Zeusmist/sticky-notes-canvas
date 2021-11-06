/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import StickyNote from "../Models/StickyNote";
import TouchTracker from "../Models/TouchTracker";
import { isHit } from "../utils/touchEvents";

const createOptions = [
  { type: "note", label: "New Note" },
  { type: "image", label: "New Image" },
];

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
    this.canvasRef = React.createRef();
    this.state = {
      stickyNotes: [],
    };
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    canvas.addEventListener("click", this.canvasClickListener, false);
  }

  canvasClickListener = (e) => {
    /* Register the touch position */
    const touch_x = e.clientX;
    const touch_y = e.clientY;
    this.setState({ touchPosition: { x: touch_x, y: touch_y } });
    return;
  };

  mouseDownOnNote = (e, id) => {
    /* Register drag and drop listeners for note */
    const { stickyNotes } = this.state;
    const selectedNote = stickyNotes.find((n) => n.id == id);
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
    } else
      console.log("No selected note", { current_stickyNotes: stickyNotes });
  };

  deleteNote = (id) => {
    const { stickyNotes } = this.state;
    const selectedNoteIndex = stickyNotes.findIndex((n) => n.id == id);
    if (selectedNoteIndex > -1) {
      this.rootRef.current.removeChild(stickyNotes[selectedNoteIndex]);
      const updatedNotes = stickyNotes.filter((n) => n.id != id);
      this.setState({
        stickyNotes: updatedNotes,
      });
    }
  };

  handleDeleteAll = () => {
    const { stickyNotes } = this.state;
    stickyNotes.forEach((note) => {
      this.rootRef.current.removeChild(note);
    });
    this.setState({ stickyNotes: [] });
  };

  handleOption = (type) => {
    const { touchPosition } = this.state;
    this.setState({ touchPosition: null }, () => {
      if (type == "note") {
        this.createNote(touchPosition);
      }

      if (type == "image") {
      }
    });
  };

  createNote = (touchPosition) => {
    /**
     * Add a new note and save in state
     */
    const { stickyNotes } = this.state;
    const id = stickyNotes.length + 1;

    const newNote = document.createElement("div");
    newNote.id = id;
    newNote.className = "d-flex flex-column shadow rounded";
    newNote.style.backgroundColor = "yellow";
    newNote.style.width = "200px";
    newNote.style.height = "200px";
    newNote.style.position = "absolute";

    newNote.addEventListener("mousedown", (e) => this.mouseDownOnNote(e, id));
    this.rootRef.current.appendChild(newNote);
    newNote.style.left = touchPosition.x + "px";
    newNote.style.top = touchPosition.y + "px";

    this.setState(
      {
        stickyNotes: [...stickyNotes, newNote],
      },
      () => {
        const noteHeader = document.createElement("div");
        noteHeader.className = "d-flex justify-content-end m-1";
        const deleteButton = document.createElement("div");
        deleteButton.className = "btn p-0";
        deleteButton.innerHTML = "x";
        deleteButton.style.lineHeight = "1";
        deleteButton.onclick = () => this.deleteNote(id);
        noteHeader.appendChild(deleteButton);
        noteHeader.style.height = "20px";
        const noteBody = document.createElement("textarea");
        noteBody.style.border = "none";
        noteBody.className = "form-control shadow-none";
        noteBody.style.flex = "1";

        newNote.appendChild(noteHeader);
        newNote.appendChild(noteBody);
      }
    );
  };

  render() {
    const { touchPosition, stickyNotes } = this.state;
    return (
      <div
        ref={this.rootRef}
        className="container-fluid p-0"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <canvas ref={this.canvasRef} className="border border-5 w-100"></canvas>

        {touchPosition && (
          <div
            className="rounded shadow p-2 text-start"
            style={{
              position: "absolute",
              top: touchPosition.y,
              left: touchPosition.x,
            }}
          >
            {createOptions.map((option, i) => (
              <div
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() => this.handleOption(option.type)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}

        {stickyNotes.length > 0 && (
          <div
            className="btn btn-sm btn-danger"
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
            onClick={this.handleDeleteAll}
          >
            Clear All
          </div>
        )}
      </div>
    );
  }
}

export default Canvas;
