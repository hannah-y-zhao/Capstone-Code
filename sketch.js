// Machine Learning for Creative Coding
// https://github.com/shiffman/ML-for-Creative-Coding
// Select cameras reference https://editor.p5js.org/codingtrain/sketches/JjRoa1lWO
// Depth estimation reference https://editor.p5js.org/ml_4_cc/sketches/qtnSdaa2h
let video;
const devices=[]
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
let canvasDim=640
let vidW=1920
let vidH=1200
let xRatio=vidW/canvasDim
let yRatio=vidH/canvasDim
let selected1, selected2
let selecting=0
let firstSelected, secondSelected

async function setup() {
  // Create canvas and set up video capture with constraints
  if (currentPage == 1) {
    navigator.mediaDevices.enumerateDevices()
    .then(gotDevices);
    

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
  }
}

function gotDevices(deviceInfos) {
    let constraints
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind == 'videoinput') {
        devices.push({
          label: deviceInfo.label,
          id: deviceInfo.deviceId
        });
      }
    }
    console.log(devices);
    let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    console.log(supportedConstraints);
    if(devices.length>1){
        constraints = {
            video: {
              deviceId: {
                exact: devices[1].id
              },
            }
          };
    }else{
        constraints = {
            video: {
              deviceId: {
                exact: devices[0].id
              },
            }
          };
    }
    
    video=createCapture(constraints);
    canvas = createCanvas(canvasDim, canvasDim);
    canvas.id("canvas");
    canvasEl = document.getElementById("canvas");
    pg2.appendChild(canvasEl);
    // video = createCapture(VIDEO);
    video.hide();
    video.size(vidW, vidH); //1280 x 720 pixels
  }

function draw() {
  // Draw the video on the canvas
  if (currentPage == 2) {
    let canvasAspect = canvasDim / canvasDim; // 1:1
    let videoAspect = video.width / video.height;
    image(video, -(canvasDim * videoAspect - canvasDim) / 2, 0, canvasDim * videoAspect, canvasDim);

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
            depthImg.pixels[pixelIndex] = depthValue+20;
            depthImg.pixels[pixelIndex + 1] = depthValue+20;
            depthImg.pixels[pixelIndex + 2] = depthValue+20;

            // Set the alpha value to fully opaque
            depthImg.pixels[pixelIndex + 3] = 255;
          }
        }
      }

      // Update the pixels of the depth image
      depthImg.updatePixels();

      let dAspect = depth.width / depth.height;
      let dW, dH, dx, dy;

        dH = canvasDim;
        dW = canvasDim * dAspect;
        dx = (canvasDim - dW) / 2;
        dy = 0;


      fill(getColor(localStorage.getItem("category")));
      rect(0, 0, canvasDim, canvasDim);
      // Draw the depth image on the canvas
    //   image(depthImg, 0, 0, canvasDim, canvasDim);
    image(depthImg, dx, dy, dW, dH)
      let currentURL = canvasEl.toDataURL();
    //   console.log(currentURL);
      toFirebase(currentDictSection, currentURL, "");
      let newimg = document.createElement("img");
      newimg.src = currentURL;

      noLoop();
    }
  }
}

function selectedAverageImage(selectedCanvas){
    if(selecting==0){
        firstSelected=selectedCanvas
        secondSelected=""
        word1.innerHTML=`[${selectedCanvas.dataset.word}]`
        selected1=selectedCanvas.getContext("2d")
        selecting++
        document.querySelectorAll(".averageImagesCanvas").forEach(canvas => {
            canvas.style.border=`none`;
            canvas.style.opacity="0.5"
          });
          word2.innerHTML=`[...]`
    }else if(selecting==1){
        secondSelected=selectedCanvas
        word2.innerHTML=`[${selectedCanvas.dataset.word}]`
        selected2=selectedCanvas.getContext("2d")
        const img1 = selected1.getImageData(0, 0, 300, 300);
        const img2 = selected2.getImageData(0, 0, 300, 300);
        let resembleData=window.pixelmatch(img1.data, img2.data, null, 300, 300, {threshold: 0.15});
        let resemblePercent=(((img1.width*img1.height)-resembleData)/(img1.width*img1.height))*100
        document.getElementById("resemblePercent").innerHTML=resemblePercent
        selecting=0
        selected1=""
    }
    selectedCanvas.style.border=`2px solid ${getColor(selectedCanvas.dataset.category)}`;
    selectedCanvas.style.opacity="1"
}

function getColor(category){
    if(category=="people"){
        return peopleCategory;
      }else if(category=="things"){
        return thingsCategory;
      }else if(category=="verbs"){
        return verbsCategory;
      }else if(category=="craft"){
        return craftCategory;
      }else if(category=="fire"){
        return fireCategory;
      }else if(category=="worm"){
        return wormCategory;
      }
}

function page3() {
  getFirebase((data) => {
    currentData = data.database;
    for (let i = 0; i < currentData.length; i++) {
      const miniCanvas = document.createElement("canvas");
      miniCanvas.classList.add("averageImagesCanvas")
      miniCanvas.classList.add("opacityTransition")
      miniCanvas.dataset.word=currentData[i].word
      miniCanvas.dataset.category=currentData[i].category
      miniCanvas.classList.add("box-border")
      miniCanvas.style.opacity=".5"

      miniCanvas.width = 300; 
      miniCanvas.height = 300;
      const ctx = miniCanvas.getContext("2d");
      ctx.globalCompositeOperation ="screen"

      const wordName=document.createElement("div")
      wordName.innerHTML=`[${currentData[i].word}]`
      wordName.classList.add("text-center")

      const canvasWrapper = document.createElement("div");
      canvasWrapper.classList.add("w-fit")
      canvasWrapper.classList.add("h-fit")
      canvasWrapper.classList.add("gap-2")
      canvasWrapper.style.backgroundColor=getColor(currentData[i].category)
      canvasWrapper.appendChild(miniCanvas);
      canvasWrapper.appendChild(wordName);
      document.getElementById("container").appendChild(canvasWrapper);
      if (currentData[i].urls) {
        let keys = Object.keys(currentData[i].urls);
        keys.forEach((key) => {
          const value = currentData[i].urls[key];
          const img = new Image();
          img.style.opacity=1/(keys.length)
          img.src = value;
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 300, 300);
          };
        });
        ctx.rect(0,0,300,300);
        ctx.fillStyle = getColor(currentData[i].category);
        ctx.fill();
      }
    }
  });
}

async function estimateDepth() {
  results = await depthEstimation(video.canvas.toDataURL());
}

function logProgress(progress) {
  console.log(`loading model: ${progress.status} ${progress.progress || ""}`);
}
