// قاعدة بيانات الحاضرين بالاسم الرباعي (مضمونة ومفحوصة تماماً للموبايل والكمبيوتر)
const allowedUsers = [
    { name: "مينا نبيل صبحي عازر" },
    { name: "بيشوي منير كمال فوزي" },
    { name: "أندرو مجدي رفعت منقريوس" },
    { name: "جرجس عادل شفيق قزمان" },
    { name: "جون سامح نصيف عزيز" },
    { name: "شنودة إيهاب رمزي بديع" },
    { name: "فادي رأفت وليم كامل" },
    { name: "بولا غطاس صبري وهبه" },
    { name: "توماس عماد ميلاد منير" },
    { name: "أبانوب شحاتة وجيه نسيم" },
    { name: "مايكل شكري فؤاد خليل" },
    { name: "تادرس عادل فرج توفيق" },
    { name: "أرسانيوس ناصر سعيد شحاتة" },
    { name: "إسحق ممدوح كمال حبيب" },
    { name: "ماريو أشرف رزق لبيب" },
    { name: "بافلي أمير ناجي فرج" },
    { name: "توني نجيب نبيل حليم" },
    { name: "متى رمزي صبري جرجس" },
    { name: "يوحنا سامي عوض الله نصر" },
    { name: "أنطونيوس صموئيل عبده فايز" },
    { name: "ميرون عادل منير شفيق" },
    { name: "إيليا ممدوح نصحي وديع" },
    { name: "إرميا فايز صبري عياد" },
    { name: "يوستوس رأفت كمال عزيز" },
    { name: "كيرلس سامح عياد توفيق" },
    { name: "يوسف عادل فرج منير" },
    { name: "مينا ممدوح صبري شحاتة" },
    { name: "جرجس رأفت شفيق نصر" },
    { name: "أندرو أشرف رزق كامل" },
    { name: "جون ناصر شكري فوزي" }
];

// قائمة الهدايا المباشرة والمبسطة بدون رموز وبخط مكبر
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

    // البحث النصي المباشر والمضمون 100% على كافة أنواع الهواتف والكمبيوتر
    const userFound = allowedUsers.find(user => {
        const cleanDBName = normalizeArabic(user.name);
        
        // التحقق النصي: إذا كان الاسم المكتوب مطابقاً أو جزءاً من الاسم الرباعي المشمول بالكامل
        return cleanDBName.includes(cleanInput) || cleanInput.includes(cleanDBName);
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
    // تعديل ذكي لضبط الأبعاد البرمجية بناءً على حجم شاشة الموبايل الحالية
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#b2bec3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '16px Segoe UI';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('اخدش هنا عشان تشوف هديتك ✨', canvas.width / 2, canvas.height / 2);
}

function scratch(e) {
    if (!isDrawing || isSaved) return;
    e.preventDefault(); 
    
    const rect = canvas.getBoundingClientRect();
    // تأمين جلب إحداثيات اللمس للموبايل والماوس معاً بشكل قياسي ومباشر
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
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
