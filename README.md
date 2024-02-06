# Vocabulary.com Bot Bookmarklet
Automatic Vocabulary.com mastery bookmarklet \
Automatically answers questions (auto answer) \
I made this because im too lazy to do my vocab 🤑

![](auto.gif)

## HOW TO RUN
Make a new bookmark with this as the link & click it on your vocabulary.com practice
```JS
javascript:  fetch("https://raw.githubusercontent.com/urdakota/Vocabulary.com/main/Bypass/index.js").then((res) => res.text().then((t) => eval(t)))
```

## What it does 🤔
- Automatically guesses & remembers the answers for multiple choice questions
- Automatically guesses & remembers the answers for image questions
- Automatically fills in the answer for spelling questions
