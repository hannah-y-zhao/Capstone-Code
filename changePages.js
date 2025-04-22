let currentPage=1
let selectedWord
let allWordsGrid=document.getElementById("allWords")
let selectedIndex = 0; // Keep track of the selected item index
let itemsPerRow = 8; // You can adjust this based on your grid's layout
let currentData

function pageHandling(){
    if (currentPage==1){
        // console.log(allWordsGrid)
        getFirebase((data) => {
            currentData=data.database
            // console.log(currentData)
        for(let i=0;i<currentData.length;i++){
            let newdiv=document.createElement("div")
            newdiv.classList.add("gridItem")
            newdiv.classList.add("border-2")
            newdiv.classList.add("border-solid")
            newdiv.classList.add("w-min-[100px]")
            newdiv.classList.add("h-fit")
            newdiv.classList.add("p-[20px]")
            newdiv.classList.add("text-center")
            newdiv.dataset.word=currentData[i].word
            newdiv.innerHTML=currentData[i].word
            // console.log(currentData[i].word)
            if(i==0){
                newdiv.classList.add("selected")
                selectedWord=currentData[i].word
                window.localStorage.setItem("word",selectedWord)
            }
            allWordsGrid.appendChild(newdiv)
        }
    });
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
    if (currentPage==1){
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
        }
    }
    if(event.key===' '){
        if(currentClick!=1&&currentClick!=2){
            currentPage++;
        }
        if(currentPage==3){
            page3()
        }
        let currentElements=document.querySelectorAll(".pg"+currentPage)
        currentElements.forEach(cEl => cEl.classList.remove("hidden"))
        
        let prevElements=document.querySelectorAll(".pg"+(currentPage-1))
        prevElements.forEach(pEl => pEl.classList.add("hidden"))
    }
    
});

window.addEventListener("load",function(){
    pageHandling()
    googleTranslateElementInit()
})