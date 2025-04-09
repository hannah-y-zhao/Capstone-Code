function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'translate');
}

window.addEventListener("load",function(){
    googleTranslateElementInit()
})