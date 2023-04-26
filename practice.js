const delay = prompt("Delay between loops (Seconds)", 1.75)*1000;
const sleep = function(ms) {return new Promise(resolve => setTimeout(resolve, ms))}
const fetchlist = async function(id) {
    const response = await fetch(`https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/lists/${id}.json`)
        
    if (response.status == 200) {
        let returnedjs = await response.text()
        return JSON.parse(returnedjs)
    } else if (response.status === 404) { // Didn't exist
        return {}
    }
}
const list = window.location.href.split("/")[4]

var learned = {}
if (localStorage.getItem("learned") !== null) { learned = JSON.parse(localStorage.getItem("learned")) }

if (!learned[list] || !(learned[list].length > 0)) {
    learned[list] = {};
    var done = false;
    fetchlist(list).then(function (result) {
        if (result) {
            learned[list] = result;
        }
        done = true;
    });
    (async () => {
        do {
            await sleep(delay);
        } while (!done)
        localStorage.setItem("learned", JSON.stringify(learned))
    })();
}

function loop() {
    var screens = document.querySelector("#challenge > div > div.questionPane");
    var currentscreen = screens.children[(screens.children.length) - 1];
    var questionholder = currentscreen.querySelector("div > section.left > div.question");

    if (questionholder) {
        var question = questionholder.querySelector("div.questionContent");
        var questiontype = currentscreen.getAttribute("data-slide-type");
        var questionproperty = questionholder.getAttribute("class").split("question ")[1];
        switch (questiontype) {
            case "spelling":
                var word = question.querySelector("div.sentence.complete").getElementsByTagName("strong")[0].innerText;
                questionholder.querySelector("div.spelltheword > div.field.left > input").value = word;
                (async () => {
                    await sleep(delay);
                    questionholder.querySelector("div.spelltheword > div.field.right > button.spellit.ss-write.left").click();
                })();
                break;
            case "choice":
                var answer;
                var realquestion;
                var equalitycheckdone = false;
                var choices = questionholder.querySelector("div.choices");
                var questions = choices.querySelectorAll("a")
                if (!learned[list][questionproperty]) {
                    learned[list][questionproperty] = {};
                }
                
                if (!(choices.children[0].getAttribute("style") && choices.children[0].getAttribute("style").includes("background-image"))) {
                    if (question.children.length == 0) {
                        realquestion = questionholder.querySelector("div.instructions").innerText;
                    } else {
                        realquestion = question.children[0].innerText
                    }
                } else {
                    realquestion = questionholder.querySelector("div.word > div").innerText;
                }

                async function equalitycheck() {
                    equalitycheckdone = false;
                    var answer;
                    if (learned[list][questionproperty] && learned[list][questionproperty][realquestion]) {
                        for (const element of questions) {
                            if (element.getAttribute("style") && element.getAttribute("style").includes("background-image")) {
                                answer = element.getAttribute("style");
                            } else {
                                answer = element.innerText;
                            }
                            if (learned[list][questionproperty][realquestion] == answer) {
                                await sleep(delay);
                                element.click();
                                console.log(`%c completed ${realquestion}`, 'color: #bada55')
                            }
                        }
                    }
                    equalitycheckdone = true;
                }

                (async () => {
                    equalitycheck();
                    do {
                        await sleep(delay);
                    } while (!equalitycheckdone)
                    
                    for await (const element of questions) {
                        if (choices.getElementsByClassName("correct").length == 0) {
                            await sleep(delay);
                            element.click();
                            if (element.getAttribute("class") == "correct") {
                                if (element.getAttribute("style") && element.getAttribute("style").includes("background-image")) {
                                    answer = element.getAttribute("style");
                                } else {
                                    answer = element.innerText;
                                }
                                learned[list][questionproperty][realquestion] = answer;
                                console.log(`%c learning ${realquestion} %c(${answer})`, 'color: #FF0000', 'color: #bada55')
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

// Main loop
async function main() {
    var nextbtn = document.querySelector("#challenge > div > div:nth-child(2) > button");
    await loop();

    do {
        await sleep(250);
    } while (nextbtn.getAttribute("class") != "next active")

    // Restart
    do {
        await sleep(250);
        nextbtn.click();
    } while (nextbtn.getAttribute("class") == "next active")

    main();
}

main();