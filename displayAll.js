let panel=document.getElementById("panel")
let container=document.getElementById("container")
let heading=document.getElementById("header-text")
let backButton=document.getElementById("back")

let peopleCategory="#93c5fd"
let thingsCategory="#fde047"
let fireCategory="#fdba74"
let craftCategory="#a3e635"
let wormCategory="#f472b6"
let verbsCategory="#d8b4fe"

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

function display() {
    getFirebase((data) => {
      currentData = data.database;
      for (let i = 0; i < currentData.length; i++) {
        const miniCanvas = document.createElement("canvas");
        miniCanvas.classList.add("averageImagesCanvas")
        miniCanvas.dataset.word=currentData[i].word
        miniCanvas.dataset.category=currentData[i].category
        miniCanvas.classList.add("box-border")
  
        miniCanvas.width = 400; 
        miniCanvas.height = 400;
        const ctx = miniCanvas.getContext("2d");
        ctx.globalCompositeOperation ="screen"
  
        const wordName=document.createElement("div")
        wordName.innerHTML=`[${currentData[i].word}]`
        wordName.classList.add("text-center")
        wordName.classList.add("text-6xl")
  
        const canvasWrapper = document.createElement("div");
        canvasWrapper.classList.add("w-fit")
        canvasWrapper.classList.add("h-fit")
        canvasWrapper.classList.add("gap-2")
        canvasWrapper.style.backgroundColor=getColor(currentData[i].category)
        canvasWrapper.appendChild(miniCanvas);
        canvasWrapper.appendChild(wordName);
        container.appendChild(canvasWrapper);
        if (currentData[i].urls) {
          let keys = Object.keys(currentData[i].urls);
          keys.forEach((key) => {
            const value = currentData[i].urls[key];
            const img = new Image();
            img.style.opacity=1/(keys.length)
            img.src = value;
            img.onload = () => {
              ctx.drawImage(img, 0, 0, 400, 400);
            };
          });
          ctx.rect(0,0,400,400);
          ctx.fillStyle = getColor(currentData[i].category);
          ctx.fill();
        }
        canvasWrapper.addEventListener("click",(e)=>{
                let keys = Object.keys(currentData[i].urls);
                keys.forEach((key) => {
                    const value = currentData[i].urls[key];
                    const img = document.createElement("img");
                    img.src = value;
                    img.style.width="45%"
                    img.style.height="auto"
                    // img.style.height="100px"
                    panel.appendChild(img);

                });
            heading.innerHTML=`These are all previous creations of <div class="inline" style="background-color:${getColor(currentData[i].category)}"> [${currentData[i].word}]</div> `
            console.log(currentData[i].urls)
            panel.classList.remove("hidden")
            panel.classList.add("flex")
            container.classList.remove("flex")
            container.classList.add("hidden")
            backButton.classList.remove("hidden")
        })
      }
    });
  }
  backButton.addEventListener("click",()=>{
    location.reload()
  })
  window.addEventListener("load",()=>{
    display()
  })