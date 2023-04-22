const delay = prompt("Delay per answer (MS)",5000);
var questions = {}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

var count = 0;
var isrunning = false;
function main() {
    
    var clicked = false;
    var isrunning = true;
    var id = 0;
    var screens = document.querySelector("#challenge > div > div.questionPane");
    screens.querySelectorAll("div").forEach(element => {
        if (element.getAttribute("data-slot-id") > id) {
            id = element.getAttribute("data-slot-id");
        }
    });
    var current = screens.children[id];
    var question = current.querySelector("div > section.left > div.question");

    var questionContent = question.querySelector("div.questionContent");
    var next = document.querySelector("#challenge > div > div:nth-child(2) > button");
    
    var questiontype = "";
    if (question.querySelector("div.spelltheword")) {
        questiontype = "spelltheword";
    } else if(question.querySelector("div.choices")){
        questiontype = "choices"
    }

    var word = ""
    var realquestion = ""
    switch (questiontype) {
        case "spelltheword":
            word = questionContent.querySelector("div.sentence.complete").getElementsByTagName("strong")[0].innerText;
            question.querySelector("div.spelltheword > div.field.left > input").value = word;
            setTimeout(() => {
                question.querySelector("div.spelltheword > div.field.right > button.spellit.ss-write.left").click();
            }, delay);
            break;
        case "choices":

            var choices = question.querySelector("div.choices");
            var instructions = question.querySelector("div.instructions");
            if (questionContent.children.length == 0) {
                realquestion = instructions.innerText;
                word = instructions.getElementsByTagName("STRONG")[0].innerText
            } else {
                realquestion = questionContent.children[0].innerText
                word = questionContent.children[0].getElementsByTagName("STRONG")[0].innerText
            }

            if (questions[realquestion]) {
                choices.querySelectorAll("a").forEach(element => {
                    if (questions[realquestion] == element.innerText) {
                        element.click();
                        setTimeout(() => {
                            if (element.getAttribute("class") === "correct") {
                                isrunning = false;
                            }
                            clicked = false;
                        }, 2000);
                    }
                });
            } else {
                var lifeLines = question.querySelector("div.lifeLines");
                var lifeLineContent = question.querySelector("div.lifeLineContent");
                if (lifeLines && lifeLines.getAttribute("style") != "display:none;") {
                    lifeLines.querySelector("span:nth-child(2) > a:nth-child(1)").click();
                }
                setTimeout(() => {
                    choices.querySelectorAll("a").forEach(element => {
                        function clickbtn(element) {
                            if (choices.getElementsByClassName("correct").length === 0) {
                                if (element.getAttribute("class") != "incorrect") {
                                    if (clicked) {
                                        setTimeout(() => {
                                            clickbtn(element)
                                        }, 1000);
                                    } else {
                                        clicked = true;
                                        element.click();
                                        setTimeout(() => {
                                            if (element.getAttribute("class") === "correct") {
                                                questions[realquestion] = element.innerText;
                                                console.log(`${realquestion} ${element.innerText}`)
                                                isrunning = false;
                                            }
                                            clicked = false;
                                        }, 2000);
                                    }
                                }
                            }
                        }
                        setTimeout(clickbtn(element), 5000);
                    });
                }, 1000);
            }
            break;
    }
        

    function next_btn() {
        if (next.getAttribute("class") == "next active" && !isrunning) {
            console.log("next")
            next.click();
            setTimeout(() => {
                console.log("restarted")
                main();
                isrunning = true; 
            }, delay);
        }
        setTimeout(() => {
            next_btn();
        }, 1000);
    }
    next_btn();
    count ++
}

main();