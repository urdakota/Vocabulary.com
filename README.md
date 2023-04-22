# Vocabulary.com
Automatic Vocabulary.com mastery bookmarklet

This is a project i made for fun because im too lazy to do my vocab

## WARNING
*This can get your account **RESTRICTED** or **BANNED** if you set the delay too small*
 use **1500 MS** *1.5 seconds* or more in delay 

![](auto.gif)

## HOW TO RUN
Make a new bookmark with this as the link & click it on your vocabulary.com practice
```JS
javascript:  fetch("https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/index.js").then((res) => res.text().then((t) => eval(t)))
```

## What it does
- Automatically guesses & remembers the answers for multiple choice questions
- Automatically guesses & remembers the answers for image questions
- Automatically fills in the answer for spelling questions

### if your having issues such as the bot getting stuck on a question, run this bookmarklet in vocabulary.com
```JS
javascript: localStorage.setItem("learned",JSON.stringify({}))
```
