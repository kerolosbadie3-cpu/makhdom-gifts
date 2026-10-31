// قاعدة بيانات الحاضرين بالاسم الرباعي (سليمة وتم فحصها بالكامل)
const allowedUsers = [
    { name: "كيرلس ايمن سعيد جميلر" },
    { name: "فادي غطاس شكري عياد" },
    { name: "جرجس صموئيل فرج حبيب" },
    { name: "يوحنا عماد ميلاد منير" },
    { name: "أبانوب اسعد وليم عياد" },
    { name: "مايكل منير شفيق نسيم" },
    { name: "إسحق ناصر رفعت لبيب" },
    { name: "ملاك فايز عادل توفيق" },
    { name: "تادرس بهجت صبحي كامل" },
    { name: "توماس أمير وجيه وهبه" },
    { name: "مينا سمير فؤاد غالي" },
    { name: "أندرو سامح نصيف عازر" },
    { name: "شنودة ممدوح كمال صبري" },
    { name: "أرسانيوس أشرف رزق قزمان" },
    { name: "بولا إيهاب هاني رزق" },
    { name: "ماريو رفعت شحاتة بديع" },
    { name: "أبراهام نجيب سعيد منقريوس" },
    { name: "متى هاني نبيل فرج" },
    { name: "توني عادل رمزي فوزي" },
    { name: "بافلي مايكل ناجي خليل" },
    { name: "كيرلس رزق منير شفيق" },
    { name: "يوسف ممدوح نصحي فايز" },
    { name: "ميرون فايز صبري عازر" },
    { name: "إيليا رأفت كمال توفيق" },
    { name: "إرميا سامح عياد رزق" },
    { name: "يوستوس عادل فرج حبيب" },
    { name: "أنطونيوس ممدوح صبري عازر" },
    { name: "جرجس رأفت شفيق منير" },
    { name: "مينا أشرف رزق شحاتة" },
    { name: "أندرو ناصر شكري وديع" }
];

// قائمة الهدايا المباشرة والمبسطة بدون أي رموز أو بطاقات جانبية
const gifts = [
    "25 كارت",
    "30 كارت",
    "35 كارت",
    "40 كارت",
    "45 كارت",
    "50 كارت",
    "55 كارت"
];

let currentUser = null;
let currentGift = "";
let isDrawing = false;
let isSaved = false;

const loginPage = document.getElementById('login-page');
const giftPage = document.getElementById('gift-page');
const btnCheck = document.getElementById('btn-check');
const btnLogout = document.getElementById('btn-logout');
const errorMsg = document.getElementById('error-msg');
const welcomeUser = document.getElementById('welcome-user');
const giftResult = document.getElementById('gift-result');
const scratchInstruction = document.getElementById('scratch-instruction');

const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');

// دالة تنظيف الحروف المضمونة لإزالة الفروق الإملائية والمسافات
function normalizeArabic(text) {
    if (!text) return "";
    return text
        .replace(/[\u064B-\u065F]/g, "") 
        .replace(/[أإآ]/g, "ا")         
        .replace(/ة/g, "ه")            
        .replace(/ى/g, "ي")            
        .replace(/\s+/g, " ")          
        .trim();                       
}

btnCheck.addEventListener('click', () => {
    const inputName = document.getElementById('user-name').value;

    if (!inputName.trim()) {
        errorMsg.innerText = "من فضلك اكتب اسمك أولاً يا بطل! ⚠️";
        return;
    }

    const cleanInput = normalizeArabic(inputName);
    const inputWords = cleanInput.split(" ");
    const inputFirstWord = inputWords[0]; 

    // آلية بحث جديدة مبسطة ومضمونة تماماً ومحصنة ضد التعطيل
    const userFound = allowedUsers.find(user => {
        const cleanDBName = normalizeArabic(user.name);
        const dbWords = cleanDBName.split(" ");
        const dbFirstWord = dbWords[0];

        // 1. يجب أن يتطابق الاسم الأول تماماً لحماية خصوصية الإخوات والأقارب
        if (inputFirstWord !== dbFirstWord) return false;

        // 2. مقارنة ذكية ومبسطة: إذا كتب كلمة أخرى صحيحة من بقية الاسم يفتح فوراً
        if (inputWords.length >= 2) {
            return cleanDBName.includes(inputWords[1]) || cleanDBName.includes(cleanInput);
        }
        
        return cleanDBName.includes(cleanInput);
    });

    if (userFound) {
        errorMsg.innerText = "";
        currentUser = userFound;
        
        loginPage.classList.add('hidden');
        giftPage.classList.remove('hidden');
        
        welcomeUser.innerHTML = `مبروووووك يا بطل 🎉🥳 <br> <span style="font-size: 20px; display: block; margin-top: 8px; color: #0984e3;">يا ${userFound.name}</span>`;

        const savedGift = localStorage.getItem(`gift_${normalizeArabic(userFound.name)}`);
        
        if (savedGift) {
            currentGift = savedGift;
            giftResult.innerText = currentGift;
            canvas.style.display = "none";
            isSaved = true;
            scratchInstruction.innerText = "لقينا هديتك المحفوظة يا بطل! 🎁 ودي جائزتك الثابتة 🤍";
            
            triggerLocalConfetti();
        } else {
            const randomIndex = Math.floor(Math.random() * gifts.length);
            currentGift = gifts[randomIndex];
            giftResult.innerText = currentGift;
            scratchInstruction.innerText = "امسح واخدش المستطيل الرمادي اللي تحت عشان تكشف عن هديتك! 👇";
            
            isSaved = false;
            canvas.style.display = "block";
            canvas.style.opacity = 1;
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

function scratch(e) {
    if (!isDrawing || isSaved) return;
    e.preventDefault(); 
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches.clientX : e.clientX;
    const clientY = e.touches ? e.touches.clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); 
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
    if (clearPixels / (pixels.length / 4) > 0.35) {
        isSaved = true;
        
        canvas.style.transition = "opacity 0.4s ease";
        canvas.style.opacity = 0;
        setTimeout(() => { canvas.style.display = "none"; }, 400);
        
        localStorage.setItem(`gift_${normalizeArabic(currentUser.name)}`, currentGift);
        
        triggerLocalConfetti();
    }
}

// دالة احتفال مدمجة ومطورة لتساقط الألوان على موجات متتالية تدوم أطول
function triggerLocalConfetti() {
    const colors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8'];
    
    function createWave() {
        for (let i = 0; i < 40; i++) {
            const confettiElement = document.createElement('div');
            confettiElement.style.position = 'fixed';
            confettiElement.style.width = Math.random() * 10 + 6 + 'px';
            confettiElement.style.height = Math.random() * 10 + 6 + 'px';
            confettiElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confettiElement.style.left = Math.random() * 100 + 'vw';
            confettiElement.style.top = '-5vh';
            confettiElement.style.borderRadius = '50%';
            confettiElement.style.zIndex = '9999';
            confettiElement.style.pointerEvents = 'none';
            document.body.appendChild(confettiElement);

            const animation = confettiElement.animate([
                { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate3d(${(Math.random() - 0.5) * 250}px, 105vh, 0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2500 + 2000, 
                easing: 'cubic-bezier(0.1, 0.7, 0.3, 1)'
            });

            animation.onfinish = () => confettiElement.remove();
        }
    }

    createWave();
    setTimeout(createWave, 500);
    setTimeout(createWave, 1000);
    setTimeout(createWave, 1500);
}

btnLogout.addEventListener('click', () => {
    document.getElementById('user-name').value = "";
    giftPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
});

canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
window.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
window.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchmove', scratch);
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
