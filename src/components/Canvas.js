/* eslint-disable eqeqeq */
import React from "react";
import { createNote, mouseDownOnNote } from "../utils/note";

// OUT of Bounds when left is greater than canvas width - note width

const createOptions = [
  { type: "note", label: "New Note" },
  { type: "image", label: "New Image" },
];

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
    this.canvasRef = React.createRef();
    this.imageInputRef = React.createRef();
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

  handleMouseDownOnNote = (e, id) => {
    if (this.state.touchPosition) this.setState({ touchPosition: null });
    const { stickyNotes } = this.state;
    const selectedNote = stickyNotes.find((n) => n.id == id);

    /* Register drag and drop listeners for note */
    mouseDownOnNote({ e, selectedNote });
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

  changeNoteColor = (id, color) => {
    const { stickyNotes } = this.state;
    const selectedNoteIndex = stickyNotes.findIndex((n) => n.id == id);
    if (selectedNoteIndex > -1)
      stickyNotes[selectedNoteIndex].style.backgroundColor = color;
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
      if (type == "note") this.handleCreateNote(touchPosition);
      if (type == "image") this.createImage(touchPosition);
    });
  };

  handleCreateNote = (touchPosition, imageObj) => {
    const { stickyNotes } = this.state;
    const id = stickyNotes.length + 1;
    createNote({
      id,
      touchPosition,
      imageObj,
      onMouseDown: this.handleMouseDownOnNote,
      rootElement: this.rootRef.current,
      onCreateNote: (newNote) =>
        this.setState({
          stickyNotes: [...stickyNotes, newNote],
        }),
      onChangeColor: this.changeNoteColor,
      onDeleteNote: this.deleteNote,
    });
  };

  createImage = (touchPosition) => {
    /**
     * Set the onchange prop of input field in order to receive the file.
     * then click the input.
     * Use the image file is received, use it to create a new note.
     */
    this.imageInputRef.current.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        const fr = new FileReader();
        fr.onload = () => {
          this.handleCreateNote(touchPosition, { src: fr.result });
        };
        fr.readAsDataURL(files[0]);
      }
    };

    setTimeout(() => {
      this.imageInputRef.current.click();
    });
  };

  render() {
    const { touchPosition, stickyNotes } = this.state;
    return (
      <div
        ref={this.rootRef}
        className="container-fluid p-0"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* CANVAS */}
        <canvas
          ref={this.canvasRef}
          className="w-100"
          style={{ border: "5px solid #a5a8aa" }}
        ></canvas>

        {/* NOTE TYPES MENU */}
        {touchPosition && (
          <div
            className="rounded shadow p-2 text-start"
            style={{
              position: "absolute",
              top: touchPosition.y + "px",
              left: touchPosition.x + "px",
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

        {/* CANVAS OPTIONS */}
        {stickyNotes.length > 0 && (
          <div
            className="btn btn-sm btn-danger"
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
            onClick={this.handleDeleteAll}
          >
            Clear All
          </div>
        )}

        {/* IMAGE INPUT */}
        <input
          ref={this.imageInputRef}
          type="file"
          accept="image/*"
          className="visually-hidden"
        />
      </div>
    );
  }
}

export default Canvas;
