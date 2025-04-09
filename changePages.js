let currentPage=0
let selectedWord
let allWordsGrid=document.getElementById("allWords")
let selectedIndex = 0; // Keep track of the selected item index
let itemsPerRow = 8; // You can adjust this based on your grid's layout

function pageHandling(){
    if (currentPage==0){
        for(let i=0;i<allImagesDict.length;i++){
            let newdiv=document.createElement("div")
            newdiv.classList.add("gridItem")
            newdiv.classList.add("border-2")
            newdiv.classList.add("border-solid")
            newdiv.classList.add("w-min-[100px]")
            newdiv.classList.add("h-fit")
            newdiv.classList.add("p-[20px]")
            newdiv.classList.add("text-center")
            newdiv.dataset.word=allImagesDict[i].word
            newdiv.innerHTML=allImagesDict[i].word
            if(i==0){
                newdiv.classList.add("selected")
                selectedWord=allImagesDict[i].word
                window.localStorage.setItem("word",selectedWord)
            }
            // newdiv.addEventListener("click",()=>{
            //     selectedWord=allImagesDict[i].word
            //     console.log(selectedWord)
            //     newdiv.classList.add("selected")
            //     window.localStorage.setItem("word",selectedWord)
            //     // choseWord(selectedWord)
            // })
            allWordsGrid.appendChild(newdiv)
        }
        // document.getElementById("page0").classList.remove("hidden")
        // document.getElementById("page1").classList.add("hidden")
    }else{
        return;
    }

}

function updateSelection(index) {
    const allItems = document.querySelectorAll(".gridItem");
    if (index >= 0 && index < allItems.length) {
        // Remove "selected" class from all items
        allItems.forEach(item => item.classList.remove("selected"));
        
        // Add "selected" class to the new item
        allItems[index].classList.add("selected");
        selectedWord = allItems[index].dataset.word; // Update selected word
        window.localStorage.setItem("word", selectedWord); // Save the selected word
    }
}

// Handle arrow key navigation
document.addEventListener('keydown', function(event) {
    const allItems = document.querySelectorAll(".gridItem");

    if (allItems.length === 0) return; // Prevent errors if no items exist

    if (event.key === 'ArrowDown') {
        if (selectedIndex + itemsPerRow < allItems.length) {
            selectedIndex += itemsPerRow; // Move down one row
            updateSelection(selectedIndex);
        }
    } else if (event.key === 'ArrowUp') {
        if (selectedIndex - itemsPerRow >= 0) {
            selectedIndex -= itemsPerRow; // Move up one row
            updateSelection(selectedIndex);
        }
    } else if (event.key === 'ArrowRight') {
        if (selectedIndex + 1 < allItems.length) {
            selectedIndex += 1; // Move right one item
            updateSelection(selectedIndex);
        }
    } else if (event.key === 'ArrowLeft') {
        if (selectedIndex - 1 >= 0) {
            selectedIndex -= 1; // Move left one item
            updateSelection(selectedIndex);
        }
    } else if (event.key === ' ') {
        // If space key is pressed, change page (you already have this)
        currentPage = 1;
        window.location.href = 'index.html'; // Replace with your desired file path
    }
});

window.addEventListener("load",function(){
    pageHandling()
    googleTranslateElementInit()
})