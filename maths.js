var answer;
var score = 0;

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    document.getElementById('n1').innerHTML = n1;

    const n2 = Math.floor(Math.random() * 6);
    document.getElementById('n2').innerHTML = n2;

    answer = n1 + n2;
}

function checkAnswer() {
    const pred = predictImage();
    console.log(pred)
    console.log(answer)

    if (pred == answer) {
        score++;
        console.log('correct');
        console.log(score);
        document.getElementById('score').innerHTML = score;
    }
    else {
        if (score != 0) {
            score--;
        }
        console.log('wrong');
        console.log(score);
        document.getElementById('score').innerHTML = score;
    }
}