/* =========================================================================
   TABAN — منطق برنامه (وضعیت، مسیریابی، رندر، پنل مدیریت، گفتگو)
   ========================================================================= */
(function () {
  "use strict";

  const STORE_KEY = "taban_store_v2";
  const ADMIN_CODE = "0785993080";

  /* ---------------------------------------------------------------------
     وضعیت اولیه
  --------------------------------------------------------------------- */
  function freshStore() {
    return {
      theme: "dark",
      admin: false,
      categories: JSON.parse(JSON.stringify(TABAN_SEED.categories)),
      subscribers: [],
      chats: {}
    };
  }

  let STORE = loadStore();

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return freshStore();
      const parsed = JSON.parse(raw);
      if (!parsed.categories) return freshStore();
      return parsed;
    } catch (e) {
      return freshStore();
    }
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(STORE)); } catch (e) {}
  }

  function getCat(id) { return STORE.categories.find(c => c.id === id); }

  /* ---------------------------------------------------------------------
     آیکن‌ها
  --------------------------------------------------------------------- */
  const ICONS = {
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-6 12L6 8Z"/><path d="M3 8l3-5h12l3 5M9 8l3 12 3-12M3 8h18"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z"/></svg>',
    line: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 3v9a2 2 0 0 0 2 2h1v7M16 3v6M16 3h-3M16 9h-3"/></svg>',
    wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c-2 3-2 5 0 8s2 5 0 8M17 3c-2 3-2 5 0 8s2 5 0 8M7 3c-2 3-2 5 0 8s2 5 0 8"/></svg>',
    suit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 4 4 6l1 4 2-1v11h10V9l2 1 1-4-4-2-4 3-4-3Z"/></svg>'
  };
  const SVG = {
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 6l-6 6 6 6"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H8l-4 4V5Z"/></svg>',
    drag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="6" r="1.2"/><circle cx="16" cy="6" r="1.2"/><circle cx="8" cy="12" r="1.2"/><circle cx="16" cy="12" r="1.2"/><circle cx="8" cy="18" r="1.2"/><circle cx="16" cy="18" r="1.2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 9v4M12 17h.01M10.3 3.9 2.6 18a1.7 1.7 0 0 0 1.5 2.5h15.8a1.7 1.7 0 0 0 1.5-2.5L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z"/></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h16l-1.5 12h-13L4 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 12 16-8-6 16-3-6-7-2Z"/></svg>'
  };

  /* ---------------------------------------------------------------------
     ابزارهای عمومی UI
  --------------------------------------------------------------------- */
  const app = document.getElementById("app");

  function toast(msg) {
    const wrap = document.getElementById("toastWrap");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 2600);
  }

  function fmtPrice(n) {
    try { return Number(n).toLocaleString("fa-IR"); } catch (e) { return n; }
  }
  function discountedPrice(price, discount) {
    if (!discount) return price;
    return Math.round((price * (1 - discount / 100)) / 10) * 10;
  }

  /* ---------------------------------------------------------------------
     تم (تاریک / روشن)
  --------------------------------------------------------------------- */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", STORE.theme);
    const icons = document.querySelectorAll("#themeIcon");
    const isLight = STORE.theme === "light";
    document.querySelectorAll("#themeToggle svg, #drawerThemeToggle svg").forEach(svg => {
      svg.innerHTML = isLight
        ? '<circle cx="12" cy="12" r="4.4"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/>'
        : '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>';
    });
  }
  function toggleTheme() {
    STORE.theme = STORE.theme === "dark" ? "light" : "dark";
    saveStore(); applyTheme();
  }

  /* ---------------------------------------------------------------------
     Drawer & Modal
  --------------------------------------------------------------------- */
  const drawer = document.getElementById("drawer");
  const scrim = document.getElementById("scrim");
  const modalWrap = document.getElementById("modalWrap");
  const modalCard = document.getElementById("modalCard");

  function openDrawer() {
    document.getElementById("adminPill").classList.toggle("hidden", !STORE.admin);
    document.getElementById("adminExitBtn").classList.toggle("hidden", !STORE.admin);
    drawer.classList.add("open"); scrim.classList.add("show");
  }
  function closeDrawer() { drawer.classList.remove("open"); scrim.classList.remove("show"); }
  function closeModal() { modalWrap.classList.remove("show"); setTimeout(() => modalCard.innerHTML = "", 250); }
  function openModalHtml(html) { modalCard.innerHTML = html; modalWrap.classList.add("show"); bindModalCloseButtons(); }
  function bindModalCloseButtons() {
    modalCard.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  }

  scrim.addEventListener("click", () => { closeDrawer(); closeModal(); });

  function closeIconBtn() {
    return '<button class="modal-close" data-close>' + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
  }

  function openModal(type) {
    if (type === "signup") return renderSignupModal();
    if (type === "address") return renderAddressModal();
    if (type === "contact") return renderContactModal();
    if (type === "about") return renderAboutModal();
    if (type === "social") return renderSocialModal();
  }

  function renderSignupModal() {
    openModalHtml(`
      ${closeIconBtn()}
      <h3 class="modal-title">ثبت‌نام</h3>
      <p class="modal-sub">ایمیل خود را وارد کنید تا از جدیدترین مدل‌های پوشاک تابان باخبر شوید.</p>
      <div class="field">
        <label>ایمیل شما</label>
        <input id="signupInput" type="text" placeholder="you@example.com" autocomplete="off">
      </div>
      <button class="btn" id="signupSubmit">ثبت‌نام</button>
      <div id="signupHint"></div>
    `);
    const input = document.getElementById("signupInput");
    input.focus();
    document.getElementById("signupSubmit").addEventListener("click", () => handleSignupSubmit(input.value.trim()));
    input.addEventListener("keydown", e => { if (e.key === "Enter") handleSignupSubmit(input.value.trim()); });
  }

  function handleSignupSubmit(val) {
    const hint = document.getElementById("signupHint");
    if (!val) return;
    if (val === ADMIN_CODE) {
      STORE.admin = true; saveStore();
      hint.innerHTML = '<div class="hint-ok">حالت مدیریت فعال شد. سایت با دسترسی کامل بارگذاری می‌شود…</div>';
      setTimeout(() => { closeModal(); closeDrawer(); toast("حالت مدیریت فعال است — اکنون می‌توانید همه‌چیز را ویرایش کنید"); router(); }, 700);
      return;
    }
    if (val.includes("@") && val.includes(".")) {
      STORE.subscribers.push({ email: val, at: Date.now() });
      saveStore();
      hint.innerHTML = '<div class="hint-ok">ثبت شد! از این پس جدیدترین مدل‌های پوشاک تابان به ایمیل شما اطلاع‌رسانی می‌شود 🌸</div>';
      setTimeout(closeModal, 1400);
      return;
    }
    hint.innerHTML = '<div style="color:#e2405a;font-size:12.5px;margin-top:10px;text-align:center">لطفاً یک ایمیل معتبر وارد کنید</div>';
  }

  function renderAddressModal() {
    openModalHtml(`
      ${closeIconBtn()}
      <h3 class="modal-title">آدرس ما</h3>
      <div class="modal-body">
        <div class="info-line">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>
          <div><b>فروشات پرچون (خرده‌فروشی)</b>۶۴ متره، نبش امام مسلم ۶۴، پاساژ ریحان، طبقه دوم، دوکان ۲۵ (کنار شهر بازی پاندا)</div>
        </div>
        <div class="info-line">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
          <div><b>فروشات عمده</b>شهر نو، مارکت برادران، طبقه دوم، دوکان ۳۱۳</div>
        </div>
      </div>
    `);
  }

  function renderContactModal() {
    openModalHtml(`
      ${closeIconBtn()}
      <h3 class="modal-title">تماس با ما</h3>
      <div class="modal-body">
        <div class="info-line">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v14l-4-3H4z"/></svg>
          <div><b>شماره تماس فعال</b>۰۷۹۷۴۸۵۰۰۰</div>
        </div>
        <div class="info-line">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18v12H3zM3 7l9 6 9-6"/></svg>
          <div><b>ایمیل ما</b><a class="mail" href="mailto:hkymy9323@gmail.com">hkymy9323@gmail.com</a></div>
        </div>
      </div>
    `);
  }

  function renderAboutModal() {
    openModalHtml(`
      ${closeIconBtn()}
      <h3 class="modal-title">درباره ما</h3>
      <div class="modal-body">
        <p>تابان یکی از بزرگ‌ترین واردکننده و صادرکننده‌های لوازم پوشاک به‌صورت عمده و پرچون در داخل و خارج افغانستان است؛ با سابقه‌ای درخشان و قابل‌اعتماد در کنار مردم عزیز افغانستان.</p>
        <p>مجموعه‌ای کامل از مانتو، لباس مجلسی، لباس خانه‌گی، شلوار، چادر و کت‌شلوار را با دقت در کیفیت پارچه و دوخت گرد آورده‌ایم تا شما همیشه با اطمینان و آرامش خاطر خرید کنید.</p>
        <p>تیم تابان همه‌روزه در کنار شماست تا بهترین انتخاب را با بهترین قیمت داشته باشید.</p>
      </div>
    `);
  }

  function renderSocialModal() {
    openModalHtml(`
      ${closeIconBtn()}
      <h3 class="modal-title">شبکه‌های اجتماعی</h3>
      <div class="modal-body social-row">
        <a class="social-item" target="_blank" rel="noopener" href="https://instagram.com/MANTO_TABAN2022">
          <span class="s-ic" style="background:linear-gradient(135deg,#f58529,#dd2a7b,#8134af);color:#fff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.2" cy="6.8" r="1"/></svg>
          </span>
          <span><b style="font-size:13.5px">اینستاگرام</b><small>@MANTO_TABAN2022</small></span>
        </a>
        <div class="social-item">
          <span class="s-ic" style="background:#25D366;color:#fff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20l1.4-4.2A7.6 7.6 0 1 1 8.4 19L4 20Z"/></svg>
          </span>
          <span><b style="font-size:13.5px">واتساپ</b><small>@Clothing</small></span>
        </div>
        <a class="social-item" target="_blank" rel="noopener" href="https://t.me/TABANCLOTHES1">
          <span class="s-ic" style="background:#26A5E4;color:#fff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m21 4-19 8 6 2 2 6 3-4 5 3 3-15Z"/></svg>
          </span>
          <span><b style="font-size:13.5px">تلگرام</b><small>@TABANCLOTHES1</small></span>
        </a>
      </div>
    `);
  }

  document.querySelectorAll(".drawer-item[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => { openModal(btn.dataset.modal); });
  });
  document.getElementById("adminExitBtn").addEventListener("click", () => {
    STORE.admin = false; saveStore(); closeDrawer(); toast("از حالت مدیریت خارج شدید"); router();
  });
  document.getElementById("drawerBtn").addEventListener("click", openDrawer);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("drawerThemeToggle").addEventListener("click", toggleTheme);
  document.getElementById("brandHome").addEventListener("click", () => { location.hash = "#/"; });

  /* ---------------------------------------------------------------------
     نمایشگر تمام‌صفحه عکس
  --------------------------------------------------------------------- */
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");
  function openViewer(src) { viewerImg.src = src; viewer.classList.add("show"); }
  function closeViewer() { viewer.classList.remove("show"); }
  document.getElementById("viewerClose").addEventListener("click", closeViewer);
  viewer.addEventListener("click", e => { if (e.target === viewer) closeViewer(); });

  /* ---------------------------------------------------------------------
     تأیید حذف
  --------------------------------------------------------------------- */
  function confirmDelete(catId, prodId) {
    openModalHtml(`
      <div class="confirm-card">
        <div class="warn-ic">${SVG.warn}</div>
        <h3 class="modal-title" style="padding-left:0">حذف محصول</h3>
        <p>این محصول برای همیشه از فروشگاه حذف می‌شود. مطمئن هستید؟</p>
        <div class="confirm-actions">
          <button class="btn ghost" data-close>لغو</button>
          <button class="btn danger" id="confirmDeleteBtn">حذف</button>
        </div>
      </div>
    `);
    document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
      const cat = getCat(catId);
      cat.products = cat.products.filter(p => p.id !== prodId);
      saveStore(); closeModal(); toast("محصول حذف شد");
      renderCategory(catId);
    });
  }

  /* ---------------------------------------------------------------------
     افزودن محصول (مدیر)
  --------------------------------------------------------------------- */
  function openAddProductModal(catId) {
    openModalHtml(`
      ${closeIconBtn()}
      <h3 class="modal-title">افزودن محصول جدید</h3>
      <p class="modal-sub">لینک تصویر و قیمت محصول را وارد کنید.</p>
      <div class="field" style="margin-bottom:12px">
        <label>لینک تصویر محصول</label>
        <input id="newImg" type="text" placeholder="https://...">
      </div>
      <div class="field">
        <label>قیمت (افغانی)</label>
        <input id="newPrice" type="number" placeholder="مثلاً 990">
      </div>
      <button class="btn" id="newProductSubmit">افزودن به فروشگاه</button>
    `);
    document.getElementById("newProductSubmit").addEventListener("click", () => {
      const img = document.getElementById("newImg").value.trim();
      const price = parseInt(document.getElementById("newPrice").value, 10);
      if (!img || !price) { toast("لینک تصویر و قیمت را کامل وارد کنید"); return; }
      const cat = getCat(catId);
      cat.products.push({ id: "p" + Math.random().toString(36).slice(2, 9), img, price, discount: 0 });
      saveStore(); closeModal(); toast("محصول جدید اضافه شد");
      renderCategory(catId);
    });
  }

  /* ---------------------------------------------------------------------
     صفحه اصلی — دسته‌بندی‌ها
  --------------------------------------------------------------------- */
  const CAT_GRADIENTS = {
    manto: "linear-gradient(155deg,#8a6a35 0%,#3b2f5c 75%)",
    majlesi: "linear-gradient(155deg,#7a2c4a 0%,#2a1f45 75%)",
    khanegi: "linear-gradient(155deg,#875339 0%,#392e4c 75%)",
    shalwar: "linear-gradient(155deg,#3c5a78 0%,#241f3b 75%)",
    chador: "linear-gradient(155deg,#2c3a5c 0%,#1c1830 75%)",
    kotshalwar: "linear-gradient(155deg,#494a63 0%,#1c1830 75%)"
  };

  function renderHome() {
    document.getElementById("adminAddFab").classList.add("hidden");
    const cards = STORE.categories.map(c => `
      <a class="cat-card" href="#/cat/${c.id}">
        <div class="cc-art" style="background:${CAT_GRADIENTS[c.id]}"></div>
        <div class="cc-glass"></div>
        <div class="cc-icon">${ICONS[c.icon] || ICONS.sparkle}</div>
        <div class="cc-count">${c.products.length ? c.products.length + " مدل" : "به‌زودی"}</div>
        <div class="cc-label">
          <span class="cc-name">${c.name}</span>
          <span class="cc-arrow">${SVG.arrowLeft}</span>
        </div>
      </a>
    `).join("");

    app.innerHTML = `
      <div class="hero container">
        <h1>پوشاک <span>تابان</span></h1>
        <p>وارد کننده و صادر کننده پوشاک عمده و پرچون · افغانستان</p>
      </div>
      <div class="cat-grid container">${cards}</div>
    `;
  }

  /* ---------------------------------------------------------------------
     صفحه دسته‌بندی — محصولات
  --------------------------------------------------------------------- */
  let dragSourceIdx = null;

  function chunk5(arr) {
    const out = [];
    for (let i = 0; i < arr.length; i += 5) out.push(arr.slice(i, i + 5));
    return out;
  }

  function productCardHtml(cat, p, idx) {
    const disc = p.discount || 0;
    const finalPrice = discountedPrice(p.price, disc);
    const priceInner = disc
      ? `<span class="old">${fmtPrice(p.price)}</span><span class="now">${fmtPrice(finalPrice)} ؋</span>`
      : `<span class="now">${fmtPrice(p.price)} ؋</span>`;

    const discSelect = STORE.admin ? `
      <div class="pc-admin-row">
        <select class="pc-disc-select" data-disc-for="${p.id}">
          ${[0,10,20,30,40,50,60,70,80].map(d => `<option value="${d}" ${d===disc?"selected":""}>${d===0?"بدون تخفیف":"٪"+d+" تخفیف"}</option>`).join("")}
        </select>
      </div>` : "";

    return `
      <div class="pcard" draggable="${STORE.admin}" data-idx="${idx}" data-id="${p.id}">
        ${STORE.admin ? `<div class="pc-admin-tag" title="جابه‌جایی">${SVG.drag}</div>` : ""}
        ${disc ? `<div class="pc-discount">٪${disc}-</div>` : ""}
        <div class="pc-imgwrap" data-img="${p.img}">
          <img src="${p.img}" alt="محصول تابان" loading="lazy">
        </div>
        <div class="pc-pricebox ${STORE.admin ? "editable" : ""}" data-price-for="${p.id}">${priceInner}</div>
        ${discSelect}
        <button class="pc-buy" data-buy="${p.id}">${SVG.chat} صحبت برای خرید</button>
      </div>
    `;
  }

  function renderCategory(catId) {
    const cat = getCat(catId);
    if (!cat) { location.hash = "#/"; return; }

    const fab = document.getElementById("adminAddFab");
    fab.classList.toggle("hidden", !STORE.admin);
    fab.onclick = () => openAddProductModal(catId);

    if (!cat.products.length) {
      app.innerHTML = `
        <div class="cat-header container">
          <a class="back-btn" href="#/">${SVG.arrowLeft}</a>
          <div><h2>${cat.name}</h2><small>${STORE.admin ? "در حالت مدیریت هستید" : "فروشگاه پوشاک تابان"}</small></div>
        </div>
        <div class="empty-state">
          ${SVG.empty}
          <div>هنوز محصولی برای «${cat.name}» اضافه نشده است.</div>
          ${STORE.admin ? `<button class="btn" id="emptyAddBtn">افزودن اولین محصول</button>` : ""}
        </div>
      `;
      if (STORE.admin) document.getElementById("emptyAddBtn").addEventListener("click", () => openAddProductModal(catId));
      return;
    }

    const rails = chunk5(cat.products).map((group, gi) => {
      const startIdx = gi * 5;
      const cards = group.map((p, i) => productCardHtml(cat, p, startIdx + i)).join("");
      const addCard = (STORE.admin && gi === chunk5(cat.products).length - 1) ? `
        <button class="add-card" id="railAddBtn">${SVG.plus}<span>افزودن محصول</span></button>` : "";
      return `<div class="rail"><div class="rail-track" data-rail="${gi}">${cards}${addCard}</div></div>`;
    }).join("");

    app.innerHTML = `
      <div class="cat-header container">
        <a class="back-btn" href="#/">${SVG.arrowLeft}</a>
        <div><h2>${cat.name}</h2><small>${cat.products.length} مدل موجود ${STORE.admin ? "· حالت مدیریت" : ""}</small></div>
      </div>
      ${rails}
      <div style="height:70px"></div>
    `;

    bindCategoryEvents(catId);
  }

  function bindCategoryEvents(catId) {
    const cat = getCat(catId);

    // باز کردن تصویر تمام‌صفحه + جلوگیری از باز شدن بعد از حذف با فشار طولانی
    app.querySelectorAll(".pc-imgwrap").forEach(el => {
      el.addEventListener("click", () => {
        const card = el.closest(".pcard");
        if (card && card.dataset.longpress === "1") { card.dataset.longpress = "0"; return; }
        openViewer(el.dataset.img);
      });
    });

    // خرید -> رفتن به گفتگو
    app.querySelectorAll("[data-buy]").forEach(btn => {
      btn.addEventListener("click", () => { location.hash = `#/chat/${catId}/${btn.dataset.buy}`; });
    });

    // افزودن محصول از انتهای ردیف آخر
    const railAddBtn = document.getElementById("railAddBtn");
    if (railAddBtn) railAddBtn.addEventListener("click", () => openAddProductModal(catId));

    if (!STORE.admin) return;

    // ویرایش قیمت
    app.querySelectorAll(".pc-pricebox.editable").forEach(box => {
      box.addEventListener("click", () => {
        const pid = box.dataset.priceFor;
        const p = cat.products.find(x => x.id === pid);
        if (!p) return;
        box.innerHTML = `<input type="number" value="${p.price}" />`;
        const input = box.querySelector("input");
        input.focus(); input.select();
        const commit = () => {
          const val = parseInt(input.value, 10);
          if (val && val > 0) { p.price = val; saveStore(); toast("قیمت بروزرسانی شد"); }
          renderCategory(catId);
        };
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", e => { if (e.key === "Enter") input.blur(); });
      });
    });

    // تخفیف
    app.querySelectorAll("[data-disc-for]").forEach(sel => {
      sel.addEventListener("click", e => e.stopPropagation());
      sel.addEventListener("change", () => {
        const pid = sel.dataset.discFor;
        const p = cat.products.find(x => x.id === pid);
        if (!p) return;
        p.discount = parseInt(sel.value, 10);
        saveStore(); toast("تخفیف بروزرسانی شد");
        renderCategory(catId);
      });
    });

    // فشار طولانی برای حذف (۳ ثانیه)
    app.querySelectorAll(".pcard").forEach(card => {
      let timer = null;
      const start = e => {
        if (e.target.closest(".pc-buy") || e.target.closest(".pc-pricebox") || e.target.closest(".pc-disc-select") || e.target.closest(".pc-admin-tag")) return;
        timer = setTimeout(() => {
          card.dataset.longpress = "1";
          confirmDelete(catId, card.dataset.id);
        }, 3000);
      };
      const cancel = () => { clearTimeout(timer); };
      card.addEventListener("pointerdown", start);
      card.addEventListener("pointerup", cancel);
      card.addEventListener("pointerleave", cancel);
      card.addEventListener("pointercancel", cancel);
    });

    // درگ اند دراپ برای جابه‌جایی
    app.querySelectorAll(".pcard").forEach(card => {
      card.addEventListener("dragstart", () => {
        dragSourceIdx = parseInt(card.dataset.idx, 10);
        card.classList.add("dragging");
      });
      card.addEventListener("dragend", () => { card.classList.remove("dragging"); dragSourceIdx = null; });
      card.addEventListener("dragover", e => { e.preventDefault(); card.classList.add("drag-over"); });
      card.addEventListener("dragleave", () => card.classList.remove("drag-over"));
      card.addEventListener("drop", e => {
        e.preventDefault();
        card.classList.remove("drag-over");
        const targetIdx = parseInt(card.dataset.idx, 10);
        if (dragSourceIdx === null || dragSourceIdx === targetIdx) return;
        const arr = cat.products;
        const [moved] = arr.splice(dragSourceIdx, 1);
        arr.splice(targetIdx, 0, moved);
        saveStore(); toast("ترتیب محصولات بروزرسانی شد");
        renderCategory(catId);
      });
    });
  }

  /* ---------------------------------------------------------------------
     صفحه گفتگو (خرید)
  --------------------------------------------------------------------- */
  const REPLIES = [
    "بله موجود است 🌸 چه سایز و رنگی مدنظرتان است؟",
    "قیمت نهایی بستگی به تعداد دارد؛ برای خرید عمده تخفیف ویژه داریم.",
    "ارسال به تمام ولایات افغانستان امکان‌پذیر است.",
    "لطفاً شماره تماس خود را بفرمایید تا هماهنگی نهایی انجام شود.",
    "این مدل پرفروش‌ترین طرح این هفته ماست ✨"
  ];

  function chatKey(catId, pid) { return catId + "|" + pid; }

  function renderChat(catId, pid) {
    document.getElementById("adminAddFab").classList.add("hidden");
    const cat = getCat(catId);
    const p = cat ? cat.products.find(x => x.id === pid) : null;
    if (!cat || !p) { location.hash = "#/"; return; }

    const key = chatKey(catId, pid);
    if (!STORE.chats[key]) {
      const finalPrice = discountedPrice(p.price, p.discount || 0);
      STORE.chats[key] = [
        { from: "sys", text: "این یک گفتگوی نمایشی برای هماهنگی خرید است" },
        { from: "me", text: `سلام! می‌خواستم درباره این محصول از دسته «${cat.name}» با قیمت ${fmtPrice(finalPrice)} افغانی معلومات بگیرم.` },
        { from: "them", text: "سلام و خوش آمدید به پوشاک تابان 🌸 لطفاً سایز، رنگ و تعداد مورد نظرتان را بفرمایید تا قیمت نهایی و زمان ارسال را خدمتتان عرض کنم." }
      ];
      saveStore();
    }

    app.innerHTML = `
      <div class="chat-wrap">
        <div class="chat-head">
          <a class="back-btn" href="#/cat/${catId}">${SVG.arrowLeft}</a>
          <div class="ch-avatar"><img src="${p.img}" alt=""></div>
          <div>
            <h3>پشتیبانی فروش تابان</h3>
            <small>آنلاین</small>
          </div>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <div class="chat-input">
          <input id="chatInput" type="text" placeholder="پیام خود را بنویسید…">
          <button id="chatSend">${SVG.send}</button>
        </div>
      </div>
    `;

    paintChat(key);

    const input = document.getElementById("chatInput");
    const send = () => {
      const val = input.value.trim();
      if (!val) return;
      STORE.chats[key].push({ from: "me", text: val });
      saveStore(); paintChat(key);
      input.value = "";
      const body = document.getElementById("chatBody");
      const typingEl = document.createElement("div");
      typingEl.className = "typing";
      typingEl.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(typingEl);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        typingEl.remove();
        const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
        STORE.chats[key].push({ from: "them", text: reply });
        saveStore(); paintChat(key);
      }, 1100 + Math.random() * 700);
    };
    document.getElementById("chatSend").addEventListener("click", send);
    input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  }

  function paintChat(key) {
    const body = document.getElementById("chatBody");
    if (!body) return;
    body.innerHTML = STORE.chats[key].map(m =>
      `<div class="bubble ${m.from}">${m.text.replace(/</g, "&lt;")}</div>`
    ).join("");
    body.scrollTop = body.scrollHeight;
  }

  /* ---------------------------------------------------------------------
     مسیریابی
  --------------------------------------------------------------------- */
  function router() {
    closeDrawer(); closeModal(); closeViewer();
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\//, "").split("/").filter(Boolean);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    if (parts[0] === "cat" && parts[1]) return renderCategory(parts[1]);
    if (parts[0] === "chat" && parts[1] && parts[2]) return renderChat(parts[1], parts[2]);
    return renderHome();
  }
  window.addEventListener("hashchange", router);

  /* ---------------------------------------------------------------------
     شروع برنامه
  --------------------------------------------------------------------- */
  function init() {
    applyTheme();
    router();
    setTimeout(() => { document.getElementById("splash").classList.add("hide"); }, 2000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
