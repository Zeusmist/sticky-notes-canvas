import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../utils/note";

const ColorPicker = (props) => {
  return (
    <>
      <button
        className="btn p-0 dropdown-toggle"
        type="button"
        id="colorBtn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <FontAwesomeIcon icon={faPalette} />
      </button>
      <div
        className="dropdown-menu"
        aria-labelledby="colorBtn"
        id="colorContainer"
      >
        <div className="d-flex flex-wrap" style={{ maxWidth: "95px" }}>
          {colors.map((c, i) => (
            <div
              key={i}
              id={props.noteId + c.color}
              className="dropdown-item rounded"
              style={{
                backgroundColor: c.color,
                width: "20px",
                height: "20px",
                cursor: "pointer",
                margin: "5px",
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
