const noBtn = document.getElementById('noBtn');

// This function teleports the button when the mouse hovers over it
function flyAway() {
    // Calculate random positions within the browser window width and height
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    // Apply the new position styles instantly
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
}

// Trigger on desktop mouse hover
noBtn.addEventListener('mouseover', flyAway);

// Trigger on mobile screen touches
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents accidental clicks while moving
    flyAway();
});

// --- Floating love hearts background ---
const heartsBg = document.getElementById('heartsBg');
const heartEmojis = ['❤️', '💕', '💖', '💗', '💘', '🩷'];

function createHeart() {
    const heart = document.createElement('span');
    heart.classList.add('heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    const startX = Math.random() * window.innerWidth;
    const duration = 6 + Math.random() * 6; // 6-12s
    const size = 16 + Math.random() * 20; // 16-36px

    heart.style.left = startX + 'px';
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = duration + 's';

    heartsBg.appendChild(heart);

    // Clean up after animation finishes
    setTimeout(() => heart.remove(), duration * 1000);
}

// Spawn a new heart every 400ms
setInterval(createHeart, 400);

// --- Celebration sequence: book popup -> confetti burst + "I love you" ---
function celebrate() {
    const bookOverlay = document.getElementById('bookOverlay');
    const celebration = document.getElementById('celebration');
    const questionCard = document.getElementById('questionCard');

    // Hide the question card so nothing overlaps with the show
    questionCard.style.display = 'none';

    // Step 1: show the book icon, which pops in, fades, then flips open into the page
    bookOverlay.classList.add('active');

    // Book animation: icon pop+fade (1.4s) + page open (0.6s) = 2s to fully open,
    // then hold the open page for 8s so the message can be read before it closes
    setTimeout(() => {
        bookOverlay.classList.remove('active');

        celebration.classList.add('active');
        launchConfetti();
        showLoveText();

        // Step 3: clean up after the love text finishes
        setTimeout(() => {
            celebration.classList.remove('active');
            document.getElementById('loveText').innerHTML = '';
        }, 5000);
    }, 10000);
}

function showLoveText() {
    const loveText = document.getElementById('loveText');
    loveText.innerHTML = '';
    const words = ['I', '❤️', 'LOVE', 'YOU','JOZIE'];

    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.animationDelay = (i * 0.5) + 's';
        loveText.appendChild(span);
    });
}

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const colors = ['#ff4d6d', '#ff8fa3', '#ffd1dc', '#ffe66d', '#ffffff', '#ff1f4e'];
    const particles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create a burst of particles shooting outward from the center (popper effect)
    for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 10;
        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 4, // initial upward kick
            size: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.15,
            life: 1
        });
    }

    let frame = 0;
    function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.life -= 0.006;

            ctx.save();
            ctx.globalAlpha = Math.max(p.life, 0);
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            ctx.restore();
        });

        if (frame < 220) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}