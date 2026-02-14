document.addEventListener('DOMContentLoaded', function() {
    // تبديل اللغة
    const langBtn = document.getElementById('langBtn');
    langBtn.addEventListener('click', function() {
        const html = document.documentElement;
        if (html.lang === 'ar') {
            html.lang = 'en';
            html.dir = 'ltr';
            langBtn.textContent = 'AR';
            // هنا يمكنك إضافة تغيير النصوص للغة الإنجليزية
        } else {
            html.lang = 'ar';
            html.dir = 'rtl';
            langBtn.textContent = 'EN';
            // هنا يمكنك إعادة النصوص للغة العربية
        }
    });

    // القصة المصورة
    const storySlides = document.querySelectorAll('.story-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(n) {
        storySlides.forEach(slide => slide.classList.remove('active'));
        storySlides[n].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % storySlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + storySlides.length) % storySlides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // الأسئلة
    const questions = document.querySelectorAll('.question');
    const prevQuestionBtn = document.querySelector('.prev-question');
    const nextQuestionBtn = document.querySelector('.next-question');
    let currentQuestion = 0;

    function showQuestion(n) {
        questions.forEach(question => question.classList.remove('active'));
        questions[n].classList.add('active');
    }

    function nextQuestion() {
        currentQuestion = (currentQuestion + 1) % questions.length;
        showQuestion(currentQuestion);
        document.querySelector('.feedback').style.display = 'none';
    }

    function prevQuestion() {
        currentQuestion = (currentQuestion - 1 + questions.length) % questions.length;
        showQuestion(currentQuestion);
        document.querySelector('.feedback').style.display = 'none';
    }

    nextQuestionBtn.addEventListener('click', nextQuestion);
    prevQuestionBtn.addEventListener('click', prevQuestion);

    // اختيار الإجابة
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const feedback = document.querySelector('.feedback');
            if (this.textContent.includes('الفرق في طريقة النطق')) {
                feedback.textContent = 'إجابة صحيحة! أحسنت!';
                feedback.classList.add('correct');
                feedback.classList.remove('incorrect');
            } else {
                feedback.textContent = 'حاول مرة أخرى! فكر في الفرق بين اللامين';
                feedback.classList.add('incorrect');
                feedback.classList.remove('correct');
            }
            feedback.style.display = 'block';
        });
    });

    // الألعاب
    const gameTabs = document.querySelectorAll('.game-tab');
    const games = document.querySelectorAll('.game');

    gameTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            
            gameTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            games.forEach(g => g.classList.remove('active'));
            document.getElementById(gameId).classList.add('active');
        });
    });

    // لعبة التصنيف
    const words = document.querySelectorAll('.word');
    const targets = document.querySelectorAll('.target');

    words.forEach(word => {
        word.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.type);
            setTimeout(() => this.style.opacity = '0.4', 0);
        });

        word.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });

    targets.forEach(target => {
        target.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('highlight');
        });

        target.addEventListener('dragleave', function() {
            this.classList.remove('highlight');
        });

        target.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('highlight');
            
            const wordType = e.dataTransfer.getData('text/plain');
            const targetType = this.dataset.type;
            
            const feedback = document.querySelector('.game-feedback');
            
            if (wordType === targetType) {
                feedback.textContent = 'أحسنت! التصنيف صحيح';
                feedback.style.color = 'green';
            } else {
                feedback.textContent = 'هذا التصنيف غير صحيح، حاول مرة أخرى';
                feedback.style.color = 'red';
            }
        });
    });

    // لعبة الذاكرة
    const memoryPairs = [
        { word: 'الشمس', type: 'شمسية' },
        { word: 'القمر', type: 'قمرية' },
        { word: 'الرجل', type: 'شمسية' },
        { word: 'الكتاب', type: 'قمرية' },
        { word: 'النهر', type: 'قمرية' },
        { word: 'الضفدع', type: 'شمسية' }
    ];

    const memoryGrid = document.querySelector('.memory-grid');
    let memoryCards = [];
    let flippedCards = [];
    let matchedPairs = 0;

    function createMemoryGame() {
        memoryGrid.innerHTML = '';
        memoryCards = [];
        flippedCards = [];
        matchedPairs = 0;
        
        // مضاعفة الأزواج وخلطها
        const gameCards = [...memoryPairs, ...memoryPairs];
        gameCards.sort(() => Math.random() - 0.5);
        
        gameCards.forEach((card, index) => {
            const memoryCard = document.createElement('div');
            memoryCard.classList.add('memory-card');
            memoryCard.dataset.index = index;
            memoryCard.dataset.word = card.word;
            memoryCard.dataset.type = card.type;
            memoryCard.innerHTML = '<div class="card-front">؟</div><div class="card-back">' + card.word + '</div>';
            
            memoryCard.addEventListener('click', flipCard);
            memoryGrid.appendChild(memoryCard);
            memoryCards.push(memoryCard);
        });
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped') {
            this.classList.add('flipped');
            flippedCards.push(this);
            
            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    }

    function checkForMatch() {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];
        
        if (card1.dataset.type === card2.dataset.type) {
            card1.removeEventListener('click', flipCard);
            card2.removeEventListener('click', flipCard);
            matchedPairs++;
            
            if (matchedPairs === memoryPairs.length) {
                setTimeout(() => {
                    alert('مبروك! لقد أكملت اللعبة بنجاح!');
                    createMemoryGame();
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }
        
        flippedCards = [];
    }

    createMemoryGame();

    // لعبة الاختيار
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const feedback = document.querySelector('.quiz-feedback');
            
            if (this.classList.contains('correct')) {
                feedback.textContent = 'إجابة صحيحة! أحسنت!';
                feedback.style.color = 'green';
            } else {
                feedback.textContent = 'إجابة خاطئة، حاول مرة أخرى!';
                feedback.style.color = 'red';
            }
        });
    });

    // اختبار
    const testQuestions = document.querySelectorAll('.test-question');
    const prevTestBtn = document.querySelector('.prev-test');
    const nextTestBtn = document.querySelector('.next-test');
    const submitTestBtn = document.querySelector('.submit-test');
    const testResult = document.querySelector('.test-result');
    let currentTestQuestion = 0;
    let score = 0;

    function showTestQuestion(n) {
        testQuestions.forEach(question => question.classList.remove('active'));
        testQuestions[n].classList.add('active');
        
        // تحديث شريط التقدم
        const progress = (n + 1) / testQuestions.length * 100;
        document.querySelector('.progress-bar::after').style.width = progress + '%';
        document.querySelector('.progress-text').textContent = (n + 1) + '/' + testQuestions.length;
    }

    function nextTestQuestion() {
        currentTestQuestion = (currentTestQuestion + 1) % testQuestions.length;
        showTestQuestion(currentTestQuestion);
    }

    function prevTestQuestion() {
        currentTestQuestion = (currentTestQuestion - 1 + testQuestions.length) % testQuestions.length;
        showTestQuestion(currentTestQuestion);
    }

    nextTestBtn.addEventListener('click', nextTestQuestion);
    prevTestBtn.addEventListener('click', prevTestQuestion);

    submitTestBtn.addEventListener('click', function() {
        const selectedOption = document.querySelector('.test-question.active input[type="radio"]:checked');
        
        if (selectedOption) {
            if (selectedOption.value === 'sun' || selectedOption.value === 'option2') {
                score++;
            }
            
            if (currentTestQuestion < testQuestions.length - 1) {
                nextTestQuestion();
            } else {
                showTestResult();
            }
        } else {
            alert('الرجاء اختيار إجابة قبل المتابعة');
        }
    });

    function showTestResult() {
        testResult.textContent = `لقد حصلت على ${score} من ${testQuestions.length} نقاط!`;
        testResult.classList.add('show');
        submitTestBtn.style.display = 'none';
    }

    // القائمة المتنقلة للهواتف
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });

    // تأثيرات الحركة
    const animatedElements = document.querySelectorAll('.animate__animated');
    
    function checkAnimation() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate__fadeInUp');
            }
        });
    }
    
    window.addEventListener('scroll', checkAnimation);
    checkAnimation();

    // بدء الرحلة
    const startBtn = document.querySelector('.start-btn');
    startBtn.addEventListener('click', function() {
        document.querySelector('#story').scrollIntoView({ behavior: 'smooth' });
    });
});