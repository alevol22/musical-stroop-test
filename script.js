const colorEl = document.getElementById("color-title");
const colors = ["green", "red", "yellow", "blue"];
const timeStat = document.getElementById("time");
const correctStat = document.getElementById("num-correct");
const totalStat = document.getElementById("num-total");
const questionContainer = document.getElementById("questions-container");
let textColor = "green";
let word = "green";
let started = false;
let numTotal = 0;
let numCorrect = 0;
let timeRemaining = Number(timeStat.textContent);
let prevColor = "";
let page = 0;

const keys = {
    82: "red",
    71: "green",
    66: "blue",
    89: "yellow"
}
const colorCodes = {
    "green": "#2ecc71",
    "red": "#e74c3c",
    "blue": "#3498db",
    "yellow": "#f1c40f"
};

const results = {};

const getRandom = () => {
    return colors[Math.floor(Math.random() * colors.length)];
}
const reset = () => {
    do {
        textColor = getRandom();
        word = getRandom();
    } while (textColor === word || textColor === prevColor)
    prevColor = textColor;
    colorEl.textContent = word;
    colorEl.style.color = colorCodes[textColor];
}
const showPointIndicator = () => {
    document.getElementById("plus-indicator").style.opacity = 1;
}

/**
 * STROOP TEST
 */

//key inputs
window.addEventListener("keydown", (e) => {
    if (!started) {
        document.getElementById("desc").style.display = "none";
        reset();
        started = true;
    }
    const code = e.keyCode;
    if (keys[code]) {
        if (keys[code] == textColor) {
            numCorrect++;
            correctStat.textContent = numCorrect;
        } else {
            document.body.style.background = "red";
        }
        setTimeout(() => {
            document.body.style.background = "white";
        }, 300);
        numTotal++;
        totalStat.textContent = numTotal;
        reset();
    }
});
setInterval(() => {
    if (started) {
        timeRemaining--;
        timeStat.textContent = timeRemaining;
        if (timeRemaining === 0) {
            results.stroop = numCorrect;
            // showPage(Pages.SURVEY);              OVER HERE!!!!
            window.location.replace("endpage.html");
            //return true;
        }
    }
}, 1000)


/**
 * SURVEY
 */
document.getElementById("fast-button").addEventListener("click", () => {
    results.multilingual = true;
})
document.getElementById("slow-button").addEventListener("click", () => {
    results.multilingual = false;
})

document.getElementById("yes-button").addEventListener("click", () => {
    results.multilingual = true;
})
document.getElementById("no-button").addEventListener("click", () => {
    results.multilingual = false;
})


const classes = ["agree-lg answer answer-lg answer-agree", "agree-sm answer answer-sm answer-agree", "neutral answer", "disagree-sm answer answer-sm answer-disagree", "disagree-lg answer answer-lg answer-disagree"];
class Question {
    constructor(question, reverse, type) {
        this.val = -1;
        this.reverse = reverse;
        this.actualSelected = -1;
        this.answerEls = [];
        this.type = type

        const main = document.createElement("div");
        main.className = "question";
        questionContainer.appendChild(main);
        const header = document.createElement("h2");
        header.textContent = question;
        main.appendChild(header);
        const answers = document.createElement("div");
        main.appendChild(answers);
        answers.className = "answers";
        const agreeLabel = document.createElement("div");
        answers.appendChild(agreeLabel);
        agreeLabel.className = "side agree-side";
        agreeLabel.textContent = "Strongly Agree";
        for (let i = 0; i < 5; i++) {
            const answer = document.createElement("div");
            answers.appendChild(answer);
            this.answerEls.push(answer);
            answer.className = classes[i];
            answer.dataset.val = reverse ? i : (4 - i);
            const check = document.createElement("i");
            check.className = "material-icons";
            check.textContent = "check";
            answer.appendChild(check);
            answer.addEventListener("click", (event) => {
                this.val = Number(answer.dataset.val);
                this.selected = i;
            });
        }
        const disagreeLabel = document.createElement("div");
        answers.appendChild(disagreeLabel);
        disagreeLabel.className = "side disagree-side";
        disagreeLabel.textContent = "Strongly Disagree";
        const hr = document.createElement("hr");
        questionContainer.appendChild(hr);
    }
    set selected(val) {
        if (this.actualSelected != -1)
            this.answerEls[this.actualSelected].classList.remove("active");
        this.answerEls[val].classList.add("active");
        this.actualSelected = val;
    }
}
const questionPrompts = [{
    question: "I easily feel sad when the people around me feel sad.",
    reverse: false
}];
const questions = [];

function xwwwfurlenc(srcjson) {
    if (typeof srcjson !== "object")
        if (typeof console !== "undefined") {
            console.log("\"srcjson\" is not a JSON object");
            return null;
        }
    u = encodeURIComponent;
    var urljson = "";
    var keys = Object.keys(srcjson);
    for (var i = 0; i < keys.length; i++) {
        urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
        if (i < (keys.length - 1)) urljson += "&";
    }
    return urljson;
}
for (let i = 0; i < questionPrompts.length; i++)
    questions.push(new Question(questionPrompts[i].question, questionPrompts[i].reverse, questionPrompts[i].type));

document.getElementById("survey-button").addEventListener("click", () => {
    //verify
    for (let i = 0; i < questions.length; i++) {
        let val = questions[i].val;
        if (val === -1)
            return alert("Please complete all the questions.")
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/.netlify/functions/postResults');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        showPage(Pages.THANKS);
    };
    xhr.send(xwwwfurlenc(results));
});