
/* Keeps a memory of all answers */

var learned = {}
if (localStorage.getItem("learned") !== null) { learned = JSON.parse(localStorage.getItem("learned")) }

/* These are functions that are used throughout the bot */

const debug = true;
const sleep = function (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
const define = async function (list) {
    var fin = {}
    fetch(`https://www.vocabulary.com/lists/${list}`).then(function (response) {
	    return response.text();
    }).then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var words = doc.querySelector("#wordlist");
        for (const element of words.getElementsByClassName("entry learnable")) {
            fin[element.getAttribute("word")] = element.querySelector("div").innerText;
        }
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
    return fin;
}
const waitforresult = async function(choice){ do {await sleep(100)} while (!choice.className.includes("correct"))}
const iscorrect =     async function(choice){ return (!choice.className.includes("incorrect") && choice.className.includes("correct"))}
const choicefunc =    async function(answers, callback = async function(a){a.click()}){
    for (const choice of answers.querySelectorAll("a")){
        if (!answers.querySelector("a.correct")) await callback(choice);
    }
    // example: choicefunc(choices.querySelectorAll("a"), function(a){ if(answer == a.innerText){ a.click } })
}

/* Actual Bot */
async function main() {
    //await 
    var mastery = !!document.querySelector("#id-vocab-trainer > div.wrapper-main-trainer");
    if (mastery) {
        var list = document.querySelector("#id-vocab-trainer > div.wrapper-main-trainer").getAttribute("data-wordlistid");
        var listdefinitions = {};
        if (list && !learned[list]){
            learned[list] = {};
            listdefinitions = define(list);
        }
        // style="background-image: url(&quot;https://cdn.vocab.com/questions/800/5ac271b161c391188405e198.jpg?w=400&quot;);"
        var trainer = document.querySelector("#id-vocab-trainer > div.wrapper-main-trainer > main");
        var box = trainer.querySelector("ul > li > div > div.box-question");
        if (!!box) {
            var choices = box.querySelector("div.choices");
            if (!!choices) {
                var questionContent = box.querySelector("div.questionContent");
                var instructions = box.querySelector("div.instructions");
                var boxword = box.querySelector("div.box-word");
                if (boxword) {
                    var question = boxword.innerText.replace(/(\r\n|\n|\r)/gm, " "); // Compatibility

                    // Check if already learned
                    await choicefunc(choices, async function(choice){ 
                        if(learned[list][question] == choice.style.backgroundImage){
                            choice.click();
                            await waitforresult(choice);

                            delete learned[list][question];
                            localStorage.setItem("learned", JSON.stringify(learned))

                            if(debug) console.log(`%c[${list}]%c (${question})%c`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                        }
                    })

                    // Guess
                    await choicefunc(choices, async function(choice){ 
                        choice.click();
                        await waitforresult(choice);
                        if (choice.className.includes("incorrect")){ await sleep(750) } else {
                            learned[list][question] = choice.style.backgroundImage;
                            localStorage.setItem("learned", JSON.stringify(learned));
                        }
                    })
                }
                if (!!questionContent) {
                    if (questionContent.querySelector("div")) {
                        var questionHolder= questionContent.querySelector("div");
                        var questionStyle = questionHolder.getAttribute("style");
                        var imageQuestion = questionStyle && questionStyle.includes("background-image");

                        // Non image cause its more readable trust me
                        if(!imageQuestion){
                            var questionText = questionHolder.innerText;

                            // Check if already learned
                            await choicefunc(choices, async function(choice){ 
                                if(learned[list][questionText] == choice.innerText){
                                    choice.click();
                                    await waitforresult(choice);

                                    delete learned[list][questionText];
                                    localStorage.setItem("learned", JSON.stringify(learned))

                                    if(debug) console.log(`%c[${list}]%c (${choice.innerText})%c ${questionText}`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                                }
                            })
                            
                            // Check if word is defined in vocab list
                            await choicefunc(choices, async function(choice){ 
                                if(questionText.includes(listdefinitions[choice.innerText])){
                                    choice.click();
                                    await waitforresult(choice);

                                    if(debug) console.log(`%c[${list}]%c (${choice.innerText})%c ${questionText}`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                                }
                            })

                            // Guess
                            await choicefunc(choices, async function(choice){ 
                                choice.click();
                                await waitforresult(choice);
                                if (choice.className.includes("incorrect")){ await sleep(750) } else {
                                    learned[list][questionText] = choice.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                }
                            })
                        } else {
                            var image = questionHolder.style.backgroundImage;

                            // Check if already learned
                            await choicefunc(choices, async function(choice){ 
                                if(learned[list][image] == choice.innerText){
                                    choice.click();
                                    await waitforresult(choice);

                                    delete learned[list][image];
                                    localStorage.setItem("learned", JSON.stringify(learned))

                                    if(debug) console.log(`%c[${list}]%c (${choice.innerText})%c`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                                }
                            })

                            // Guess
                            await choicefunc(choices, async function(choice){ 
                                choice.click();
                                await waitforresult(choice);
                                if (choice.className.includes("incorrect")){ await sleep(750) } else {
                                    learned[list][image] = choice.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                }
                            })
                        }
                    } else {
                        var questionStyle = questionContent.getAttribute("style");
                        var imageQuestion = questionStyle && questionStyle.includes("background-image");

                        if (imageQuestion) {

                            var image = questionContent.style.backgroundImage;
                            
                            await choicefunc(choices, async function(choice){ 
                                if(learned[list][image] == choice.innerText){
                                    choice.click();
                                    await waitforresult(choice);
        
                                    delete learned[list][image];
                                    localStorage.setItem("learned", JSON.stringify(learned))
        
                                    if(debug) console.log(`%c[${list}]%c (${question})%c`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                                }
                            })
    
                            // Guess
                            await choicefunc(choices, async function(choice){ 
                                choice.click();
                                await waitforresult(choice);
                                if (choice.className.includes("incorrect")){ await sleep(750) } else {
                                    learned[list][image] = choice.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                }
                            })
                        }
                    
                    }
                } else if (instructions) {
                    var realquestion = instructions.innerText;

                    // Check if known
                    var equalitycheckdone = 0;
                    (async () => {
                        for (const element of choices.querySelectorAll("a")) {
                            if (learned[list][realquestion] == element.innerText) {
                                element.click();
                                await sleep(250);
                                delete learned[list][realquestion];
                                localStorage.setItem("learned", JSON.stringify(learned))
        
                                // Debug
                                console.log(`%c completed ${realquestion}`, 'color: #bada55')
                            }
                            equalitycheckdone++;
                        }
                        do {
                            await sleep(1000);
                        } while (equalitycheckdone < 4 || choices.querySelector("a.correct"))
                    })();
    
                    
                    // Check if word is defined in vocab list
                    var definedcheckdone = 0;
                    (async () => {
                        for (const element of choices.querySelectorAll("a")) {
                            if (listdefinitions[element.innerText] == realquestion) {
                                element.click();
                                await sleep(250);

                                // Debug
                                console.log(`%c completed ${realquestion}`, 'color: #bada55')
                            }
                            definedcheckdone++;
                        }
                        do {
                            await sleep(1000);
                        } while (definedcheckdone < 4 || choices.querySelector("a.correct"))
                    })();

                    (async () => {
                        for await (const element of choices.querySelectorAll("a")) {
                            if (document.body.contains(choices) && choices.getElementsByClassName("correct").length == 0) {
                                element.click();
                                await sleep(750);
                                if (choices.getElementsByClassName("incorrect").length > 0 && !element.className.includes("incorrect") && element.className.includes("correct")) {
                                    learned[list][realquestion] = element.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                    
                                    // Debug
                                    console.log(`%c learning ${realquestion} %c(${element.innerText})`, 'color: #FF0000', 'color: #bada55')
                                }
                            }
                        }
                    })();
                }
            }
            else if (!!box.querySelector("div.spelltheword")) {
                var question = box.querySelector("div.questionContent");
                if (question.querySelector("div").getAttribute("class") == "sentence blanked") {
                    var realquestion = box.querySelector("div.questionContent > div").innerText;
                    var form = box.querySelector("div.spelltheword > form.form-spelling");
                    if (learned[list][realquestion]) {
                        form.querySelector("div.field.left > input").value = learned[list][realquestion];
                        form.querySelector("div.field.right > button.spellit.ss-write.left").click();

                        await sleep(250);
                        delete learned[list][realquestion];
                        localStorage.setItem("learned", JSON.stringify(learned))

                        // Debug
                        console.log(`%c completed ${realquestion}`, 'color: #bada55')
                    } else {
                        for( let i=3; i--; ){
                            form.querySelector("div.field.left > input").value = `guess ${i}`;
                            form.querySelector("div.field.right > button.spellit.ss-write.left").click();
                            await sleep(750);
                        }
                        (async () => {
                            form.querySelector("div.field.right > button.surrender.ss-flag.left").click();
                            await sleep(1000);
                            learned[list][realquestion] = trainer.querySelector("ul > li > div.box-explain-then-next > div.box-word-audio-add-list > a").innerText;
                            
                            localStorage.setItem("learned", JSON.stringify(learned));
                            console.log(`%c learning ${realquestion} %c(${learned[list][realquestion]})`, 'color: #FF0000', 'color: #bada55')         
                        })();
                    }
                }
            }
        }
    } else if(document.querySelector("#challenge > div > div.questionPane")){
        
    }

    //define("9051160").then(function (words) {
    //    console.log(words);
    //});

    do {
        await sleep(1000);
        nextbtn = document.querySelector("#id-vocab-trainer > div.wrapper-main-trainer > main > div > button");
    } while (!nextbtn)

    // Restart
    do {
        nextbtn.click();
        await sleep(1500);
    } while (document.body.contains(nextbtn))

    main();
}

main();
