// ⚠️ حط الرابط اللي نسخته من الـ Apps Script هنا بين علامات التنصيص
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxm4F_13cSMK8KHyV2fiUg2LVJ3Wn-ZsJfrnbQkk4GcoZ07HeQqHQ5n3FasHJDty8oChQ/exec";

const allowedUsers = [
    { name: "مينا مجدي", phone: "01234567890" },
    { name: "كيرلس جون", phone: "01011223344" },
    { name: "جون فادي", phone: "01555667788" }
];

const gifts = [
    "📖 كتاب روحي مشجع + شيكولاتة",
    "⌚ ساعة يد شبابية روعة",
    "🏅 ميدالية محفور عليها اسمك",
    "🎧 سماعة بلوتوث",
    "🎒 شنطة ظهر للدروس",
    "🖊️ قلم شيك ومذكرة صغيرة"
];

let currentUser = null;
let currentGift = "";
let isDrawing = false;
let isSaved = false;

const loginPage = document.getElementById('login-page');
const giftPage = document.getElementById('gift-page');
const btnCheck = document.getElementById('btn-check');
const errorMsg = document.getElementById('error-msg');
const welcomeUser = document.getElementById('welcome-user');
const giftResult = document.getElementById('gift-result');
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');

btnCheck.addEventListener('click', () => {
    const inputName = document.getElementById('user-name').value.trim();
    const inputPhone = document.getElementById('user-phone').value.trim();
    const userFound = allowedUsers.find(user => user.name === inputName && user.phone === inputPhone);

    if (userFound) {
        errorMsg.innerText = "";
        currentUser = userFound;
        loginPage.classList.add('hidden');
        giftPage.classList.remove('hidden');
        welcomeUser.innerText = `مبروووووك يا بطل يا ${inputName} 🤍☺️🥳`;

        const savedGift = localStorage.getItem(`gift_${inputPhone}`);
        if (savedGift) {
            currentGift = savedGift;
            giftResult.innerText = currentGift;
            canvas.style.display = "none";
            isSaved = true;
        } else {
            const randomIndex = Math.floor(Math.random() * gifts.length);
            currentGift = gifts[randomIndex];
            giftResult.innerText = currentGift;
            initScratchCard();
        }
    } else {
        errorMsg.innerText = "عاش يا بطل على المحاولة! شد حيلك الجمعة الجاية والتزم بالحضور عشان تدخل سحب الهدايا المرة الجاية 🤍";
    }
});

function initScratchCard() {
    ctx.fillStyle = '#b2bec3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '18px Segoe UI';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('اخدش هنا عشان تشوف هديتك ✨', canvas.width / 2, canvas.height / 2);
}

function scratch(x, y) {
    if (isSaved) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
    checkScratchPercentage();
}

function checkScratchPercentage() {
    if (isSaved) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let clearPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
    }
    if (clearPixels / (pixels.length / 4) > 0.25) {
        isSaved = true;
        canvas.style.transition = "opacity 0.4s ease";
        canvas.style.opacity = 0;
        setTimeout(() => { canvas.style.display = "none"; }, 400);
        localStorage.setItem(`gift_${currentUser.phone}`, currentGift);
        sendDataToExcel(currentUser.name, currentUser.phone, currentGift);
    }
}

// دالة الإرسال المباشر والجديدة للشيت بدون فورم
function sendDataToExcel(name, phone, gift) {
    const url = `${GOOGLE_SCRIPT_URL}?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&gift=${encodeURIComponent(gift)}`;
    fetch(url, { method: 'POST', mode: 'no-cors' })
    .then(() => console.log("Success"))
    .catch((err) => console.error(err));
}

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    scratch(e.touches.clientX - rect.left, e.touches.clientY - rect.top);
}, { passive: false });

canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    scratch(e.touches.clientX - rect.left, e.touches.clientY - rect.top);
}, { passive: false });
