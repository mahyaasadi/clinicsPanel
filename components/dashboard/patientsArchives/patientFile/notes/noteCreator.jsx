import { useEffect } from "react";
import { Tooltip } from "primereact/tooltip";

const NoteCreator = ({ show, onHide, ClinicID, addNote }) => {
  var isMouseDown = false;
  var linesArray = [];
  let currentSize = 5;
  var currentColor = "#000000";
  var currentBg = "white";

  const handleColorChange = (e) => (currentColor = e.target.value);
  const handleFontSize = (e) => (currentSize = e.target.value);

  useEffect(() => {
    // INITIAL LAUNCH
    var canvas = document.createElement("canvas");
    var body = document.getElementsByClassName("noteContent")[0];
    var ctx = canvas.getContext("2d");

    createCanvas();

    // BUTTON EVENT HANDLERS
    document.getElementById("saveToImage").addEventListener(
      "click",
      function () {
        var jpegUrl = canvas.toDataURL("image/jpeg");

        addNote(jpegUrl);
      },
      false
    );

    document
      .getElementById("saveToImage")
      .addEventListener("click", function () { });

    document.getElementById("eraser").addEventListener("click", eraser);
    document.getElementById("clear").addEventListener("click", createCanvas);

    // DRAWING EVENT HANDLERS
    canvas.addEventListener("mousedown", function () {
      mousedown(canvas, event);
    });
    canvas.addEventListener("mousemove", function () {
      mousemove(canvas, event);
    });
    canvas.addEventListener("mouseup", mouseup);

    // CREATE CANVAS
    function createCanvas() {
      canvas.id = "canvas";
      canvas.width = window.innerWidth - 200;
      canvas.height = window.innerHeight - 150;
      canvas.style.zIndex = 8;
      canvas.style.position = "absolute";
      canvas.style.border = "1px solid";
      ctx.fillStyle = currentBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      body.appendChild(canvas);
    }

    // ERASER HANDLING
    function eraser() {
      currentSize = 5;
      currentColor = ctx.fillStyle;
    }

    // GET MOUSE POSITION
    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    }

    // ON MOUSE DOWN
    function mousedown(canvas, evt) {
      var mousePos = getMousePos(canvas, evt);
      isMouseDown = true;
      var currentPosition = getMousePos(canvas, evt);
      ctx.moveTo(currentPosition.x, currentPosition.y);
      ctx.beginPath();
      ctx.lineWidth = currentSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = currentColor;
    }

    // ON MOUSE MOVE
    function mousemove(canvas, evt) {
      if (isMouseDown) {
        var currentPosition = getMousePos(canvas, evt);
        ctx.lineTo(currentPosition.x, currentPosition.y);
        ctx.stroke();
        store(currentPosition.x, currentPosition.y, currentSize, currentColor);
      }
    }

    // STORE DATA
    function store(x, y, s, c) {
      var line = {
        x: x,
        y: y,
        size: s,
        color: c,
      };
      linesArray.push(line);
    }

    // ON MOUSE UP
    function mouseup() {
      isMouseDown = false;
      store();
    }
  }, []);

  return (
    <>
      <div className="noteContent"></div>

      <div id="sidebarNote">
        <div className="colorButtons mt-1" data-pr-position="left">
          <input
            type="color"
            id="colorpicker"
            defaultValue="#000000"
            className="colorpicker"
            onChange={handleColorChange}
          />
          <Tooltip target=".colorButtons">رنگ</Tooltip>
        </div>

        <button
          id="eraser"
          className="btn btn-outline-light d-flex align-items-center justify-center eraserBtn w-65"
          data-pr-position="left"
        >
          <svg
            height="18px"
            width="20px"
            preserveAspectRatio="xMidYMid meet"
            version="1.0"
            viewBox="0 0 256.000000 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              fill="#000000"
              stroke="none"
              transform="translate(0.000000,145) scale(0.100000,-0.100000)"
            >
              <path d="M1523 2381 c-44 -28 -663 -641 -879 -871 -98 -105 -196 -217 -217 -248 -66 -99 -310 -605 -341 -708 -8 -27 27 -63 107 -110 220 -129 721 -303 808 -281 29 7 771 727 984 953 143 153 153 167 227 305 128 240 258 536 258 586 0 65 -153 158 -456 277 -272 107 -427 138 -491 97z m268 -117 c126 -40 432 -156 492 -186 43 -21 61 -56 48 -91 -5 -13 -88 -92 -184 -175 -96 -83 -213 -188 -260 -232 -102 -96 -138 -114 -202 -100 -134 30 -571 193 -619 231 -18 14 -26 30 -26 51 0 26 19 51 123 155 130 133 292 280 377 344 67 50 100 51 251 3z m519 -439 c0 -54 -191 -452 -250 -520 -23 -27 -122 -135 -218 -238 -197 -212 -238 -243 -261 -199 -12 23 49 211 111 342 39 81 52 96 292 339 270 272 326 320 326 276z m-640 -475 c-27 -50 -123 -150 -239 -250 -70 -60 -133 -121 -140 -137 -8 -15 -30 -77 -51 -138 -81 -238 -213 -569 -236 -595 -40 -43 -25 26 67 305 54 165 104 328 110 362 15 78 1 104 -68 127 -26 9 -166 64 -310 123 -207 84 -263 111 -263 125 0 21 8 22 47 7 118 -46 622 -199 654 -199 55 0 71 10 259 159 91 72 168 131 173 131 4 0 3 -9 -3 -20z" />
            </g>
          </svg>
          <Tooltip target=".eraserBtn">پاک کن</Tooltip>
        </button>

        <button
          id="clear"
          className="btn btn-outline-light d-flex align-items-center justify-center refreshBtn w-65"
          data-pr-position="left"
        >
          <svg
            height="18px"
            width="20px"
            data-name="Layer 1"
            id="Layer_1"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M218.39,320.61,246.77,349H157a93,93,0,0,1,0-186h18V133H157a123,123,0,0,0,0,246h89.77l-28.38,28.38,21.22,21.23L304.22,364l-64.61-64.61Z" />
            <path d="M355,133H265.23l28.38-28.38L272.39,83.39,207.78,148l64.61,64.61,21.22-21.22L265.23,163H355a93,93,0,0,1,0,186H336.44v30H355a123,123,0,0,0,0-246Z" />
          </svg>
          <Tooltip target=".refreshBtn">رفرش</Tooltip>
        </button>

        <div className="buttonSize w-65 py-1" data-pr-position="left">
          <input
            type="range"
            min="1"
            max="50"
            defaultValue="5"
            step="1"
            id="controlSize"
            className="rangeInputBtn"
            onChange={handleFontSize}
          />
          <Tooltip target=".buttonSize">اندازه قلم</Tooltip>
        </div>

        <button
          id="saveToImage"
          className="btn btn-sm btn-outline-primary  w-65 height-32"
        >
          ذخیره
        </button>
      </div>
    </>
  );
};

export default NoteCreator;
