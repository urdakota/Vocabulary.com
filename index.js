const delay = prompt("Delay per answer (MS)", 2500);
const autorestart = confirm("Want the bot to automatically restart?")
var learned = {}
if (localStorage.getItem("learned") !== null) { learned = JSON.parse(localStorage.getItem("learned")) }

var isrunning = false;
function main() {
    
    var clicked = false;
    var isrunning = true;
    var id = 0;
    var screens = document.querySelector("#challenge > div > div.questionPane");
    if (screens) {
        id = (screens.children.length) - 1;
        var current = screens.children[id];
        if (current) {
            var question = current.querySelector("div > section.left > div.question");
            var questionContent = question.querySelector("div.questionContent");
            var next = document.querySelector("#challenge > div > div:nth-child(2) > button");
            
            var questiontype = current.getAttribute("data-slide-type");
            switch (questiontype) {
                case "spelling":
                    var word = questionContent.querySelector("div.sentence.complete").getElementsByTagName("strong")[0].innerText;
                    question.querySelector("div.spelltheword > div.field.left > input").value = word;
                    setTimeout(() => {
                        question.querySelector("div.spelltheword > div.field.right > button.spellit.ss-write.left").click();
                        isrunning = false;
                    }, delay);
                    break;
                case "choice":
                    var realquestion = ""
                    var choices = question.querySelector("div.choices");
                    if (!(choices.children[0].getAttribute("style") && choices.children[0].getAttribute("style").includes("background-image"))) {
                        var instructions = question.querySelector("div.instructions");
                        if (questionContent.children.length == 0) {
                            realquestion = instructions.innerText;
                        } else {
                            realquestion = questionContent.children[0].innerText
                        }

                        if (learned[realquestion]) {
                            let done = false;
                            choices.querySelectorAll("a").forEach(element => {
                                if (learned[realquestion] == element.innerText) {
                                    element.click();
                                    setTimeout(() => {
                                        if (element.getAttribute("class") == "correct") {
                                            delete learned[realquestion];
                                            localStorage.setItem("learned",JSON.stringify(learned))
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
                                        if (choices.getElementsByClassName("correct").length == 0) {
                                            if (element.getAttribute("class") != "incorrect") {
                                                if (clicked) {
                                                    setTimeout(() => {
                                                        clickbtn(element)
                                                    }, 1000);
                                                } else {
                                                    clicked = true;
                                                    element.click();
                                                    setTimeout(() => {
                                                        if (element.getAttribute("class") == "correct") {
                                                            console.log(`${element.innerText}: ${realquestion}`)
                                                            if (choices.getElementsByClassName("incorrect").length != 0) {
                                                                learned[realquestion] = element.innerText;
                                                                localStorage.setItem("learned", JSON.stringify(learned))
                                                            }
                                                            isrunning = false;
                                                        }
                                                        clicked = false;
                                                    }, 1000);
                                                }
                                            }
                                        }
                                    }
                                    clickbtn(element);
                                });
                            }, 1000);
                        }
                    } else {
                        var word = question.querySelector("div.word > div.wrapper").innerText;

                        choices.querySelectorAll("a").forEach(element => {
                            if (learned[element.getAttribute("style")]) {
                                element.click();
                                setTimeout(() => {
                                    if (element.getAttribute("class") == "correct") {
                                        delete learned[realquestion];
                                        localStorage.setItem("learned",JSON.stringify(learned))
                                        isrunning = false;
                                    }
                                    clicked = false;
                                }, 1000);
                            }
                        })
                        if (isrunning) {
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
                                                        if (element.getAttribute("class") == "correct") {
                                                            console.log(`${element.innerText}: ${element.getAttribute("style")}`)
                                                            if (choices.getElementsByClassName("incorrect").length != 0) {
                                                                learned[element.getAttribute("style")] = element.innerText;
                                                                localStorage.setItem("learned", JSON.stringify(learned))
                                                            }
                                                        }
                                                        clicked = false;
                                                    }, 1000);
                                                }
                                            }
                                        }
                                    }
                                    clickbtn(element);
                                });
                            }, 1000);
                        }
                    }
                    break;
            }
        } else {
            isrunning = false;
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

    setTimeout(() => {
        if (isrunning && autorestart && !(next.getAttribute("class") == "next active")) {
            isrunning = false;
            console.log("Automatically restarted!")
            main();
            isrunning = true; 
        }
    }, 15000);
}

main();