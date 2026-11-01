// ===== الإعدادات =====
// غيّر القيمة دي كل شهر (مثلاً "2026-12") عشان الهدايا تتغير والكل يخدش من جديد
const SALT = "2026-11";

// قاعدة بيانات الحاضرين بالاسم الرباعي
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
    { name: "أبانوب شحاته وجيه نسيم" },
    { name: "مايكل شكري فؤاد خليل" },
    { name: "تادرس عادل فرج توفيق" },
    { name: "أرسانيوس أشرف رزق قزمان" },
    { name: "إسحق ممدوح كمال حبيب" },
    { name: "ماريو أشرف رزق لبيب" },
    { name: "بافلي أمير ناجي فرج" },
    { name: "توني نجيب نبيل حليم" },
    { name: "متي رمزي صبري جرجس" },
    { name: "يوحنا سامي عوض الله نصر" },
    { name: "أنطونيوس صموئيل عبده فايز" },
    { name: "ميرون عادل منير شفيق" },
    { name: "إيليا ممدوح نصحي وديع" },
    { name: "إرميا فايز صبري عياد" },
    { name: "يوستوس رأفت كمال عزيز" },
    { name: "كيرلس سامح عياد توفيق" },
    { name: "يوسف عادل فرج منير" },
    { name: "مينا ممدوح صبري شحاته" },
    { name: "جرجس رأفت شفيق نصر" },
    { name: "أندرو أشرف رزق كامل" },
    { name: "جون ناصر شكري فوزي" }
];

// قائمة الجوائز
const gifts = [
    "25 كارت",
    "30 كارت",
    "35 كارت",
    "40 كارت",
    "45 كارت",
    "50 كارت",
    "55 كارت"
];

// ===== العناصر =====
const loginPage = document.getElementById('login-page');
const giftPage = document.getElementById('gift-page');
const btnCheck = document.getElementById('btn-check');
const btnLogout = document.getElementById('btn-logout');
const nameInput = document.getElementById('user-name');
const errorMsg = document.getElementById('error-msg');
const welcomeUser = document.getElementById('welcome-user');
const giftResult = document.getElementById('gift-result');
const scratchInstruction = document.getElementById('scratch-instruction');
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');

let currentUser = null;
let currentGift = "";
let revealed = false;
let drawing = false;
let lastX = 0;
let lastY = 0;
let lastCheck = 0;

// ===== أدوات مساعدة =====
function normalizeArabic(text) {
    if (!text) return "";
    return text
        .replace(/[\u064B-\u065F\u0640]/g, "") // التشكيل والتطويل
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/\s+/g, " ")
        .trim();
}

// تخزين آمن (بيشتغل حتى لو التصفح الخاص مانع localStorage)
function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* تجاهل */ }
}

// مطابقة صارمة: اسم كامل، أو بداية الاسم (3 كلمات على الأقل) بشرط تطابق واحد بس
function findUser(input) {
    const clean = normalizeArabic(input);
    if (clean.split(" ").length < 3) return { error: "short" };

    const exact = allowedUsers.filter(u => normalizeArabic(u.name) === clean);
    if (exact.length === 1) return { user: exact[0] };

    const starts = allowedUsers.filter(u => normalizeArabic(u.name).startsWith(clean + " "));
    if (starts.length === 1) return { user: starts[0] };

    return { error: starts.length > 1 ? "ambiguous" : "none" };
}

// الهدية ثابتة لكل اسم (نفس الاسم = نفس الهدية على أي جهاز وفي أي مرة)
function giftFor(name) {
    const str = SALT + "|" + normalizeArabic(name);
    let h = 7;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return gifts[h % gifts.length];
}

function storageKey(user) {
    return `revealed_${SALT}_${normalizeArabic(user.name)}`;
}

// ===== تسجيل الدخول =====
function handleCheck() {
    const inputName = nameInput.value;

    if (!inputName.trim()) {
        errorMsg.innerText = "من فضلك اكتب اسمك أولاً يا بطل! ⚠️";
        return;
    }

    const result = findUser(inputName);

    if (result.error === "short") {
        errorMsg.innerText = "اكتب اسمك الرباعي كامل يا بطل (الاسم + اسم الأب + الجد + أبو الجد) ✍️";
        return;
    }
    if (result.error === "ambiguous") {
        errorMsg.innerText = "في أكتر من اسم شبه كده، اكتب اسمك الرباعي كامل 🙏";
        return;
    }
    if (result.error === "none") {
        errorMsg.innerText = "عاش يا بطل على المحاولة! شد حيلك الجمعة الجاية والتزم بالحضور عشان تدخل سحب الهدايا المرة الجاية 🤍";
        return;
    }

    showGift(result.user);
}

function showGift(user) {
    errorMsg.innerText = "";
    currentUser = user;
    currentGift = giftFor(user.name);
    giftResult.innerText = currentGift;

    loginPage.classList.add('hidden');
    giftPage.classList.remove('hidden');

    // الاسم بيتكتب كنص عادي (آمن)
    welcomeUser.textContent = "";
    welcomeUser.appendChild(document.createTextNode("مبروووووك يا بطل 🎉🥳"));
    const nameSpan = document.createElement('span');
    nameSpan.className = 'welcome-name';
    nameSpan.textContent = user.name;
    welcomeUser.appendChild(nameSpan);

    if (storageGet(storageKey(user))) {
        // كشف الهدية قبل كده على الجهاز ده
        revealed = true;
        canvas.style.display = "none";
        scratchInstruction.innerText = "لقينا هديتك المحفوظة يا بطل! 🎁 ودي جائزتك الثابتة 🤍";
        triggerLocalConfetti();
    } else {
        revealed = false;
        scratchInstruction.innerText = "امسح واخدش المستطيل الرمادي اللي تحت عشان تكشف عن هديتك! 👇";
        requestAnimationFrame(initScratchCard);
    }
}

btnCheck.addEventListener('click', handleCheck);
nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCheck();
});

btnLogout.addEventListener('click', () => {
    nameInput.value = "";
    errorMsg.innerText = "";
    currentUser = null;
    currentGift = "";
    revealed = false;
    drawing = false;
    giftPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
});

// ===== كارت الخدش =====
function initScratchCard() {
    const parent = canvas.parentElement;
    canvas.style.transition = "none";
    canvas.style.opacity = 1;
    canvas.style.display = "block";

    // تغيير الحجم بيصفّر حالة الـ canvas
    canvas.width = parent.clientWidth || 280;
    canvas.height = parent.clientHeight || 90;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#b2bec3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '600 16px Cairo, Tahoma, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('اخدش هنا عشان تشوف هديتك ✨', canvas.width / 2, canvas.height / 2);
}

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function scratchLine(x1, y1, x2, y2) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 44;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function checkScratchPercentage(force) {
    if (revealed) return;

    // نفحص كل 120 ملي ثانية بس عشان الموبايلات الضعيفة
    const now = Date.now();
    if (!force && now - lastCheck < 120) return;
    lastCheck = now;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    // عينة: بكسل من كل 16 بكسل
    for (let i = 3; i < pixels.length; i += 64) {
        total++;
        if (pixels[i] === 0) clear++;
    }

    if (total > 0 && clear / total > 0.35) {
        revealGift();
    }
}

function revealGift() {
    revealed = true;
    drawing = false;

    canvas.style.transition = "opacity 0.4s ease";
    canvas.style.opacity = 0;
    setTimeout(() => { canvas.style.display = "none"; }, 400);

    if (currentUser) storageSet(storageKey(currentUser), "1");
    triggerLocalConfetti();
}

// Pointer Events: بتشتغل للماوس واللمس والقلم بنفس الكود
canvas.addEventListener('pointerdown', (e) => {
    if (revealed) return;
    drawing = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* تجاهل */ }
    const p = getPos(e);
    lastX = p.x;
    lastY = p.y;
    scratchLine(p.x, p.y, p.x, p.y);
    checkScratchPercentage(false);
    e.preventDefault();
});

canvas.addEventListener('pointermove', (e) => {
    if (!drawing || revealed) return;
    const p = getPos(e);
    scratchLine(lastX, lastY, p.x, p.y);
    lastX = p.x;
    lastY = p.y;
    checkScratchPercentage(false);
    e.preventDefault();
});

function stopDrawing() {
    if (!drawing) return;
    drawing = false;
    checkScratchPercentage(true);
}
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);

// ===== الاحتفال =====
function triggerLocalConfetti() {
    const colors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8'];

    function createWave() {
        for (let i = 0; i < 40; i++) {
            const el = document.createElement('div');
            el.style.position = 'fixed';
            el.style.width = Math.random() * 10 + 6 + 'px';
            el.style.height = Math.random() * 10 + 6 + 'px';
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-5vh';
            el.style.borderRadius = '50%';
            el.style.zIndex = '9999';
            el.style.pointerEvents = 'none';
            document.body.appendChild(el);

            const animation = el.animate([
                { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate3d(${(Math.random() - 0.5) * 250}px, 105vh, 0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2500 + 2000,
                easing: 'cubic-bezier(0.1, 0.7, 0.3, 1)'
            });

            animation.onfinish = () => el.remove();
        }
    }

    createWave();
    setTimeout(createWave, 500);
    setTimeout(createWave, 1000);
    setTimeout(createWave, 1500);
}