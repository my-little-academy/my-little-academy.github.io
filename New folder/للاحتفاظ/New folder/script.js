// بيانات أسماء الله الحسنى مع معانيها
const asmaAlHusna = [
    { name: "الرحمن", meaning: "ذو الرحمة الواسعة التي وسعت كل شيء", reference: "الرحمن على العرش استوى (طه:5)" },
    { name: "الرحيم", meaning: "الرحمة الخاصة بالمؤمنين يوم القيامة", reference: "وكان بالمؤمنين رحيماً (الأحزاب:43)" },
    { name: "الملك", meaning: "المالك لكل شيء المتصرف فيه", reference: "فتعالى الله الملك الحق (طه:114)" },
    // يمكن إضافة بقية الأسماء بنفس الهيكل
    { name: "القدوس", meaning: "المنزه عن كل نقص وعيب", reference: "يسبح لله ما في السماوات وما في الأرض الملك القدوس (الجمعة:1)" },
    { name: "السلام", meaning: "المسلم لعباده من كل آفة", reference: "هو الله الذي لا إله إلا هو الملك القدوس السلام (الحشر:23)" }
    // ... (يمكن إضافة بقية الأسماء الـ99)
];

// إنشاء النجوم الخلفية
function createStars() {
    const container = document.querySelector('.stars-container');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // تحديد مواقع عشوائية
        const size = Math.random() * 3;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = 5 + Math.random() * 10;
        const opacity = 0.2 + Math.random() * 0.8;
        const delay = Math.random() * 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--opacity', opacity);
        star.style.animationDelay = `${delay}s`;
        
        container.appendChild(star);
    }
}

// عرض بطاقات الأسماء
function renderNames() {
    const container = document.getElementById('asma-container');
    
    asmaAlHusna.forEach(nameObj => {
        const card = document.createElement('div');
        card.className = 'asma-card animate__animated animate__fadeIn';
        card.innerHTML = `
            <div class="asma-name">${nameObj.name}</div>
        `;
        
        card.addEventListener('click', () => openModal(nameObj));
        container.appendChild(card);
    });
}

// فتح النافذة المنبثقة
function openModal(nameObj) {
    const modal = document.getElementById('name-modal');
    const title = document.getElementById('modal-title');
    const meaning = document.getElementById('modal-meaning');
    const reference = document.getElementById('modal-reference');
    
    title.textContent = nameObj.name;
    meaning.textContent = nameObj.meaning;
    reference.textContent = nameObj.reference;
    
    modal.style.display = 'flex';
}

// إغلاق النافذة المنبثقة
function closeModal() {
    const modal = document.getElementById('name-modal');
    modal.style.display = 'none';
}

// نسخ الاسم
function copyName() {
    const title = document.getElementById('modal-title').textContent;
    navigator.clipboard.writeText(title)
        .then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = 'تم النسخ!';
            setTimeout(() => {
                btn.textContent = 'نسخ الاسم';
            }, 2000);
        });
}

// استماع للاسم (وظيفة تجريبية)
function listenName() {
    const title = document.getElementById('modal-title').textContent;
    const utterance = new SpeechSynthesisUtterance(title);
    utterance.lang = 'ar-SA';
    speechSynthesis.speak(utterance);
}

// البحث عن الأسماء
function searchNames() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.asma-card');
    
    cards.forEach(card => {
        const name = card.querySelector('.asma-name').textContent.toLowerCase();
        if (name.includes(input)) {
            card.style.display = 'block';
            card.classList.add('animate__pulse');
        } else {
            card.style.display = 'none';
        }
    });
}

// تبديل الوضع الليلي
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
}

// الانتقال للأعلى
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    renderNames();
    
    // استعادة وضع الوضع الليلي من التخزين المحلي
    if (localStorage.getItem('darkMode') === 'enabled') {
        toggleDarkMode();
    }
    
    // إضافة الأحداث
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('copy-btn').addEventListener('click', copyName);
    document.getElementById('listen-btn').addEventListener('click', listenName);
    document.getElementById('search-btn').addEventListener('click', searchNames);
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchNames();
    });
    document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('scroll-top').addEventListener('click', scrollToTop);
    
    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('name-modal')) {
            closeModal();
        }
    });
});