let canvas;
let doodleClassifier;
let resultsDiv;
let storyDisplay;
let drawings = [];
let maxDrawings = 3;
let lastResult = "";
const apiKey = "AIzaSyAvutJ4bNHuyVwd26MSqAuuyqVg84m8M7M"; // Replace with your actual API key

function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent("#canvas");
  background(255);

  doodleClassifier = ml5.imageClassifier("DoodleNet", modelReady);

  select("#clearButton").mousePressed(clearCanvas);
  select("#saveButton").mousePressed(saveDrawing);
  select("#clearSavedButton").mousePressed(clearSavedDrawings);
  select("#generateStoryButton").mousePressed(generateStory);

  resultsDiv = select("#resultsDiv");
  storyDisplay = select("#storyDisplay");
}

function modelReady() {
  console.log("Model loaded");
  resultsDiv.html("Start drawing!");
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  lastResult = `${results[0].label} - ${nf(100 * results[0].confidence, 2, 1)}%`;
  label = `${results[0].label} `;
  console.log(label);
  resultsDiv.html(lastResult);
}
console.log(label);

async function generateStory() {
  console.log("Generating story...");

  if (!lastResult) {
    alert("Draw something first!");
    return;
  }

  try {
    storyDisplay.html("Generating description...");

   
    const prompt = `Write a very Creative Strony on : ${label}`; // You can change the prompt here

    const response = await fetch("/generateStory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate description.");
    }

    const description = await response.text(); 
    storyDisplay.html(description);
  } catch (error) {
    console.error("Error generating description:", error);
    storyDisplay.html("Failed to generate description. Please try again.");
  }
}

function clearCanvas() {
  background(255);
  resultsDiv.html("Canvas cleared. Start drawing!");
}

function saveDrawing() {
  if (drawings.length < maxDrawings) {
    let drawingImage = createImage(width, height);
    drawingImage.copy(canvas, 0, 0, width, height, 0, 0, width, height);

    drawings.push({ image: drawingImage, label: lastResult });
    displaySavedDrawings();
    clearCanvas();
  } else {
    alert("You have reached the maximum of 3 saved drawings.");
  }
}

function displaySavedDrawings() {
  let gallery = select("#savedDrawings");
  gallery.html("");

  drawings.forEach((drawing, index) => {
    drawing.image.resize(100, 100);
    let img = createImg(drawing.image.canvas.toDataURL(), `Saved Drawing ${index + 1}`);
    img.parent(gallery);
    img.style("margin-bottom", "10px");

    let label = createDiv(drawing.label);
    label.style("text-align", "center");
    label.style("font-size", "14px");
    label.parent(gallery);
  });
}

function clearSavedDrawings() {
  drawings = [];
  displaySavedDrawings();
}

function mouseReleased() {
  doodleClassifier.classify(canvas.elt, gotResults);
}

function draw() {
  strokeWeight(16);
  if (mouseIsPressed) line(mouseX, mouseY, pmouseX, pmouseY);
}
