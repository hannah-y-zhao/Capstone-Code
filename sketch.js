// Machine Learning for Creative Coding
// https://github.com/shiffman/ML-for-Creative-Coding
let video;
let depthResult;
let depthEstimation;
let results;
let imgContainer = document.getElementById("container");
let canvas;
let savedItArr = [];
let templog = document.getElementById("templog");
let page1 = document.getElementById("page1");
let canvasEl;
let currentWord, currentDictSection;
let currentClick = 0;
let pg2 = document.getElementById("page2");

async function setup() {
  // Create canvas and set up video capture with constraints
  if (currentPage == 1) {
    canvas = createCanvas(640, 400);
    canvas.id("canvas");
    canvasEl = document.getElementById("canvas");
    pg2.appendChild(canvasEl);
    video = createCapture(VIDEO);
    video.hide();
    console.log("workd");

    video.size(1920, 1200); //1280 x 720 pixels

    // Load the Transformers.js model pipeline with async/await
    let pipeline = await loadTransformers();

    let options = {
      device: "webgpu",
      dtype: "fp16",
      progress_callback: logProgress,
    };

    // Initialize the depth estimation model
    depthEstimation = await pipeline(
      "depth-estimation",
      "onnx-community/depth-anything-v2-small",
      options
    );
    currentWord = document.getElementById("word").innerHTML =
    localStorage.getItem("word");
  getFirebase((data) => {
    currentData = data.database;
    console.log(currentData);
    for (let i = 0; i < currentData.length; i++) {
      if (currentWord == currentData[i].word) {
        currentDictSection = i;
        console.log(currentDictSection)
        return;
      }
    }
  });
  }
}

function draw() {
  // Draw the video on the canvas
  if (currentPage == 2) {
    image(video, 0, 0, video.width / 3, video.height / 3);

    // If depth results are available, visualize them using pixel manipulation
    if (results) {
      const { depth } = results;

      // Create an image to store the depth visualization
      let depthImg = createImage(depth.width, depth.height);

      // Load pixels of the depth image for manipulation
      depthImg.loadPixels();

      // Loop through each row of the depth map
      for (let y = 0; y < depth.height; y++) {
        // Loop through each column of the depth map
        for (let x = 0; x < depth.width; x++) {
          // Calculate the 1D array index from 2D coordinates
          let index = x + y * depth.width;

          // Get the depth value for the current pixel
          let depthValue = depth.data[index];

          // Calculate the corresponding pixel index in the depth image
          let pixelIndex = index * 4;

          if (depthValue <= 180) {
            depthImg.pixels[pixelIndex] = 0;
            depthImg.pixels[pixelIndex + 1] = 0;
            depthImg.pixels[pixelIndex + 2] = 0;

            // Set the alpha value to fully opaque
            depthImg.pixels[pixelIndex + 3] = 255;
          } else {
            // Set the RGB values to the depth value for a grayscale effect
            depthImg.pixels[pixelIndex] = depthValue;
            depthImg.pixels[pixelIndex + 1] = depthValue;
            depthImg.pixels[pixelIndex + 2] = depthValue;

            // Set the alpha value to fully opaque
            depthImg.pixels[pixelIndex + 3] = 255;
          }
        }
      }
    

    // Update the pixels of the depth image
    depthImg.updatePixels();
    fill(0, 0, 0);
    rect(0, 0, 640, 480);
    // Draw the depth image on the canvas
    image(depthImg, 0, 0, width, height);
    let currentURL = canvasEl.toDataURL();
    console.log(currentURL)
    toFirebase(currentDictSection, currentURL, "");
    let newimg = document.createElement("img");
    newimg.src = currentURL;

    noLoop();
  }
}
}

function page3(){
    currentWord = document.getElementById("word")
    currentWord.innerHTML=localStorage.getItem("word");
    getFirebase((data) => {
        currentData = data.database;
        for(let i=0;i<currentData.length;i++){
            if(currentData[i].urls){
                let keys=Object.keys(currentData[i].urls)
                keys.forEach(key => {
                    const value = currentData[i].urls[key];
                    console.log(`Key: ${key}, Value: ${value}`);
                    let newimg=document.createElement("img")
                    newimg.src=value
                    newimg.classList.add("absolute")
                    newimg.classList.add("top-[20px]")
                    newimg.classList.add("left-[20px]")
                    document.getElementById("container").appendChild(newimg)
                  });
            }
        }
    })
}

async function estimateDepth() {
  results = await depthEstimation(video.canvas.toDataURL());
}

function logProgress(progress) {
  console.log(`loading model: ${progress.status} ${progress.progress || ""}`);
}

function keyTyped() {
  if (key === " " || key === " ") {
    if (currentClick == 1) {
      estimateDepth();
    }
    currentClick++
  }
  return false;
}

window.addEventListener("load", () => {
  
});
