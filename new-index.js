const delay = prompt("Delay between loops (MS)", 2500);

let list = window.location.href.split("/")[4]
if (list.includes("/practice")) { list = list.split("/practice")[0] }

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
/*
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
                
                // Potential wait, I don't know yet
                question.querySelector("div.spelltheword > div.field.left > input").value = word;
                question.querySelector("div.spelltheword > div.field.right > button.spellit.ss-write.left").click();
                
                break;
            case "choice": // Multiple Choice
                var realquestion = "";
                var choices = question.querySelector("div.choices");
                
                function updatequestion(){
                    // I need to add a better way to detect this
                    if (element.getAttribute("style").includes("background-image")) {
                        // Images
                        realquestion = element.getAttribute("style")
                    } else {
                        // Multiple Choice Questions
                        var instructions = question.querySelector("div.instructions");
                        if (question.children.length == 0) {
                            realquestion = instructions.innerText;
                        } else {
                            realquestion = question.children[0].innerText
                        }
                    }
                }

                function clickbtn(element) {
                    if (choices.getElementsByClassName("correct").length === 0) {
                        if (element.getAttribute("class") != "incorrect") {
                            element.click();
                            setTimeout(() => {
                                if (element.getAttribute("class") == "correct") {
                                    if (choices.getElementsByClassName("incorrect").length != 0) {
                                        updatequestion();
                                        learned[list][realquestion] = element.innerText;
                                        localStorage.setItem("learned", JSON.stringify(learned))
                                    }
                                }
                            }, delay);
                        }
                    }
                    return;
                }

                // Check if known & click
                choices.querySelectorAll("a").forEach(element => {
                    updatequestion();

                    if (learned[list][realquestion]) {
                        element.click();
                        // Delete question from learned table
                        delete learned[list][realquestion];
                        localStorage.setItem("learned",JSON.stringify(learned))
                    }
                })

                // If none known, guess
                if (choices.getElementsByClassName("correct").length === 0){
                    choices.querySelectorAll("a").forEach(element => {
                        await clickbtn(element);
                    })
                }

                break;
            default:
                alert(`Unknown question type!\nAdd issue on https://github.com/urdakota/Vocabulary.com\nQuestion Type:${questiontype}`)
                break;

            // End of switch
        }
    }
    return;
}

*/
// Wait for function to finish
// https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
const run = async () => {
    //await loop();
    
    // Click next
    if (next.getAttribute("class") == "next active") {
        next.click();
    }

    // Restart loop
    // run();
}

run();