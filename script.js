// 💡 اكتب اسمك الرباعي السري هنا بدقة لكي يفتح لك الموقع صفحة الكشف عند كتابته
const ADMIN_SECRET_NAME = "كيرلس بديع فواز نخله";

const allowedUsers = [
    { name: "مينا نبيل صبحي عازر" }, { name: "بيشوي منير كمال فوزي" }, { name: "أندرو مجدي رفعت منقريوس" },
    { name: "جرجس عادل شفيق قزمان" }, { name: "جون سامح نصيف عزيز" }, { name: "شنودة إيهاب رمزي بديع" },
    { name: "فادي رأفت وليم كامل" }, { name: "بولا غطاس صبري وهبه" }, { name: "توماس عماد ميلاد منير" },
    { name: "أبانوب شحاته وجيه نسيم" }, { name: "مايكل شكري فؤاد خليل" }, { name: "تادرس عادل فرج توفيق" },
    { name: "أرسانيوس أشرف رزق قزمان" }, { name: "إسحق ممدوح كمال حبيب" }, { name: "ماريو أشرف رزق لبيب" },
    { name: "بافلي أمير ناجي فرج" }, { name: "توني نجيب نبيل حليم" }, { name: "متي رمزي صبري جرجس" },
    { name: "يوحنا سامي عوض الله نصر" }, { name: "أنطونيوس صموئيل عبده فايز" }, { name: "ميرون عادل منير شفيق" },
    { name: "إيليا ممدوح نصحي وديع" }, { name: "إرميا فايز صبري عياد" }, { name: "يوستوس رأفت كمال عزيز" },
    { name: "كيرلس سامح عياد توفيق" }, { name: "يوسف عادل فرج منير" }, { name: "مينا ممدوح صبري شحاته" },
    { name: "جرجس رأفت شفيق نصر" }, { name: "أندرو أشرف رزق كامل" }, { name: "جون ناصر شكري فوزي" }
];

const gifts = ["25 كارت", "30 كارت", "35 كارت", "40 كارت", "45 كارت", "50 كارت", "55 كارت"];

let currentUser = null; let currentGift = ""; let isDrawing = false; let isSaved = false;

const loginPage = document.getElementById('login-page');
const giftPage = document.getElementById('gift-page');
const adminPage = document.getElementById('admin-page');
const btnCheck = document.getElementById('btn-check');
const btnLogout = document.getElementById('btn-logout');
const btnClearAll = document.getElementById('btn-clear-all');
const btnCloseAdmin = document.getElementById('btn-close-admin');
const adminTableBody = document.getElementById('admin-table-body');
const errorMsg = document.getElementById('error-msg');
const welcomeUser = document.getElementById('welcome-user');
const giftResult = document.getElementById('gift-result');
const scratchInstruction = document.getElementById('scratch-instruction');

const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');

function normalizeArabic(text) {
    if (!text) return "";
    return text.replace(/[\u064B-\u065F]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/\s+/g, " ").trim();                       
}

btnCheck.addEventListener('click', () => {
    const inputName = document.getElementById('user-name').value;
    if (!inputName.trim()) { errorMsg.innerText = "من فضلك اكتب اسمك أولاً يا بطل! ⚠️"; return; }

    const cleanInput = normalizeArabic(inputName);

    // 🚀 التحقق السري: إذا كتبت اسمك الرباعي يفتح لك صفحة الكشف الإداري فوراً
    if (cleanInput === normalizeArabic(ADMIN_SECRET_NAME)) {
        errorMsg.innerText = "";
        loginPage.classList.add('hidden'); giftPage.classList.add('hidden'); adminPage.classList.remove('hidden');
        updateAdminTable();
        return;
    }

    const userFound = allowedUsers.find(user => {
        const cleanDBName = normalizeArabic(user.name);
        return cleanDBName.includes(cleanInput) || cleanInput.includes(cleanDBName);
    });

    if (userFound) {
        errorMsg.innerText = ""; currentUser = userFound;
        loginPage.classList.add('hidden'); giftPage.classList.remove('hidden'); adminPage.classList.add('hidden');
        welcomeUser.innerHTML = `مبروووووك يا بطل 🎉🥳 <br> <span style="font-size: 20px; display: block; margin-top: 8px; color: #0984e3;">${userFound.name}</span>`;

        const savedGift = localStorage.getItem(`gift_${normalizeArabic(userFound.name)}`);
        if (savedGift) {
            currentGift = savedGift; giftResult.innerText = currentGift; canvas.style.display = "none"; isSaved = true;
            scratchInstruction.innerText = "لقينا هديتك المحفوظة يا بطل! 🎁 ودي جائزتك الثابتة 🤍";
            triggerLocalConfetti();
        } else {
            const randomIndex = Math.floor(Math.random() * gifts.length);
            currentGift = gifts[randomIndex]; giftResult.innerText = currentGift;
            scratchInstruction.innerText = "امسح واخدش المستطيل الرمادي اللي تحت عشان تكشف عن هديتك! 👇";
            isSaved = false; canvas.style.display = "block"; canvas.style.opacity = 1; setTimeout(initScratchCard, 50);
        }
    } else {
        errorMsg.innerText = "عاش يا بطل على المحاولة! شد حيلك الجمعة الجاية والتزم بالحضور عشان تدخل سحب الهدايا المرة الجاية 🤍";
    }
});

function initScratchCard() {
    canvas.width = canvas.parentElement.clientWidth || 280; canvas.height = canvas.parentElement.clientHeight || 90;
    canvas.style.width = "100%"; canvas.style.height = "100%";
    ctx.fillStyle = '#b2bec3'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Segoe UI'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('اخدش هنا عشان تشوف هديتك ✨', canvas.width / 2, canvas.height / 2);
}

function scratch(e) {
    if (!isDrawing || isSaved) return; e.preventDefault(); 
    const rect = canvas.getBoundingClientRect();
    let clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x, y, 25, 0, Math.PI * 2); ctx.fill();
    checkScratchPercentage();
}

function checkScratchPercentage() {
    if (isSaved) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data; let clearPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] === 0) clearPixels++; }
    if (clearPixels / (pixels.length / 4) > 0.35) {
        isSaved = true; canvas.style.transition = "opacity 0.4s ease"; canvas.style.opacity = 0;
        setTimeout(() => { canvas.style.display = "none"; }, 400);
        
        localStorage.setItem(`gift_${normalizeArabic(currentUser.name)}`, currentGift);
        saveToAdminList(currentUser.name, currentGift); // حفظ البيانات لجدولك تلقائياً
        triggerLocalConfetti();
    }
}

function saveToAdminList(name, gift) {
    let list = JSON.parse(localStorage.getItem('makhdom_admin_report')) || [];
    if (!list.some(item => item.name === name)) {
        list.push({ name: name, gift: gift });
        localStorage.setItem('makhdom_admin_report', JSON.stringify(list));
    }
}

function updateAdminTable() {
    adminTableBody.innerHTML = "";
    let list = JSON.parse(localStorage.getItem('makhdom_admin_report')) || [];
    if (list.length === 0) {
        adminTableBody.innerHTML = `<tr><td colspan="2" style="padding:15px; text-align:center; color:#636e72;">لا توجد أسماء مسجلة حتى الآن 📭</td></tr>`;
        return;
    }
    list.forEach(item => {
        let row = `<tr style="border-bottom: 1px solid #dfe6e9;"><td style="padding:10px; font-weight:600; color:#2d3436;">${item.name}</td><td style="padding:10px; color:#d63031; font-weight:bold;">${item.gift}</td></tr>`;
        adminTableBody.innerHTML += row;
    });
}

btnClearAll.addEventListener('click', () => {
    if (confirm("هل أنت متأكد من تصفير ومسح كشف هدايا الأولاد بالكامل؟ ⚠️")) {
        let list = JSON.parse(localStorage.getItem('makhdom_admin_report')) || [];
        list.forEach(item => { localStorage.removeItem(`gift_${normalizeArabic(item.name)}`); });
        localStorage.removeItem('makhdom_admin_report');
        updateAdminTable();
        alert("تم تصفير السحب ومسح الكشف بنجاح! 🗑️");
    }
});

btnCloseAdmin.addEventListener('click', () => {
    adminPage.classList.add('hidden'); loginPage.classList.remove('hidden');
});

function triggerLocalConfetti() {
    const colors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8'];
    function createWave() {
        for (let i = 0; i < 40; i++) {
            const confettiElement = document.createElement('div');
            confettiElement.style.position = 'fixed'; confettiElement.style.width = Math.random() * 10 + 6 + 'px'; confettiElement.style.height = Math.random() * 10 + 6 + 'px';
            confettiElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; confettiElement.style.left = Math.random() * 100 + 'vw'; confettiElement.style.top = '-5vh';
            confettiElement.style.borderRadius = '50%'; confettiElement.style.zIndex = '9999'; confettiElement.style.pointerEvents = 'none'; document.body.appendChild(confettiElement);
            const animation = confettiElement.animate([
                { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 }, { transform: `translate3d(${(Math.random() - 0.5) * 250}px, 105vh, 0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], { duration: Math.random() * 2500 + 2000, easing: 'cubic-bezier(0.1, 0.7, 0.3, 1)' });
            animation.onfinish = () => confettiElement.remove();
        }
    }
    createWave(); setTimeout(createWave, 500); setTimeout(createWave, 1000); setTimeout(createWave, 1500);
}

canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); }); window.addEventListener('mouseup', () => isDrawing = false); canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }); window.addEventListener('touchend', () => isDrawing = false); canvas.addEventListener('touchmove', scratch);
