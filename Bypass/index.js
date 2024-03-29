
const debug  = true;
/* Keeps a memory of all answers */

var learned = {}
if (localStorage.getItem("learned") !== null) { learned = JSON.parse(localStorage.getItem("learned")) }

/* These are functions that are used throughout the bot */

const select = (_, el=document) => el.querySelector(_);
const wait   = (t) => new Promise(_ => setTimeout(_, t*1000));

const waitforresult = async function(choice){ do {await wait(.1)} while (!choice.className.includes("correct"))}
const iscorrect =     async function(choice){ return (!choice.className.includes("incorrect") && choice.className.includes("correct"))}
const choicefunc =    async function(answers, callback = async function(a){a.click()}){
    for (const choice of answers.querySelectorAll("a")){
        if (!answers.querySelector("a.correct")) await callback(choice);
    }
}

const define = async function (list) {
    var fin = {}
    if (list=="undefined") return {};
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
/* Actual Bot */
async function main() {
    //await 
    var mastery  = select("#id-vocab-trainer > div.wrapper-main-trainer");
    var practice = select("#challenge > div > div.questionPane");
    if (!!mastery) {
        var list = mastery.getAttribute("data-wordlistid");
        var listdefinitions = {};
        if (list == undefined) list = "undefined";
        if (list && !learned[list]){
            learned[list] = {};
            listdefinitions = define(list);
        }

        var trainer = select("main", mastery);
        var box = select("ul > li > div > div.box-question", trainer);
        if (!!box) {
            var choices = select("div.choices", box);
            var spelltheword = select("div.spelltheword", box);
            if (!!choices) {
                var questionHolder;
                var questionContent = select("div.questionContent", box);
                if (!!questionContent) questionHolder = select("div", questionContent);
                var instructions = select("div.instructions", box);
                var boxword = select("div.box-word", box);
                if (!!boxword) {
                    var question = boxword.innerText.replace(/(\r\n|\n|\r)/gm, " "); // Compatibility

                    // Check if already learned
                    await choicefunc(choices, async function(choice){ 
                        if(learned[list][question] == choice.style.backgroundImage){
                            choice.click();
                            await waitforresult(choice);

                            delete learned[list][question];
                            localStorage.setItem("learned", JSON.stringify(learned))

                            console.log(`%c completed ${question}`, 'color: #bada55');
                        }
                    })

                    // Guess
                    await choicefunc(choices, async function(choice){ 
                        choice.click();
                        await waitforresult(choice);
                        if (choice.className.includes("incorrect")){ await wait(.75) } else {
                            learned[list][question] = choice.style.backgroundImage;
                            localStorage.setItem("learned", JSON.stringify(learned));

                            console.log(`%c learning %c[${question}]%c (${choice.style.backgroundImage})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                        }
                    })
                }

                if (instructions) {
                    var questionText = instructions.innerText;

                    // Check if already learned
                    await choicefunc(choices, async function(choice){ 
                        if(learned[list][questionText] == choice.innerText){
                            choice.click();
                            await waitforresult(choice);

                            delete learned[list][questionText];
                            localStorage.setItem("learned", JSON.stringify(learned))

                            console.log(`%c completed ${questionText}`, 'color: #bada55');
                        }
                    })
                    
                    // Check if word is in vocab list
                    await choicefunc(choices, async function(choice){ 
                        if(questionText.includes(listdefinitions[choice.innerText])){
                            choice.click();
                            await waitforresult(choice);

                            console.log(`%c completed ${questionText}`, 'color: #bada55');
                        }
                    })

                    // Guess
                    await choicefunc(choices, async function(choice){ 
                        choice.click();
                        await waitforresult(choice);
                        if (choice.className.includes("incorrect")){ await wait(.75) } else {
                            learned[list][questionText] = choice.innerText;
                            localStorage.setItem("learned", JSON.stringify(learned));
                            
                            console.log(`%c learning %c[${questionText}]%c (${choice.innerText})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                        }
                    })
                }

                if (!!questionContent && !!questionHolder) {

                    var questionStyle = questionContent.getAttribute("style");
                    var questionHolderStyle = questionHolder.getAttribute("style");
                    if (!!questionHolder) {
                        var imageQuestion = !!questionHolderStyle && questionHolderStyle.includes("background-image");

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

                                    console.log(`%c completed ${questionText}`, 'color: #bada55');
                                }
                            })
                            
                            // Check if word is in vocab list
                            await choicefunc(choices, async function(choice){ 
                                if(questionText.includes(listdefinitions[choice.innerText])){
                                    choice.click();
                                    await waitforresult(choice);

                                    console.log(`%c completed ${questionText}`, 'color: #bada55');
                                }
                            })

                            // Guess
                            await choicefunc(choices, async function(choice){ 
                                choice.click();
                                await waitforresult(choice);
                                if (choice.className.includes("incorrect")){ await wait(.75) } else {
                                    learned[list][questionText] = choice.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));

                                    console.log(`%c learning %c[${questionText}]%c (${choice.innerText})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
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

                                    console.log(`%c completed ${choice.innerText}`, 'color: #bada55');
                                }
                            })

                            // Guess
                            await choicefunc(choices, async function(choice){ 
                                choice.click();
                                await waitforresult(choice);
                                if (choice.className.includes("incorrect")){ await wait(.75) } else {
                                    learned[list][image] = choice.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                    
                                    console.log(`%c learning %c[${image}]%c (${choice.innerText})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                                }
                            })
                        }
                    } else {
                        var imageQuestion = !!questionStyle && questionStyle.includes("background-image");

                        if (!imageQuestion) {
                            var questionText = questionContent.innerText;

                            // Check if already learned
                            await choicefunc(choices, async function(choice){ 
                                if(learned[list][questionText] == choice.innerText){
                                    choice.click();
                                    await waitforresult(choice);

                                    delete learned[list][questionText];
                                    localStorage.setItem("learned", JSON.stringify(learned))

                                    console.log(`%c completed ${questionText}`, 'color: #bada55');
                                }
                            })
                            
                            // Check if word is in vocab list
                            await choicefunc(choices, async function(choice){ 
                                if(questionText.includes(listdefinitions[choice.innerText])){
                                    choice.click();
                                    await waitforresult(choice);

                                    console.log(`%c completed ${questionText}`, 'color: #bada55');
                                }
                            })

                            // Guess
                            await choicefunc(choices, async function(choice){ 
                                choice.click();
                                await waitforresult(choice);
                                if (choice.className.includes("incorrect")){ await wait(.75) } else {
                                    learned[list][questionText] = choice.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                    
                                    console.log(`%c learning %c[${questionText}]%c (${choice.innerText})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                                }
                            })
                        } else {
                            var image = questionContent.style.backgroundImage;
                            
                            // Check if already learned
                            await choicefunc(choices, async function(choice){ 
                                if(learned[list][image] == choice.innerText){
                                    choice.click();
                                    await waitforresult(choice);
        
                                    delete learned[list][image];
                                    localStorage.setItem("learned", JSON.stringify(learned))
        
                                    console.log(`%c completed ${image}`, 'color: #bada55');
                                }
                            })
    
                            // Guess
                            await choicefunc(choices, async function(choice){ 
                                choice.click();
                                await waitforresult(choice);
                                if (choice.className.includes("incorrect")){ await wait(.75) } else {
                                    learned[list][image] = choice.innerText;
                                    localStorage.setItem("learned", JSON.stringify(learned));
                                    
                                    console.log(`%c learning %c[${image}]%c (${choice.innerText})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                                }
                            })
                        }
                    
                    }
                } 
            }
            else if (!!spelltheword) {
                var question = select("div.questionContent", box);
                var questionbox = select("div", question);
                if (questionbox.getAttribute("class") == "sentence blanked") {
                    var realquestion = questionbox.innerText;
                    var form = select("form.form-spelling", spelltheword);

                    var textbox = select("div.field.left > input", form);
                    var guess = select("div.field.right > button.spellit.ss-write.left", form);
                    var giveup = select("div.field.right > button.surrender.ss-flag.left", form);

                    if (learned[list][realquestion]) {
                        textbox.value = learned[list][realquestion];
                        guess.click();

                        await wait(.25);
                        delete learned[list][realquestion];
                        localStorage.setItem("learned", JSON.stringify(learned))

                        // Debug
                        console.log(`%c completed ${realquestion}`, 'color: #bada55')
                    } else {
                        for( let i=3; i--; ){
                            textbox.value = `guess ${3-i}`;
                            guess.click();
                            await wait(.75);
                        }
                        (async () => {
                            giveup.click();
                            await wait(1);
                            // finds answer on screen appearing on right
                            learned[list][realquestion] = select("ul > li > div.box-explain-then-next > div.box-word-audio-add-list > a", trainer).innerText;
                            
                            localStorage.setItem("learned", JSON.stringify(learned));
                            console.log(`%c learning %c[${realquestion}]%c (${learned[list][realquestion]})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');      
                        })();
                    }
                }
            }
        }
    } else if(!!practice){
        var list = select("#challenge").getAttribute("data-wordlistid");
        var listdefinitions = {};
        if (list == undefined) list = "undefined";
        if (list && !learned[list]){
            learned[list] = {};
            listdefinitions = define(list);
        }

        var currentscreen = practice.children[(practice.children.length) - 1];
        var questionHolder = select("div > section.left > div.question", currentscreen);

        if (!!questionHolder) {
            var questionContent = select("div.questionContent", questionHolder);
            var instructions = select("div.instructions", questionHolder);
            var choices = select("div.choices", questionHolder);

            var questionSentence = (!!questionContent) && select("div.sentence", questionContent);

            if (!!choices) {
                var question = (!!questionSentence) && questionSentence.innerText || instructions.innerText;
                question = question.replace(/(\r\n|\n|\r)/gm, " ");
                
                // Check if already learned
                await choicefunc(choices, async function(choice){ 
                    var answer = (choice.style.backgroundImage == "" && choice.innerText) || choice.style.backgroundImage;
                    if(learned[list][question] == answer){
                        choice.click();
                        await waitforresult(choice);

                        delete learned[list][question];
                        localStorage.setItem("learned", JSON.stringify(learned))

                        console.log(`%c completed ${question}`, 'color: #bada55');
                    }
                })

                // Check if word is in vocab list
                await choicefunc(choices, async function(choice){ 
                    if(question.includes(listdefinitions[choice.innerText])){
                        choice.click();
                        await waitforresult(choice);

                        console.log(`%c completed ${questionText}`, 'color: #bada55');
                    }
                })

                // Guess
                await choicefunc(choices, async function(choice){ 
                    choice.click();
                    await waitforresult(choice);
                    if (choice.className.includes("incorrect")) { await wait(.75) } else {
                        var answer = (choice.style.backgroundImage == "" && choice.innerText) || choice.style.backgroundImage;
                        learned[list][question] = answer;
                        localStorage.setItem("learned", JSON.stringify(learned));

                        console.log(`%c learning %c[${question}]%c (${answer})`, 'color: #ADD8E6', 'color: #FF0000', 'color: #bada55');
                    }
                })

            } else if(!!questionSentence){
                var word = select("div.sentence.complete", questionContent).getElementsByTagName("strong")[0].innerText;
                select("div.spelltheword > div.field.left > input", questionHolder).value = word;
                select("div.spelltheword > div.field.right > button.spellit.ss-write.left", questionHolder).click();
            } else {
                alert("wat is this?");
            }
        }
    } else {
        alert("Couldn\'t detect mode!");
    }

    do {
        await wait(1);
        if (!!mastery) nextbtn = select("#id-vocab-trainer > div.wrapper-main-trainer > main > div > button");
        if (!!practice) {
            nextbtn = select("#challenge > div > div:nth-child(2) > button");
        }
    } while (!nextbtn)

    // Restart
    do {
        if (!practice) { nextbtn.click() } else {
            if (nextbtn.getAttribute("class") == "next active") nextbtn.click()
        }
        await wait(1.5);
    } while (document.body.contains(nextbtn) && (!practice) || (nextbtn.getAttribute("class") == "next active"))

    main();
}

main();
