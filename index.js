const delay = prompt("Delay between loops (MS)", 2500);
const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
let list = window.location.href.split("/")[4]
if (list.includes("/practice")) { list = list.split("/practice")[0] }
if (list.includes("/vocabtrainer")) { list = list.split("/vocabtrainer")[1] }

var learned = {}
if (localStorage.getItem("learned") !== null) {
    learned = JSON.parse(localStorage.getItem("learned"))
}
if (!learned[list]) {
    learned[list] = {};
    localStorage.setItem("learned",JSON.stringify(learned))
}

var nextbtn = document.querySelector("#challenge > div > div:nth-child(2) > button");
var screens = document.querySelector("#challenge > div > div.questionPane");


function loop(){
    var screenid = (screens.children.length) - 1;
    var currentscreen = screens.children[screenid];
    var questionholder = currentscreen.querySelector("div > section.left > div.question");
    if (questionholder){
        var question = questionholder.querySelector("div.questionContent");
        var questiontype = currentscreen.getAttribute("data-slide-type");
        switch(questiontype){
            case "spelling": // Spelling (Fill in the blanks)
                var word = question.querySelector("div.sentence.complete").getElementsByTagName("strong")[0].innerText;
                questionholder.querySelector("div.spelltheword > div.field.left > input").value = word;
                // Potential wait, I don't know yet
                (async () => {
                    await new Promise((resolve, reject) => setTimeout(resolve, delay));
                    questionholder.querySelector("div.spelltheword > div.field.right > button.spellit.ss-write.left").click();
                })();
                
                break;
            case "choice": // Multiple Choice
                var realquestion = "- none -";
                var choices = questionholder.querySelector("div.choices");

                // I need to add a better way to detect this
                function updatequestion(element) {
                    // Image Question
                    if (element && element.getAttribute("style") && element.getAttribute("style").includes("background-image")) {
                        realquestion = element.getAttribute("style")
                    // Multiple Choice Questions
                    } else {
                        if (question.children.length == 0) {
                            realquestion = questionholder.querySelector("div.instructions").innerText;
                        } else {
                            realquestion = question.children[0].innerText
                        }
                    }
                }

                // Check if known & click
                (async () => {
                    for await (const element of choices.querySelectorAll("a")) {
                        updatequestion(element);
                        if (learned[list][realquestion]) {
                            element.click();
                            await new Promise((resolve, reject) => setTimeout(resolve, delay));
                            // Delete question from learned table
                            delete learned[list][realquestion];
                            localStorage.setItem("learned", JSON.stringify(learned))
                        }
                    }
                })();
                
                // If not known, guess
                (async () => {
                    for await (const element of choices.querySelectorAll("a")) {
                        element.click();
                        await new Promise((resolve, reject) => setTimeout(resolve, delay));
                        if (element.getAttribute("class") == "correct") {
                            if (choices.getElementsByClassName("incorrect").length != 0) {
                                updatequestion(element);
                                if (element.getAttribute("style") && element.getAttribute("style").includes("background-image")) {
                                    learned[list][realquestion] = element.getAttribute("style");
                                    localStorage.setItem("learned",JSON.stringify(learned))
                                    
                                    // Debug
                                    console.log(`learned[${list}][${realquestion}] = ${element.getAttribute("style")};`)
                                } else {
                                    learned[list][realquestion] = element.innerText;
                                    localStorage.setItem("learned",JSON.stringify(learned))
                                    
                                    // Debug
                                    console.log(`learned[${list}][${realquestion}] = ${element.innerText};`)
                                }
                                localStorage.setItem("learned", JSON.stringify(learned));
                            }
                        }
                    }
                })();
                
                break;
            default:
                alert(`Unknown question type!\nAdd issue on https://github.com/urdakota/Vocabulary.com\nQuestion Type:${questiontype}`);
                break;

            // End of switch
        }
    } else {
        return;
    }
}

// Main loop
async function main(){
    await new Promise((resolve, reject) => setTimeout(resolve, delay));
    
    await loop();

    // Witchcraft magic that somehow waits
    // until till the next button is visible
    do {
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    } while (nextbtn.getAttribute("class") != "next active")

    // Restart
    do {
        await new Promise((resolve, reject) => setTimeout(resolve, delay));
        nextbtn.click();
    } while (nextbtn.getAttribute("class") == "next active")

    main();

}

main();