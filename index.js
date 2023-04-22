//const delay = prompt("Wordlist Link","https://www.vocabulary.com/lists/8378603");
//const delay = prompt("Delay per answer (MS)",5000);

function main() {
    var mode = document.querySelector("#challenge > div > div.questionPane > div > div > div > section.left > div.question.typeP > div.mode");
    var question = document.querySelector("#challenge > div > div.questionPane > div > div > div > section.left > div.question.typeP > div.questionContent");
    var choices = document.querySelector("#challenge > div > div.questionPane > div > div > div > section.left > div.question.typeP > div.choices");
    var lifelines = document.querySelector("#challenge > div > div.questionPane > div > div > div > section.left > div.question.typeP > div.lifeLines");
    var lifeline = document.querySelector("#challenge > div > div.questionPane > div > div > div > section.left > div.question.typeP > div.lifeLineContent");

    if (mode.querySelector("assessment").textContent == "ASSESSMENT") {
        alert("ASSESSMENT!")
    }
}

main()