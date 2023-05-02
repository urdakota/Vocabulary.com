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
if (list && !learned[list] || !(learned[list].length > 0)) {
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
    var screen = document.querySelector("#id-vocab-trainer");
    var questionholder = screen.querySelector("div.wrapper-main-trainer > main > ul > li > div > div.box-question");
    if (questionholder) {
        var choices = questionholder.querySelector("div.choices");
        if (choices){
            if (questionholder.querySelector("div.questionContent > div")){
                var realquestion = questionholder.querySelector("div.questionContent > div").innerText;
                
                // Check if known
                var equalitycheckdone = false;
                async function equalitycheck1(){
                    equalitycheckdone = false;
                    for (const element of choices.querySelectorAll("a")) {
                        if (learned[list][realquestion] == element.innerText) {
                            element.click();
                            await new Promise((resolve, reject) => setTimeout(resolve, delay));
                            // Delete question from learned table
                            delete learned[list][realquestion];
                            console.log(`%c completed ${realquestion}`, 'color: #bada55')
                            localStorage.setItem("learned", JSON.stringify(learned))
                        }
                    }
                    equalitycheckdone = true;
                }

                (async () => {
                    var loops = 0;
                    equalitycheck1();
                    do {
                        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                        loops++;
                    } while (!equalitycheckdone || loops < ((delay/1000)*5))
                })();

                (async () => {
                    for await (const element of choices.querySelectorAll("a")) {
                        if (document.body.contains(choices) && choices.getElementsByClassName("correct").length == 0) {
                            element.click();
                            await new Promise((resolve, reject) => setTimeout(resolve, delay));
                            if (choices.getElementsByClassName("incorrect").length >= 0 && !document.body.contains(element)) {
                                learned[list][realquestion] = element.innerText;
                                
                                // Debug
                                console.log(`%c learning ${realquestion} %c(${element.innerText})`,'color: #FF0000','color: #bada55')
                                localStorage.setItem("learned", JSON.stringify(learned));
                            }
                        }
                    }
                })();
            } else if (questionholder.querySelector("div.instructions")){
                var realquestion = questionholder.querySelector("div.instructions").innerText;
            } else if (questionholder.querySelector("div.box-word > div")){
                var realquestion = questionholder.querySelector("div.box-word > div").innerText;
            }
        } else {

        }
    }
}

// Main loop
async function main() {
    var nextbtn = document.querySelector("#challenge > div > div:nth-child(2) > button");
    await loop();

    do {
        await new Promise((resolve, reject) => setTimeout(resolve, 250));
    } while (nextbtn.getAttribute("class") != "next active")

    // Restart
    do {
        await new Promise((resolve, reject) => setTimeout(resolve, 250));
        nextbtn.click();
    } while (nextbtn.getAttribute("class") == "next active")
    await new Promise((resolve, reject) => setTimeout(resolve, delay));

    main();
}

main();