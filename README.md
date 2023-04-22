# Vocabulary.com
Automatic Vocabulary.com mastery bookmarklet

This is a project i made for fun because im too lazy to do my vocab

### What it do
- Gets the question
- Checks a list of previous questions for that question
- if its not on the list, it randomly guesses the answer
- if its on the list, it puts the answer

## WARNING
> *This can get your account **RESTRICTED** or **BANNED** if you set the delay too small*
> Id recommend around 2.5 seconds in delay

## HOW TO RUN
Make a new bookmark with this as the link:
```JS
javascript:  fetch("https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/index.js").then((res) => res.text().then((t) => eval(t)))
```
