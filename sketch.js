// Machine Learning for Creative Coding
// https://github.com/shiffman/ML-for-Creative-Coding
let video;
let depthResult;
let depthEstimation;
let results;
let imgContainer=document.getElementById("container")
let canvas;
let savedItArr=[]
let templog=document.getElementById("templog")
let page1=document.getElementById("page1")

async function setup() {
  // Create canvas and set up video capture with constraints
  canvas = createCanvas(640, 400);
  canvas.id("testcanvas");
  video = createCapture(VIDEO);
  video.hide();
  console.log("workd")

  video.size(1280, 720); //1280 x 720 pixels

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
  // Start processing the video for depth estimation
  processVideo();
}

function draw() {
  // Draw the video on the canvas
  image(video, 0, 0);

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
  }
}

// Asynchronous function to continuously process video frames
async function processVideo() {
  // Convert video frame to data URL and run depth estimation
  results = await depthEstimation(video.canvas.toDataURL());
  // console.log(results.depth.data[0])

  // Recursively call processVideo() to keep processing frames
  await processVideo();
}

function logProgress(progress) {
  console.log(`loading model: ${progress.status} ${progress.progress || ""}`);
}

function keyTyped() {
    // if(currentPage==1){
        console.log("typed");
        if (key === "s" || key === "S") {
          let canvasEl = document.getElementById("testcanvas");
          let testurl = canvasEl.toDataURL();
          savedItArr.push(testurl)
          templog.innerHTML+=`saving image<br/>`;
        }else if(key === " " || key === "a"){
          for(let i=0;i<savedItArr.length;i++){
              let newimg = document.createElement("img");
              newimg.src = savedItArr[i];
              imgContainer.appendChild(newimg);
          }
          templog.innerHTML+=`displayed images<br/>`;
        }else if(key==="1"){
        }
        return false;
    // }
  
}
window.addEventListener("load",()=>{
    document.getElementById("word").innerHTML=localStorage.getItem("word")
    // console.log("workd")
    // document.getElementById("word").innerHTML=selectedWord
})