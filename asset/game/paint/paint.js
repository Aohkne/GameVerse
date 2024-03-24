const canvas = document.getElementById("canvas");
const body = document.querySelector("body");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var theColor = '';
var lineW = 5;
let prevX = null;
let prevY = null;
let draw = false;

//set background for canvas
body.style.backgroundColor = "#FFFFFF";
var theInput = document.getElementById("favcolor");

theInput.addEventListener("input", function () {
    theColor = theInput.value;
    body.style.backgroundColor = theColor;

}, false);




//draw(width line)
const ctx = canvas.getContext("2d");
ctx.lineWidth = lineW;

document.getElementById("ageInputId").oninput = function () {
    draw = null;
    lineW = document.getElementById("ageInputId").value;
    document.getElementById("ageOutputId").innerHTML = lineW;
    ctx.lineWidth = lineW;
}

//set color - default
let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr;
    })

})

//set color - user chose
var choseColor = document.getElementById("choseColor");

choseColor.addEventListener("input", function () {
    Color = choseColor.value;
    ctx.strokeStyle = Color;

}, false);

//undo btn
let restore_array = [];
let index = -1;

let undoBtn = document.querySelector(".undo");

undoBtn.addEventListener("click", () => {
    if (index <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0);
    }
})

//clear btn
let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    restore_array = [];
    index = -1;
})

//save btn
let saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
    let data = canvas.toDataURL("imag/png");
    let a = document.createElement("a");
    a.href = data;
    a.download = "paint.png";
    a.click();
})

//draw:mouse
window.addEventListener("mousedown", (e) => draw = true);
window.addEventListener("mouseup", (e) => draw = false);



window.addEventListener("mousemove", (e) => {
    if (prevX == null || prevY == null || !draw) {
        prevX = e.clientX;
        prevY = e.clientY;
        return;
    }

    let currentX = e.clientX;
    let currentY = e.clientY;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    prevX = currentX;
    prevY = currentY;
    //store for undo
    restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
    //console.log(restore_array);
})
