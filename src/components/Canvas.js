/* eslint-disable eqeqeq */
import React from "react";
import {
  createNote,
  fetchSavedNotes,
  mouseDownOnNote,
  resetNotesStorage,
  saveNoteToStorage,
} from "../utils/note";
import {
  faTrash,
  faPencilAlt,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  reloadCanvas,
  saveCanvasToStorage,
  startToolDrag,
  stopToolDrag,
} from "../utils/canvas";

// OUT of Bounds when left is greater than canvas width - note width

const createOptions = [
  { type: "note", label: "New Note" },
  { type: "image", label: "New Image" },
];

let canvas, ctx;

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
    this.canvasRef = React.createRef();
    this.imageInputRef = React.createRef();
    this.state = {
      stickyNotes: [],
      canvasTools: [
        { type: "pencil", icon: faPencilAlt, onClick: this.activatePencil },
        { type: "eraser", icon: faEraser, onClick: this.activateEraser },
      ],
    };
  }

  async componentDidMount() {
    canvas = this.canvasRef.current;
    canvas.addEventListener("click", this.canvasClickListener, false); //Eventbubble
    ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    reloadCanvas(ctx);
    await this.loadSavedNotes();
  }

  loadSavedNotes = async () => {
    // load all previous notes saved in local storage
    const allSavedNotes = fetchSavedNotes();
    for (let i = 0; i < allSavedNotes.length; i++) {
      await this.handleCreateNote({ loadObj: allSavedNotes[i] });
    }
  };

  canvasClickListener = (e) => {
    /* Register the touch position */
    const touch_x = e.layerX;
    const touch_y = e.layerY;
    this.setState({ touchPosition: { x: touch_x, y: touch_y } });
    return;
  };

  handleMouseDownOnNote = (e, id) => {
    if (this.state.touchPosition) this.setState({ touchPosition: null });
    if (this.state.canvasTools.find((tool) => tool.isActive)) {
      // if any active canvas tool, deactivate it
      let updatedState = this.state.canvasTools;
      updatedState.forEach((t) => {
        t.isActive = false;
      });
      this.toggleTool("pencil", "eraser", false);
      this.toggleTool("eraser", "pencil", false);
      this.setState({ canvasTools: updatedState });
    }
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

  handleDeleteAll = () => {
    const { stickyNotes } = this.state;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stickyNotes.forEach((note) => {
      this.rootRef.current.removeChild(note);
    });
    this.setState({ stickyNotes: [] }, () => {
      resetNotesStorage();
      saveCanvasToStorage(canvas);
    });
  };

  handleOption = (type) => {
    const { touchPosition } = this.state;
    this.setState({ touchPosition: null }, () => {
      if (type == "note") this.handleCreateNote({ touchPosition });
      if (type == "image") this.createImage(touchPosition);
    });
  };

  handleCreateNote = async ({ touchPosition, imageObj, loadObj }) => {
    const { stickyNotes } = this.state;
    const id = new Date().toISOString();
    await createNote({
      loadObj,
      id,
      touchPosition,
      imageObj,
      onMouseDown: this.handleMouseDownOnNote,
      rootElement: this.rootRef.current,
      onCreateNote: (newNote) =>
        this.setState(
          {
            stickyNotes: [...stickyNotes, newNote],
          },
          () => {
            if (!loadObj) {
              // persist note here
              this.handleSaveNote(newNote, imageObj);
            }
          }
        ),
      onDeleteNote: this.deleteNote,
    });
  };

  handleSaveNote = (note, imgObj) => {
    const {
      id,
      style: { top, left, backgroundColor },
    } = note;
    const text = document.getElementById(`textarea-${id}`)?.value;
    saveNoteToStorage({
      id,
      top,
      left,
      backgroundColor,
      text,
      src: imgObj?.src,
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
          this.handleCreateNote({
            touchPosition,
            imageObj: { src: fr.result },
          });
        };
        fr.readAsDataURL(files[0]);
      }
    };

    setTimeout(() => {
      this.imageInputRef.current.click();
    });
  };

  activatePencil = () => {
    /* Change the active state of the tool to the opposite of current value */
    const updatedState = this.state.canvasTools;
    updatedState[0].isActive = !!!updatedState[0]?.isActive;
    updatedState[1].isActive = false;
    this.setState({ canvasTools: updatedState, touchPosition: null }, () => {
      this.toggleTool("pencil", "eraser", updatedState[0].isActive);
    });
  };

  activateEraser = () => {
    /* Change the active state of the tool to the opposite of current value */
    const updatedState = this.state.canvasTools;
    updatedState[0].isActive = false;
    updatedState[1].isActive = !!!updatedState[1]?.isActive;
    this.setState({ canvasTools: updatedState, touchPosition: null }, () => {
      this.toggleTool("eraser", "pencil", updatedState[1].isActive);
    });
  };

  toggleTool = (type, opposite, typeIsActive) => {
    if (typeIsActive) {
      stopToolDrag(opposite, ctx); //make sure previous tool is disbled first
      canvas.removeEventListener("click", this.canvasClickListener, false);
      startToolDrag(type, ctx, canvas);
    } else {
      canvas.addEventListener("click", this.canvasClickListener, false);
      stopToolDrag(type, ctx, canvas);
    }
  };

  render() {
    const { touchPosition, canvasTools } = this.state;
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
              backgroundColor: "#fff",
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

        {/* CANVAS TOOL OPTIONS */}
        <div
          className="d-flex flex-column"
          style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
        >
          <div
            className="btn btn-danger rounded-circle shadow-sm p-2 m-2"
            onClick={this.handleDeleteAll}
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </div>
          {canvasTools.map((tool, i) => (
            <div
              key={i}
              className={`btn btn-outline-secondary rounded-circle shadow-sm p-2 m-2 ${
                tool.isActive ? "active" : ""
              }`}
              onClick={tool.onClick}
            >
              <FontAwesomeIcon icon={tool.icon} size="lg" />
            </div>
          ))}
        </div>

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
