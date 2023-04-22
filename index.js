const delay = prompt("Delay per answer (MS)",2500);
var questions = {}

var isrunning = false;
function main() {
    
    var clicked = false;
    var isrunning = true;
    var id = 0;
    var screens = document.querySelector("#challenge > div > div.questionPane");
    if (screens) {
        id = (screens.children.length) - 1;
        var current = screens.children[id];
        var question = current.querySelector("div > section.left > div.question");
        var questionContent = question.querySelector("div.questionContent");
        var next = document.querySelector("#challenge > div > div:nth-child(2) > button");
        
        var questiontype = current.getAttribute("data-slide-type");
        var word = ""
        switch (questiontype) {
            case "spelling":
                word = questionContent.querySelector("div.sentence.complete").getElementsByTagName("strong")[0].innerText;
                question.querySelector("div.spelltheword > div.field.left > input").value = word;
                setTimeout(() => {
                    question.querySelector("div.spelltheword > div.field.right > button.spellit.ss-write.left").click();
                    isrunning = false;
                }, delay);
                break;
            case "choice":
                var realquestion = ""
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
                            }, 1000);
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
                                                    console.log(`${element.innerText}: ${realquestion}`)
                                                    isrunning = false;
                                                }
                                                clicked = false;
                                            }, 1000);
                                        }
                                    }
                                }
                            }
                            setTimeout(clickbtn(element), 2000);
                        });
                    }, 1000);
                }
                break;
        }
    } else {
        isrunning = false;
    }

    function next_btn() {
        if (next.getAttribute("class") == "next active" && !isrunning) {
            next.click();
            setTimeout(() => {
                main();
                isrunning = true; 
            }, delay);
        }
        setTimeout(() => {
            next_btn();
        }, 1000);
    }
    next_btn();
}

main();