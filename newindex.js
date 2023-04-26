const link = window.location.href;
switch (link) {
    case (link.includes("practice")):
        fetch("https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/practice.js").then((res) => res.text().then((t) => eval(t)))
        break;
    
    case (link.includes("vocabtrainer")):
        fetch("https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/vocabtrainer.js").then((res) => res.text().then((t) => eval(t)))
        break;
    
    
    default:
        alert(`couldn't find game type (practice/vocabtrainer)\n\nPlease create new issue on https://github.com/urdakota/Vocabulary.com: ${link}`)
        break;
}