const delay = prompt("Delay between loops (MS)", 2500);
const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
let list = window.location.href.split("/")
if (list[5].includes("practice")) {list = list[4]}
if (list[3].includes("vocabtrainer")) {list = list[4]}

var learned = {}
if (localStorage.getItem("learned") !== null) {
    learned = JSON.parse(localStorage.getItem("learned"))
}
if (!learned[list]) {
    learned[list] = {};
    localStorage.setItem("learned", JSON.stringify(learned))
}

var nextbtn; 
var screens;
function loop() {
    if (window.location.href.includes("/practice")) {
        var screens = document.querySelector("#challenge > div > div.questionPane");
        var currentscreen = screens.children[(screens.children.length)-1];
        var questionholder = currentscreen.querySelector("div > section.left > div.question");

        if (questionholder) {
            var question = questionholder.querySelector("div.questionContent");
            var questiontype = currentscreen.getAttribute("data-slide-type");
            
            switch (questiontype) {
                case "spelling":
                    var word = question.querySelector("div.sentence.complete").getElementsByTagName("strong")[0].innerText;
                    questionholder.querySelector("div.spelltheword > div.field.left > input").value = word;
                    (async () => {
                        await new Promise((resolve, reject) => setTimeout(resolve, delay));
                        questionholder.querySelector("div.spelltheword > div.field.right > button.spellit.ss-write.left").click();
                    })();
                    break;
                case "choice":
                    var realquestion;
                    var choices = questionholder.querySelector("div.choices");

                    // I need to add a better way to detect this
                    function updatequestion(element) {
                        if (element && element.getAttribute("style") && element.getAttribute("style").includes("background-image")) {
                            realquestion = element.getAttribute("style")
                        } else {
                            if (question.children.length == 0) {
                                realquestion = questionholder.querySelector("div.instructions").innerText;
                            } else {
                                realquestion = question.children[0].innerText
                            }
                        }
                    }

                    // Check if known
                    var equalitycheckdone = false;
                    async function equalitycheck(){
                        equalitycheckdone = false;
                        for (const element of choices.querySelectorAll("a")) {
                            var equalto;
                            updatequestion(element);
                            if (element.getAttribute("style") && element.getAttribute("style").includes("background-image")) {
                                equalto = element.getAttribute("style");
                            } else {
                                equalto = element.innerText;
                            }
                            if (learned[list][realquestion] == equalto) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                // Delete question from learned table
                                delete learned[list][realquestion];
                                console.log(`%c completed ${realquestion}`,'color: #bada55')
                                localStorage.setItem("learned", JSON.stringify(learned))
                            }
                        }
                        equalitycheckdone = true;
                    }


                    (async () => {
                        equalitycheck();
                        do {
                            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                        } while (!equalitycheckdone)
                    })();

                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (choices.getElementsByClassName("correct").length == 0) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                if (element.getAttribute("class") == "correct") {
                                    if (choices.getElementsByClassName("incorrect").length != 0) {
                                        updatequestion(element);
                                        if (element.getAttribute("style") && element.getAttribute("style").includes("background-image")) {
                                            learned[list][realquestion] = element.getAttribute("style");
                                            console.log(`%c learning ${realquestion} %c(${element.getAttribute("style")})`,'color: #FF0000','color: #bada55')
                                        } else {
                                            learned[list][realquestion] = element.innerText;
                                            console.log(`%c learning ${realquestion} %c(${element.innerText})`,'color: #FF0000','color: #bada55')
                                        }
                                        localStorage.setItem("learned", JSON.stringify(learned));
                                    }
                                }
                            }
                        }
                    })();
                    break;
                default:
                    alert(`Unknown question type!\nAdd issue on https://github.com/urdakota/Vocabulary.com\nQuestion Type:${questiontype}`);
                    break;
            }

        }
    } else if (window.location.href.includes("/vocabtrainer/")){
        var screen = document.querySelector("#id-vocab-trainer");
        var questionholder = screen.querySelector("div.wrapper-main-trainer > main > ul > li > div > div.box-question");
        if (questionholder) {
            var questiontype = questionholder.getAttribute("class").split("box-question")[1].slice(1);
            switch (questiontype) {
                case "type-f": // continues to type-l
                case "type-h": // continues to type-l
                case "type-p": // continues to type-l
                case "type-l":
                    var realquestion = questionholder.querySelector("div.questionContent > div").innerText;
                    var choices = questionholder.querySelector("div.choices");

                    // Check if known & click
                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (learned[list][realquestion] == element.innerText) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                // Delete question from learned table
                                delete learned[list][realquestion];
                                console.log(`%c completed ${realquestion}`,'color: #bada55')
                                localStorage.setItem("learned", JSON.stringify(learned))
                            }
                        }
                    })();
                    
                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (choices.getElementsByClassName("correct").length == 0) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                if (!document.body.contains(element)) {
                                    learned[list][realquestion] = element.innerText;
                                    
                                    // Debug
                                    console.log(`%c learning ${realquestion} %c(${element.innerText})`,'color: #FF0000','color: #bada55')
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                }
                            }
                        }
                    })();
                    break;
                case "type-s": // continues do type-d
                case "type-a":
                case "type-d":
                    var realquestion = questionholder.querySelector("div.instructions").innerText;
                    var choices = questionholder.querySelector("div.choices");

                    // Check if known & click
                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (learned[list][realquestion] == element.innerText) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                // Delete question from learned table
                                delete learned[list][realquestion];
                                console.log(`%c completed ${realquestion}`,'color: #bada55')
                                localStorage.setItem("learned", JSON.stringify(learned))
                            }
                        }
                    })();
                    
                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (choices.getElementsByClassName("correct").length == 0) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                if (!document.body.contains(element)) {
                                    learned[list][realquestion] = element.innerText;
                                    
                                    // Debug
                                    console.log(`%c learning ${realquestion} %c(${element.innerText})`,'color: #FF0000','color: #bada55')
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                }
                            }
                        }
                    })();
                    break;
                case "type-i":
                    var realquestion = questionholder.querySelector("div.box-word > div").innerText;
                    var choices = questionholder.querySelector("div.choices");

                    // Check if known & click
                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (learned[list][realquestion] == element.getAttribute("style")) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                // Delete question from learned table
                                delete learned[list][realquestion];
                                console.log(`%c completed ${realquestion}`,'color: #bada55')
                                localStorage.setItem("learned", JSON.stringify(learned))
                            }
                        }
                    })();
                    
                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (choices.getElementsByClassName("correct").length == 0) {
                                element.click();
                                await new Promise((resolve, reject) => setTimeout(resolve, delay));
                                if (!document.body.contains(element)) {
                                    learned[list][realquestion] = element.getAttribute("style");
                                    
                                    // Debug
                                    console.log(`%c learning ${realquestion} %c(${element.getAttribute("style")})`,'color: #FF0000','color: #bada55')
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                }
                            }
                        }
                    })();
                    break;
                default:
                    alert(`Unknown question type!\nAdd issue on https://github.com/urdakota/Vocabulary.com\nQuestion Type:${questiontype}`);
                    break;
            }
        } 
    }
}

// Main loop
async function main() {
    var nextbtn;

    await new Promise((resolve, reject) => setTimeout(resolve, delay));
    await loop();

    if (window.location.href.split("/")[5].includes("practice")) {
        var nextbtn = document.querySelector("#challenge > div > div:nth-child(2) > button");

        do {
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        } while (nextbtn.getAttribute("class") != "next active")

        // Restart
        do {
            await new Promise((resolve, reject) => setTimeout(resolve, delay));
            nextbtn.click();
        } while (nextbtn.getAttribute("class") == "next active")
    } else {
        var nextbtn;
        var loops = 0;

        do {
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            nextbtn = document.querySelector("#id-vocab-trainer > div.wrapper-main-trainer > main > div > button");
        } while (!nextbtn)

        // Restart
        do {
            nextbtn.click();
            await new Promise((resolve, reject) => setTimeout(resolve, delay));
        } while (document.body.contains(nextbtn))
    }

    main();
}

main();