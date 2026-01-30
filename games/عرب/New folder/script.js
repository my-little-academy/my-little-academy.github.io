/// script.js
const boardSquares = [
    { type: 'start', name: 'البداية', action: 'ابدأ رحلتك!' },
    { type: 'question', name: 'قاعدة الهمزة المتوسطة', question: 'اكتب كلمة بها همزة متوسطة على الألف.', answer: 'رأس', points: 10 },
    { type: 'bonus', name: 'مكافأة الإعراب', action: 'أحسنت! +15 نقطة', points: 15 },
    { type: 'penalty', name: 'خطأ إملائي شائع', action: 'لقد أخطأت! -10 نقاط', points: -10 },
    { type: 'question', name: 'التاء المربوطة والمفتوحة', question: 'صحح الخطأ الإملائي: "ذهبت إلى المدرسَةِ".', answer: 'المدرسة', points: 10 },
    { type: 'bonus', name: 'بونص النقطتين', action: 'نقاط إضافية! +20 نقطة', points: 20 },
    { type: 'question', name: 'ألف الوصل وهمزة القطع', question: 'اكمل الفراغ: "...سمي الطالب الدرس." (استخدم كلمة تبدأ بهمزة وصل أو قطع)', answer: 'استوعب', points: 10 },
    { type: 'penalty', name: 'نقص حرف', action: 'نسيت حرفاً! -15 نقطة', points: -15 },
    { type: 'question', name: 'علامات الترقيم', question: 'ضع علامة الترقيم المناسبة: "كيف حالك..."', answer: '؟', points: 10 },
    { type: 'bonus', name: 'إتقان الضمائر', action: 'إتقان! +25 نقطة', points: 25 },
    { type: 'question', name: 'الألف اللينة', question: 'صوب الخطأ في كلمة: "مستشفى".', answer: 'مستشفى', points: 10 }, // مثال على تصحيح لتدقيق المستخدم
    { type: 'penalty', name: 'خطأ إملائي جسيم', action: 'خطأ كبير! -20 نقطة', points: -20 },
    { type: 'question', name: 'الحروف الشمسية والقمرية', question: 'أدخل "الـ" على كلمة "شمس" واذكر نوعها.', answer: 'الشمس (شمسية)', points: 10, multiChoice: true, options: ['الشمس (شمسية)', 'الشمس (قمرية)'] },
    { type: 'bonus', name: 'المعجم اللغوي', action: 'اكتشاف كلمة جديدة! +30 نقطة', points: 30 },
    { type: 'question', name: 'الفعل الماضي والمضارع', question: 'صرف الفعل "درس" في الماضي مع الضمير "أنت".', answer: 'درست', points: 10 },
    { type: 'penalty', name: 'بطاقة حظ سيء', action: 'تخسر دوراً! -5 نقاط', points: -5 },
    { type: 'question', name: 'جمع التكسير', question: 'ما هو جمع كلمة "قلم"؟', answer: 'أقلام', points: 10 },
    { type: 'bonus', name: 'جائزة الاجتهاد', action: 'مثابرتك تؤتي ثمارها! +35 نقطة', points: 35 },
    { type: 'question', name: 'مصدر الفعل', question: 'ما مصدر الفعل "كتب"؟', answer: 'كتابة', points: 10 },
    { type: 'finish', name: 'بطل الإملاء', action: 'لقد أصبحت بطل الإملاء! تهانينا!' }
];

let currentPlayerPosition = 0;
let playerScore = 0;

const scoreDisplay = document.getElementById('score');
const currentPositionDisplay = document.getElementById('current-position');
const rollDiceBtn = document.getElementById('roll-dice');
const gameBoardDiv = document.querySelector('.game-board');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalQuestion = document.getElementById('modal-question');
const answerOptionsDiv = document.getElementById('answer-options');
const userAnswerInput = document.getElementById('user-answer');
const submitAnswerBtn = document.getElementById('submit-answer');
const modalFeedback = document.getElementById('modal-feedback');
const modalContinueBtn = document.getElementById('modal-continue');
const closeButton = document.querySelector('.close-button');

// إنشاء مربعات اللعبة ديناميكياً
function createBoard() {
    gameBoardDiv.innerHTML = ''; // مسح أي محتوى سابق
    boardSquares.forEach((square, index) => {
        const squareDiv = document.createElement('div');
        squareDiv.classList.add('square', square.type);
        squareDiv.id = `square${index}`;
        squareDiv.innerHTML = `<span>${square.name}</span>`;
        gameBoardDiv.appendChild(squareDiv);
    });
    updateBoardVisual();
}

function updateBoardVisual() {
    document.querySelectorAll('.square').forEach(sq => sq.classList.remove('current'));
    const currentSquare = document.getElementById(`square${currentPlayerPosition}`);
    if (currentSquare) {
        currentSquare.classList.add('current');
        currentPositionDisplay.textContent = boardSquares[currentPlayerPosition].name;
    }
    scoreDisplay.textContent = playerScore;
}

function showModal(title, question, isQuestion = false, multiChoice = false, options = []) {
    modalTitle.textContent = title;
    modalQuestion.textContent = question;
    modalFeedback.textContent = '';
    answerOptionsDiv.innerHTML = '';

    userAnswerInput.style.display = 'none';
    submitAnswerBtn.style.display = 'none';
    modalContinueBtn.style.display = 'none';

    if (isQuestion) {
        if (multiChoice) {
            options.forEach(option => {
                const btn = document.createElement('button');
                btn.textContent = option;
                btn.onclick = () => checkAnswer(option, boardSquares[currentPlayerPosition].answer, true);
                answerOptionsDiv.appendChild(btn);
            });
        } else {
            userAnswerInput.style.display = 'block';
            submitAnswerBtn.style.display = 'block';
            userAnswerInput.value = ''; // مسح الإدخال السابق
        }
    } else {
        modalContinueBtn.style.display = 'block';
    }
    modal.style.display = 'flex'; // استخدام flex لإظهار المودال وتوسيطه
}

function hideModal() {
    modal.style.display = 'none';
}

function checkAnswer(userAnswer, correctAnswer, isMultiChoice = false) {
    let isCorrect;
    if (isMultiChoice) {
        isCorrect = (userAnswer === correctAnswer);
    } else {
        // تنظيف الإجابات للمقارنة (إزالة المسافات الزائدة وتحويلها لحالة صغيرة إن أمكن)
        isCorrect = (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase());
    }

    if (isCorrect) {
        playerScore += boardSquares[currentPlayerPosition].points;
        modalFeedback.textContent = 'إجابة صحيحة! أحسنت.';
        modalFeedback.style.color = 'green';
    } else {
        playerScore += (boardSquares[currentPlayerPosition].points * -1); // خصم نفس النقاط
        modalFeedback.textContent = `إجابة خاطئة. الإجابة الصحيحة هي: "${correctAnswer}"`;
        modalFeedback.style.color = 'red';
    }
    modalFeedback.style.display = 'block';
    submitAnswerBtn.style.display = 'none';
    userAnswerInput.style.display = 'none';
    answerOptionsDiv.innerHTML = ''; // مسح خيارات الإجابة
    modalContinueBtn.style.display = 'block';
    updateBoardVisual();
}

rollDiceBtn.addEventListener('click', () => {
    const diceRoll = Math.floor(Math.random() * 3) + 1; // نرد من 1 إلى 3 خطوات لتسريع اللعبة
    let newPosition = currentPlayerPosition + diceRoll;

    if (newPosition >= boardSquares.length - 1) { // -1 لأن النهاية هي آخر مربع
        newPosition = boardSquares.length - 1; // الوصول إلى المربع الأخير
        currentPlayerPosition = newPosition;
        updateBoardVisual();
        showModal('نهاية اللعبة!', boardSquares[currentPlayerPosition].action);
        rollDiceBtn.disabled = true; // تعطيل النرد بعد الوصول للنهاية
        return; // توقف عن تنفيذ المزيد من المنطق
    }

    currentPlayerPosition = newPosition;
    updateBoardVisual();

    const currentSquare = boardSquares[currentPlayerPosition];

    setTimeout(() => { // تأخير بسيط لإظهار حركة اللاعب
        if (currentSquare.type === 'question') {
            if (currentSquare.multiChoice) {
                showModal('سؤال إملاء', currentSquare.question, true, true, currentSquare.options);
            } else {
                showModal('سؤال إملاء', currentSquare.question, true);
                // إعداد زر التأكيد للاستجابة للسؤال
                submitAnswerBtn.onclick = () => checkAnswer(userAnswerInput.value, currentSquare.answer);
            }
        } else if (currentSquare.type === 'bonus') {
            playerScore += currentSquare.points;
            showModal('مكافأة!', currentSquare.action);
        } else if (currentSquare.type === 'penalty') {
            playerScore += currentSquare.points; // النقاط ستكون سالبة هنا
            showModal('عقوبة!', currentSquare.action);
        }
        updateBoardVisual();
    }, 500); // تأخير نصف ثانية
});

modalContinueBtn.addEventListener('click', () => {
    hideModal();
    if (boardSquares[currentPlayerPosition].type === 'finish') {
        rollDiceBtn.disabled = true;
    } else {
        rollDiceBtn.disabled = false; // تفعيل النرد مرة أخرى
    }
});

closeButton.addEventListener('click', hideModal);

// إغلاق المودال عند النقر خارج المحتوى
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideModal();
    }
});

// تهيئة اللعبة عند التحميل
createBoard();
updateBoardVisual();
rollDiceBtn.disabled = false; // تفعيل النرد عند بدء اللعبة/ JavaScript Document