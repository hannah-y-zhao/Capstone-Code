let currentPage = 1;
let selectedWord;
let allWordsGrid = document.getElementById("allWords");
let selectedIndex = 0; // Keep track of the selected item index
let selectedWordIndex = 0;
let itemsPerRow = 8; // You can adjust this based on your grid's layout
let wordsPerRow = 4;
let word1=document.getElementById("word1")
let word2=document.getElementById("word2")
let currentData;
let peopleCategory="#93c5fd"
let thingsCategory="#fde047"
let fireCategory="#fdba74"
let craftCategory="#a3e635"
let wormCategory="#f472b6"
let verbsCategory="#d8b4fe"

function pageHandling() {
  if (currentPage == 1) {
    // console.log(allWordsGrid)
    getFirebase((data) => {
      currentData = data.database;
      // console.log(currentData)
      for (let i = 0; i < currentData.length; i++) {
        let newdiv = document.createElement("div");
        newdiv.classList.add("gridItem");
        newdiv.classList.add("border-2");
        newdiv.classList.add("border-solid");
        newdiv.classList.add("w-min-[100px]");
        newdiv.classList.add("h-fit");
        newdiv.classList.add("p-[20px]");
        newdiv.classList.add("text-center");
        newdiv.classList.add("colorTransition");
        newdiv.dataset.word = currentData[i].word;
        newdiv.dataset.category=currentData[i].category
        newdiv.innerHTML = currentData[i].word;
        // console.log(currentData[i].word)
        if (i == 0) {
          newdiv.style.backgroundColor=getColor(currentData[0].category)
          selectedWord = currentData[i].word;
          window.localStorage.setItem("word", selectedWord);
        }
        allWordsGrid.appendChild(newdiv);
      }
    });
  } else {
    return;
  }
}

function updateSelection(index) {
    if(currentPage==1){
        const allItems = document.querySelectorAll(".gridItem");
        if (index >= 0 && index < allItems.length) {
          // Remove "selected" class from all items
          allItems.forEach((item) => item.style.backgroundColor="white");
      
          // Add "selected" class to the new item
          allItems[index].style.backgroundColor=getColor(allItems[index].dataset.category)
          selectedWord = allItems[index].dataset.word; // Update selected word
          window.localStorage.setItem("word", selectedWord); // Save the selected word
          window.localStorage.setItem("category",allItems[index].dataset.category)

        }
    }else if (currentPage==3){
        const allAveragedImages = document.querySelectorAll(".averageImagesCanvas");
        // word1.innerHTML=`[${allAveragedImages[index].dataset.word}]`
        // console.log(word1, allAveragedImages[index].dataset)
        if (index >= 0 && index < allAveragedImages.length) {
            // Remove "selected" class from all items
            allAveragedImages.forEach((item) => item.style.border="");
            allAveragedImages.forEach((item) => item.style.opacity="0.5");
            if(firstSelected){
              firstSelected.style.opacity="1"
            }
            if(secondSelected){
              secondSelected.style.opacity="1"
            }
        
            // Add "selected" class to the new item
            // console.log(getColor(allAveragedImages[index].dataset.category))
            allAveragedImages[index].style.border=`2px dashed ${getColor(allAveragedImages[index].dataset.category)}`;
            allAveragedImages[index].style.opacity="1"
            // selectedWord = allAveragedImages[index].dataset.word; // Update selected word
        }
        if(selecting==0){
            word1.innerHTML=`[${allAveragedImages[index].dataset.word}]`
        }else if(selecting==1){
            word2.innerHTML=`[${allAveragedImages[index].dataset.word}]`
        }
    }
  
}

// Handle arrow key navigation
document.addEventListener("keydown", function (event) {
  const allItems = document.querySelectorAll(".gridItem");
  const allAveragedImages = document.querySelectorAll(".averageImagesCanvas");
  if (currentPage == 1) {
    event.preventDefault()
    if (allItems.length === 0) return; // Prevent errors if no items exist

    if (event.key === "ArrowDown") {
      if (selectedIndex + itemsPerRow < allItems.length) {
        selectedIndex += itemsPerRow; // Move down one row
        updateSelection(selectedIndex);
      }
    } else if (event.key === "ArrowUp") {
      if (selectedIndex - itemsPerRow >= 0) {
        selectedIndex -= itemsPerRow; // Move up one row
        updateSelection(selectedIndex);
      }
    } else if (event.key === "ArrowRight") {
      if (selectedIndex + 1 < allItems.length) {
        selectedIndex += 1; // Move right one item
        updateSelection(selectedIndex);
      }
    } else if (event.key === "ArrowLeft") {
      if (selectedIndex - 1 >= 0) {
        selectedIndex -= 1; // Move left one item
        updateSelection(selectedIndex);
      }
    }
  }else if (currentPage==3){
    // console.log("on page 3")
    if (allAveragedImages.length === 0) return; // Prevent errors if no items exist

    if (event.key === "ArrowDown") {
      if (selectedWordIndex + wordsPerRow < allAveragedImages.length) {
        selectedWordIndex += wordsPerRow; // Move down one row
        updateSelection(selectedWordIndex);
      }
    } else if (event.key === "ArrowUp") {
      if (selectedWordIndex - wordsPerRow >= 0) {
        selectedWordIndex -= wordsPerRow; // Move up one row
        updateSelection(selectedWordIndex);
      }
    } else if (event.key === "ArrowRight") {
      if (selectedWordIndex + 1 < allAveragedImages.length) {
        selectedWordIndex += 1; // Move right one item
        updateSelection(selectedWordIndex);
      }
    } else if (event.key === "ArrowLeft") {
      if (selectedWordIndex - 1 >= 0) {
        selectedWordIndex -= 1; // Move left one item
        updateSelection(selectedWordIndex);
      }
    }else if (event.key=== " ") {
        selectedAverageImage(allAveragedImages[selectedWordIndex])
    }

  }
  if (event.key === " ") {
    event.preventDefault()
    if (currentPage == 2) {
        estimateDepth();
      }
  }
});
document.addEventListener("click",()=>{
       if (currentPage == 1) {
        currentWord = document.getElementById("word")
        currentWord.innerHTML =`[${localStorage.getItem("word")}]`;
        getFirebase((data) => {
          currentData = data.database;
          // console.log(currentData);
          for (let i = 0; i < currentData.length; i++) {
            if (localStorage.getItem("word") == currentData[i].word) {
              currentWord.style.backgroundColor=getColor(currentData[i].category)
              currentDictSection = i;
              console.log(currentWord,currentData[i].word)
              // console.log(currentDictSection);
              return;
            }
          }
        });
      }
    //   if (currentClick != 1) {
          if(currentPage==3){
              window.location.reload()
          }else{
              currentPage++
          }
    //   }
      if (currentPage == 3) {
        page3();
      }
      let currentElements = document.querySelectorAll(".pg" + currentPage);
      currentElements.forEach((cEl) => cEl.classList.remove("hidden"));
  
      let prevElements = document.querySelectorAll(".pg" + (currentPage - 1));
      prevElements.forEach((pEl) => pEl.classList.add("hidden"));
})

window.addEventListener("load", function () {
  googleTranslateElementInit();
  pageHandling();
});
