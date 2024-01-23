import { useEffect } from "react";
import "public/assets/css/note.css";

const noteCreator = ({ addNote }) => {
  var isMouseDown = false;
  var linesArray = [];
  let currentSize = 5;
  var currentColor = "#000000";
  var currentBg = "white";

  function colorChangeHandle(e) {
    currentColor = e.target.value;
  }

  useEffect(() => {
    // INITIAL LAUNCH
    var canvas = document.createElement("canvas");
    var body = document.getElementsByClassName("content")[0];
    var ctx = canvas.getContext("2d");

    createCanvas();

    // BUTTON EVENT HANDLERS
    document.getElementById("saveToImage").addEventListener(
      "click",
      function () {
        var jpegUrl = canvas.toDataURL("image/jpeg");

        console.log(jpegUrl);

        addNote(jpegUrl);

        // name of the file that gets downloaded
        // downloadCanvas(this, 'canvas', 'masterpiece.png');
      },
      false
    );

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

    // document
    //   .getElementById("textAlignBtn")
    //   .addEventListener("click", AlignCenter);

    // document
    //   .getElementById("InsertTextBtn")
    //   .addEventListener("click", InsertText);

    // CREATE CANVAS
    function createCanvas() {
      canvas.id = "canvas";
      canvas.width = window.innerWidth - 400;
      canvas.height = window.innerHeight - 150;
      canvas.style.zIndex = 8;
      canvas.style.position = "absolute";
      canvas.style.border = "1px solid";
      ctx.fillStyle = currentBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      body.appendChild(canvas);
    }

    // DOWNLOAD CANVAS
    function downloadCanvas(link, canvas, filename) {
      link.href = document.getElementById(canvas).toDataURL();
      link.download = filename;
    }

    // ERASER HANDLING
    function eraser() {
      currentSize = 5;
      currentColor = ctx.fillStyle;
    }

    // function AlignCenter() {
    //   ctx.textAlign = "center";
    //   // console.log("object");
    // }

    // function InsertText() {
    //   console.log("object");
    //   ctx.font = "30px Comic Sans MS";
    //   ctx.fillText("Hello World", canvas.width / 2, canvas.height / 2);
    // }

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
      console.log({ currentColor });
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
      <div id="sidebarNote" className="mt-5">
        <div className="colorButtons">
          <label>رنگ</label>
          <input
            type="color"
            id="colorpicker"
            defaultValue="#000000"
            className="colorpicker"
            onChange={colorChangeHandle}
          />
        </div>
        <div className="toolsButtons">
          <lable>ابزار</lable>
          <button id="eraser" className="btn btn-primary w-100">
            پاک کن
          </button>
          {/* <button id="textAlignBtn" className="btn btn-primary w-100">
            textAlign
          </button>
          <button id="InsertTextBtn" className="btn btn-primary w-100">
            InsertText
          </button> */}
          <button id="clear" className="btn btn-danger w-100">
            {" "}
            رفرش
          </button>
        </div>

        <div className="buttonSize">
          <lable>
            اندازه قلم (<span id="showSize">5</span>)
          </lable>
          <input
            type="range"
            min="1"
            max="50"
            defaultValue="5"
            step="1"
            id="controlSize"
          />
        </div>

        <div className="extra">
          <a id="saveToImage" className="btn btn-warning">
            ذخیره
          </a>
        </div>
      </div>
    </>
  );
};

export default noteCreator;
