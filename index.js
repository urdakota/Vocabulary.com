const delay = prompt("Delay between loops (MS)", 2500);
const autorestart = confirm("Want the bot to automatically restart?")

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

var isrunning = false;
function main() {
    
    var clicked = false;
    var isrunning = true;
    var restarted = true;
    var id = 0;
    var next = document.querySelector("#challenge > div > div:nth-child(2) > button");
    var screens = document.querySelector("#challenge > div > div.questionPane");
    if (screens) {
        id = (screens.children.length) - 1;
        var current = screens.children[id];
        if (current && current.querySelector("div > section.left > div.question")) {
            var question = current.querySelector("div > section.left > div.question");
            var questionContent = question.querySelector("div.questionContent");
            
            var questiontype = current.getAttribute("data-slide-type");
            switch (questiontype) {
                case "spelling":
                    var word = questionContent.querySelector("div.sentence.complete").getElementsByTagName("strong")[0].innerText;
                    setTimeout(() => {
                        question.querySelector("div.spelltheword > div.field.left > input").value = word;
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

                        var containsanswer = false;
                        choices.querySelectorAll("a").forEach(element => {
                            if (learned[list][realquestion] == element.innerText) {
                                containsanswer = true;
                            }
                        })
                        if (learned[list][realquestion] && containsanswer) {
                            choices.querySelectorAll("a").forEach(element => {
                                if (learned[list][realquestion] == element.innerText) {
                                    element.click();
                                    setTimeout(() => {
                                        if (element.getAttribute("class") == "correct") {
                                            delete learned[list][realquestion];
                                            localStorage.setItem("learned",JSON.stringify(learned))
                                            isrunning = false;
                                        }
                                        clicked = false;
                                    }, 500);
                                }
                            });
                        } else {
                            choices.querySelectorAll("a").forEach(element => {
                                function clickbtn(element) {
                                    if (choices.getElementsByClassName("correct").length == 0) {
                                        if (element.getAttribute("class") != "incorrect") {
                                            if (clicked) {
                                                setTimeout(() => {
                                                    clickbtn(element)
                                                }, 500);
                                            } else {
                                                clicked = true;
                                                element.click();
                                                setTimeout(() => {
                                                    if (element.getAttribute("class") == "correct") {
                                                        console.log(`${realquestion} (${element.innerText})`)
                                                        if (choices.getElementsByClassName("incorrect").length != 0) {
                                                            learned[list][realquestion] = element.innerText;
                                                            localStorage.setItem("learned", JSON.stringify(learned))
                                                        }
                                                        isrunning = false;
                                                    }
                                                    clicked = false;
                                                }, delay);
                                            }
                                        }
                                    }
                                }
                                clickbtn(element);
                            });
                        }
                    } else {
                        var word = question.querySelector("div.word > div.wrapper").innerText;

                        choices.querySelectorAll("a").forEach(element => {
                            if (learned[list][element.getAttribute("style")]) {
                                element.click();
                                setTimeout(() => {
                                    if (element.getAttribute("class") == "correct") {
                                        delete learned[list][element.getAttribute("style")];
                                        localStorage.setItem("learned",JSON.stringify(learned))
                                        isrunning = false;
                                    }
                                    clicked = false;
                                }, 500);
                            }
                        })
                        if (isrunning) {
                            choices.querySelectorAll("a").forEach(element => {
                                function clickbtn(element) {
                                    if (choices.getElementsByClassName("correct").length === 0) {
                                        if (element.getAttribute("class") != "incorrect") {
                                            if (clicked) {
                                                setTimeout(() => {
                                                    clickbtn(element)
                                                }, 500);
                                            } else {
                                                clicked = true;
                                                element.click();
                                                setTimeout(() => {
                                                    if (element.getAttribute("class") == "correct") {
                                                        console.log(`${element.innerText} (${element.getAttribute("style")})`)
                                                        if (choices.getElementsByClassName("incorrect").length != 0) {
                                                            learned[list][element.getAttribute("style")] = element.innerText;
                                                            localStorage.setItem("learned", JSON.stringify(learned))
                                                            isrunning = false;
                                                        }
                                                    }
                                                    clicked = false;
                                                }, delay);
                                            }
                                        }
                                    }
                                }
                                clickbtn(element);
                            });
                        }
                    }
                    break;
            }
        }
    }

    function next_btn() {
        if (!isrunning){
            if (next.getAttribute("class") == "next active") {
                next.click();
            } else {
                main();
                restarted = true;
            }
        }
        setTimeout(() => {
            if (next.getAttribute("class") == "next active") {
                next_btn();
            }
        }, 500);
    }
    next_btn();
}

main();