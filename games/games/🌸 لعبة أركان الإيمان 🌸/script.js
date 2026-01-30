let draggedCard = null;

// سحب البطاقة
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('dragstart', () => {
    draggedCard = card;
  });

  card.addEventListener('dragend', () => {
    draggedCard = null;
  });
});

// التفاعل مع مناطق الإفلات
document.querySelectorAll('.drop-zone').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('over');
  });

  zone.addEventListener('drop', () => {
    if (!draggedCard) return;

    const targetData = zone.getAttribute('data-target');
    const cardData = draggedCard.getAttribute('data-card');

    if (targetData === cardData) {
      zone.innerHTML = '';
      zone.appendChild(draggedCard);
      zone.classList.remove('over');

      showFallingFlowers(); // زهور تسقط
      playSuccessSound();   // صوت النجاح

      checkWin(); // التحقق من الفوز
    } else {
      alert("الإجابة غير صحيحة! حاول مرة أخرى");
    }

    draggedCard = null;
  });
});

// التحقق من الفوز
function checkWin() {
  const zones = document.querySelectorAll('.drop-zone');
  let correct = true;

  zones.forEach(zone => {
    const targetData = zone.getAttribute('data-target');
    const card = zone.querySelector('.card');
    if (!card || card.getAttribute('data-card') !== targetData) {
      correct = false;
    }
  });

  if (correct) {
    setTimeout(() => {
      alert("🎉 مبروك! لقد أجبت جميع الأسئلة بشكل صحيح.");
    }, 300);
  }
}

// زهور تسقط من الأعلى
function showFallingFlowers() {
  const flowerContainer = document.getElementById('flowerContainer');
  const flower = document.createElement('img');
  flower.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Rose_flower.png/120px-Rose_flower.png'; 
  flower.className = 'falling-flower';
  flower.style.left = `${Math.random() * window.innerWidth}px`;
  flowerContainer.appendChild(flower);

  flower.addEventListener('animationend', () => {
    flower.remove();
  });
}

// زهرة تتبع المؤشر
document.addEventListener('mousemove', (e) => {
  const flower = document.getElementById('mouseFlower');
  flower.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 10}px)`;
  if (!flower.innerHTML) {
    flower.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Rose_flower.png/120px-Rose_flower.png"  alt="flower">`;
  }
});

// صوت عند الإجابة الصحيحة
function playSuccessSound() {
  const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3'); 
  audio.play();
}