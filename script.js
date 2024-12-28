document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

const mainContent = document.getElementById('main-content');
const categories = document.querySelectorAll('.category');

let currentQuestionIndex = 0;
let questions = [];
let correctAnswers = 0;

// Function to fetch questions
async function fetchQuestions(categoryId) {
    const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`
    );
    const data = await response.json();
    questions = data.results;
    displayQuestion();
}

// Function to display a question
function displayQuestion() {
    mainContent.innerHTML = '';

    if (currentQuestionIndex >= questions.length) {
        showStats();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('quiz-container');

    const question = document.createElement('div');
    question.classList.add('question');
    question.innerHTML = questionData.question;
    questionContainer.appendChild(question);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options');

    const allOptions = [...questionData.incorrect_answers, questionData.correct_answer];
    shuffleArray(allOptions);

    allOptions.forEach((option) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerText = option;

        optionElement.addEventListener('click', () => {
            // Check if the selected answer is correct
            if (option === questionData.correct_answer) {
                optionElement.style.border = '2px solid green';
                correctAnswers++;
            } else {
                optionElement.style.border = '2px solid red';
            }

            // Disable further clicks on other options
            const allOptionsElements = document.querySelectorAll('.option');
            allOptionsElements.forEach((opt) => {
                opt.style.pointerEvents = 'none';
                if (opt.innerText === questionData.correct_answer) {
                    opt.style.border = '2px solid green'; // Highlight correct answer
                }
            });

            // Move to the next question after a delay
            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion();
            }, 1500); // 1.5 seconds delay
        });

        optionsContainer.appendChild(optionElement);
    });

    questionContainer.appendChild(optionsContainer);
    mainContent.appendChild(questionContainer);
}

// Function to display statistics
function showStats() {
    mainContent.innerHTML = `
        <div class="stats">
            <h2>Quiz Complete!</h2>
            <p>You got ${correctAnswers} out of ${questions.length} questions correct.</p>
            <button onclick="location.reload()">Try Another Quiz</button>
        </div>
    `;
}

// Event listener for category clicks
categories.forEach((category) => {
    category.addEventListener('click', () => {
        const categoryId = category.dataset.id;
        currentQuestionIndex = 0;
        correctAnswers = 0;
        fetchQuestions(categoryId);
    });
});

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
