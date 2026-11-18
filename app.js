// Прототип быстрых действий Пикабу Нейро в посте.
// Логика: сначала у поста одна кнопка (зависит от поста), по нажатию Нейро «думает», отвечает,
// и только после первого ответа появляются остальные табы — между ними можно переключаться.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const A = "assets/";

  // ---------- действия Нейро ----------
  const ACTIONS = {
    summary: { t: "Кратко о посте", q: "Расскажи кратко о посте", load: "Читаю пост и готовлю краткое содержание…" },
    comments: { t: "Главное в комментариях", q: "Что обсуждают в комментариях?", load: "Читаю комментарии и ищу главное…" },
    simple: { t: "Объяснить проще", q: "Объясни проще", load: "Подбираю слова попроще…" },
    facts: { t: "Проверить факты", q: "Проверь факты в посте", load: "Сверяю факты с источниками…" },
  };

  // ---------- посты ленты (тексты постов — из макета) ----------
  const POSTS = [
    {
      id: "p1", kind: "Длинный текст, много комментариев", rating: 2464, author: "CoolMinion", community: "Время оЪУЪительных историй", theme: "Кино и сериалы",
      title: "Прикольные миньоны", date: "11 августа", views: "5.1K", comments: 365, tags: ["Котики", "Юмор", "Шутки", "Фотография", "ИИ"],
      first: "summary", more: ["comments", "simple", "facts"], after: ["comments", "facts", "simple"],
      text: [
        "Иногда кажется, что для счастья нужен очень сложный план: найти своё призвание, разобраться в себе, научиться всё успевать и наконец наладить режим сна. А потом смотришь на миньонов и понимаешь: возможно, для начала хватит банана и компании таких же странных друзей. 🍌💛",
        "Эти маленькие жёлтые ребята умеют превратить любое поручение в приключение, последствия которого потом приходится устранять всем зданием. Отправишь их за инструментами — вернутся с мороженым. Попросишь нажать одну кнопку — нажмут все, особенно большую красную. Оставишь на пять минут без присмотра — обнаружишь, что у лаборатории теперь есть собственный космический корабль, а у корабля почему-то нет тормозов.",
        "И самое прекрасное: никто из них даже не подумает, что день прошёл зря.",
        "В мире миньонов вообще особые отношения с неудачами. Если эксперимент взорвался, значит, было зрелищно. Если план провалился, появится новый. Если товарищ застрял в вентиляции, сначала нужно посмеяться, потом помочь, потом застрять рядом. В итоге важнейшая операция может превратиться в коллективное спасение одного ботинка, но разве это повод расходиться?",
      ],
      full: [
        "Представьте обычный день с миньонами дома. Утро начинается с битвы за последний банан, продолжается попыткой приготовить завтрак и заканчивается тем, что тостер теперь умеет петь. Поездка в магазин стала бы экспедицией с потерей тележки и неожиданным приобретением двадцати килограммов фруктов.",
        "Наверное, жить с ними было бы ужасно неудобно. Смотреть на них — удивительно уютно.",
        "После миньонов иногда хочется позволить себе какую-нибудь маленькую глупость: включить любимую песню погромче, отправить другу смешное сообщение, купить что-нибудь вкусное просто так. Не превращать каждую свободную минуту в полезную. Рассмеяться, даже если шутка совершенно дурацкая.",
      ],
      answers: {
        summary: "Это шуточный пост о том, как миньоны находят радость в простых вещах, превращают любую задачу в приключение и поддерживают друг друга. Главная мысль: для счастья иногда достаточно друзей и умения посмеяться над неудачами.",
        comments: "Комментаторы разделились на два лагеря. Одни узнают в миньонах себя на работе: «отправили за отчётом — вернулся с тортом». Другие спорят, кто смешнее — миньоны или Грю, и вспоминают любимые сцены из мультфильмов.\n\nСамая заплюсованная ветка — про «большую красную кнопку»: люди делятся историями, как сами нажимали то, что нажимать не стоило.\n\nЕщё несколько человек благодарят автора за тёплый пост в тяжёлую неделю.",
        simple: "Если совсем просто: миньоны — весёлые ребята, у которых всё идёт не по плану, но они не расстраиваются. Автор говорит, что нам тоже можно меньше переживать из-за ошибок и больше радоваться мелочам и друзьям.",
        facts: "Пост шуточный — в нём личное мнение автора, а не утверждения, которые нужно проверять.\n\nПара фактов о героях: миньоны впервые появились в мультфильме «Гадкий я» (2010), их озвучивает режиссёр Пьер Коффен, а «язык миньонов» — смесь слов из разных языков.",
      },
      hints: ["Кто придумал миньонов", "Почему миньоны так популярны", "Из чего состоит язык миньонов"],
    },
    {
      id: "p2", kind: "Длинный текст, мало комментариев — без «Главного в комментариях»", rating: 312, author: "CookingBoss", community: "", theme: "",
      title: "Квас или кефир?", date: "29 мая", views: "35.5K", comments: 12, tags: ["Окрошка", "Еда", "Юмор"],
      first: "summary", more: ["simple", "facts"], after: ["facts", "simple"],
      text: [
        "Окрошка — как отношения: у каждого свой рецепт счастья. Кто-то клянётся на квасе: мол, это классика, дух детства и дачи с облупленным столом. Другие смотрят с презрением и шепчут: «Только кефир, иначе это уже не еда, а напиток с овощами».",
        "«Если в окрошке нет кваса, то скорее всего бог покинул вас» (с) Конфуций",
        "А есть и те, кто идут дальше — заливают окрошку игристым. Да-да, это не шутка. И ведь вкус получается… неожиданный: чуть праздничный, слегка дерзкий и очень Instagram-friendly. Правда, в таком случае огурцы лучше нарезать под шампанское, а не под тяп-ляп.",
      ],
      full: ["Не путайте последовательность ингредиентов и жизненных решений! Сначала овощи, потом зелень, и только в самом конце — жидкость. И главное: никогда не спорьте об окрошке на голодный желудок."],
      answers: {
        summary: "Автор с юмором разбирает вечный спор об окрошке: на квасе или на кефире. Вывод — правильного ответа нет, у каждого свой рецепт счастья, а кто-то и вовсе заливает окрошку игристым.",
        simple: "Окрошку делают по-разному: кто-то на квасе, кто-то на кефире. Автор шутит, что спорить бесполезно — вкусно так, как нравится вам.",
        facts: "Цитата про окрошку приписана Конфуцию в шутку — такого высказывания у него нет.\n\nКлассическая окрошка действительно готовится на квасе. Варианты на кефире, айране или минеральной воде появились позже и тоже популярны.",
      },
      hints: ["Откуда взялась окрошка", "Квас или кефир: что полезнее", "Как сделать домашний квас"],
    },
    {
      id: "p3", kind: "Короткий текст, много комментариев — первой идёт «Главное в комментариях»", rating: 1873, author: "TakidziroOnasi", community: "", theme: "",
      title: "Ответ на пост «Почему я больше не пойду в Спортмастер?»", date: "20 часов назад", views: "5.1K", comments: 418, tags: ["Спортмастер", "Касса", "Ответ на пост"],
      first: "comments", more: ["facts"], after: ["facts"],
      text: [
        "Понадобились дешёвые кроссовки, чисто от машины до работы дойти. Зашёл в спортмастер-дисконт, выбрал понравившиеся. Посмотрел, на озоне на 300 рублей дешевле. Но надо ждать пару дней. Решил купить здесь и сейчас. Беру кроссовки, иду на кассу. А там кассирша.",
        "— Есть наше приложение?\n— Нет.\n— Хотите установить?\n— Девушка, я в ваш Спортмастер захожу раз в пять лет, смысл мне вашим приложением телефон загружать?",
      ],
      full: [],
      answers: {
        comments: "В комментариях главное — общая усталость от навязчивых предложений на кассе. Самые заплюсованные ветки:\n\nМногие узнали ситуацию: «скачайте приложение», «оформите карту», «подписка со скидкой» — и всё это, когда хочется просто заплатить.\n\nБывшие кассиры объясняют, что у них план по установкам и за пропущенный вопрос могут наказать, — просят не злиться на продавцов.\n\nЧасть советует спокойно отвечать «нет, спасибо», другие — платить на кассе самообслуживания.",
        facts: "Сравнение цены с маркетплейсом — личный опыт автора, проверить его нельзя.\n\nПредложить приложение или карту лояльности продавец может, но отказаться — ваше право: покупку должны провести и без них.",
      },
      hints: ["Почему кассиры предлагают приложение", "Как вежливо отказаться на кассе"],
    },
  ];

  const DESC = {
    1: "<b>Как в макете.</b> У каждого поста сначала одна кнопка: длинный пост — «Кратко о посте», короткий с обсуждением — «Главное в комментариях». Нажмите: Нейро «читает», отвечает, и появляются остальные табы. Повторное нажатие на активный таб сворачивает ответ. Раскройте первый пост полностью — внизу появятся табы для прочитавших.",
    2: "<b>Лента диалога.</b> Ответы не заменяют друг друга, а копятся в одном чате, как переписка. Под последним ответом — подсказки «Спросить ещё», табы сверху отмечают, что уже спрашивали.",
    3: "<b>Боковая панель.</b> Табы остаются в посте, а разговор с Нейро открывается справа поверх сайдбара — пост можно читать рядом с ответом. Табы продублированы в панели.",
    4: "<b>Компакт.</b> Табы переезжают в шапку карточки, вместо отдельной строки «думаю» — мерцающий скелетон ответа. Длинный ответ свёрнут до нескольких строк, своё поле вопроса появляется по кнопке «Спросить своё».",
  };

  // ---------- состояние ----------
  let v = 1;
  const state = {};
  function reset() {
    for (const p of POSTS) state[p.id] = { shown: [p.first], active: null, phase: "idle", done: {}, log: [], expanded: false, afterShown: false, afterActive: null, timer: 0, compactOpen: false, ask: false };
    drawerFor = null;
  }
  let drawerFor = null;

  // ---------- утилиты ----------
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const para = (s) => esc(s).split("\n\n").map((x) => `<p>${x.replace(/\n/g, "<br>")}</p>`).join("");
  let toastT;
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2600); }

  // ---------- запуск действия ----------
  function run(pid, act, slot = "top") {
    const st = state[pid], p = POSTS.find((x) => x.id === pid);
    clearTimeout(st.timer);
    // ответ открывается либо сверху, либо в табах «для прочитавших» внизу — не в двух местах сразу
    if (slot === "after") { st.afterActive = act; st.active = null; } else { st.active = act; st.afterActive = null; }
    st.slot = slot;
    st.ask = false;
    if (v === 2 || v === 3) {
      // в ленте диалога и панели ответы копятся
      if (st.done[act] && st.log.some((m) => m.act === act)) { st.phase = "done"; renderAll(); scrollToMsg(pid, act); return; }
      st.log.push({ act, text: "", typing: true });
    }
    st.phase = "loading";
    if (v === 3) drawerFor = pid;
    renderAll();
    st.timer = setTimeout(() => type(pid, act), 1600 + Math.random() * 600);
  }
  function type(pid, act) {
    const st = state[pid], p = POSTS.find((x) => x.id === pid);
    const full = p.answers[act];
    st.phase = "typing";
    let i = 0;
    const step = () => {
      i = Math.min(full.length, i + 3);
      st.cur = full.slice(0, i);
      const entry = st.log.find((m) => m.act === act && m.typing);
      if (entry) entry.text = st.cur;
      paintAnswer(pid);
      if (i < full.length) { st.timer = setTimeout(step, 16); return; }
      st.phase = "done";
      st.done[act] = true;
      if (entry) entry.typing = false;
      // после первого ответа показываем остальные табы
      const was = st.shown.length;
      st.shown = [p.first, ...p.more];
      st.revealed = was === 1;
      renderAll();
      st.revealed = false;
    };
    step();
  }
  function stop(pid) {
    const st = state[pid];
    clearTimeout(st.timer);
    if (v === 2 || v === 3) st.log = st.log.filter((m) => !m.typing);
    st.phase = st.log.length || Object.keys(st.done).length ? "done" : "idle";
    if (st.phase === "idle") { st.active = null; st.afterActive = null; }
    else if (!(v === 2 || v === 3)) { st.active = null; st.afterActive = null; st.phase = "idle"; }
    renderAll();
  }
  function collapse(pid) { const st = state[pid]; clearTimeout(st.timer); st.active = null; st.afterActive = null; st.phase = st.log.length ? "done" : "idle"; if (v === 3) { drawerFor = null; } renderAll(); }

  // ---------- разметка частей ----------
  const tabBtn = (pid, act, on, slot, extra = "") => `<button class="tab${on ? " is-on" : ""}${extra}" data-act="${act}" data-pid="${pid}" data-slot="${slot}" type="button">${ACTIONS[act].t}</button>`;
  const neuroBtn = `<button class="nbtn" data-neuro type="button" aria-label="Открыть Пикабу Нейро"><img src="${A}neuro.svg" alt=""><span class="tip">Открыть Пикабу Нейро</span></button>`;
  const dots = `<span class="dots"><i></i><i></i><i></i></span>`;
  const loadingRow = (pid, act) => `<div class="loadrow">${dots}<span>${ACTIONS[act].load}</span><button class="stopbtn" data-stop="${pid}" type="button" aria-label="Остановить"><img src="${A}stop.svg" alt=""></button></div>`;
  const hints = (p) => `<div class="hints"><b>Хотите узнать больше в Нейро?</b>${p.hints.map((h) => `<a class="hint" data-hint="${esc(h)}"><img src="${A}dot.svg" alt=""><span>${esc(h)}</span><img src="${A}ext.svg" alt=""></a>`).join("")}</div>`;
  const input = (pid) => `<form class="ask" data-ask="${pid}"><div class="ask__row"><input type="text" placeholder="Что хотите узнать об этом посте?" aria-label="Вопрос Нейро"><button type="submit" aria-label="Отправить"><img src="${A}send.svg" alt=""></button></div><p>Откроется чат в Пикабу Нейро. Ваш вопрос и эта переписка уже будут там</p></form>`;
  const aiMsg = (text, done, typing) => `<div class="ai"><div class="ai__msg">${para(text)}${typing ? '<i class="cursor"></i>' : ""}${done ? '<small>ИИ может ошибаться. Проверяйте важную информацию</small>' : ""}</div>${done ? `<button class="copy" data-copy type="button" aria-label="Скопировать"><img src="${A}copy.svg" alt=""></button>` : ""}</div>`;
  const userMsg = (act) => `<div class="me"><span>${ACTIONS[act].q}</span></div>`;

  // ---------- вариант 1 «как в макете» и 2 «лента» ----------
  function panelV1(p, st) {
    const act = st.slot === "after" ? st.afterActive : st.active;
    if (!act) return "";
    if (st.phase === "loading") return `<div class="panel panel--load">${loadingRow(p.id, act)}</div>`;
    const done = st.phase === "done";
    return `<div class="panel" data-panel="${p.id}"><div class="chat">${userMsg(act)}<div data-live>${aiMsg(st.phase === "typing" ? st.cur || "" : p.answers[act], done, st.phase === "typing")}</div>${done ? hints(p) : ""}</div>${input(p.id)}</div>`;
  }
  function panelV2(p, st) {
    if (!st.log.length) return "";
    const msgs = st.log.map((m) => `<div class="turn" data-turn="${m.act}">${userMsg(m.act)}${m.typing && st.phase === "loading" ? `<div class="ai"><div class="ai__msg ai__think">${dots}<span>${ACTIONS[m.act].load}</span><button class="stopbtn" data-stop="${p.id}" type="button" aria-label="Остановить"><img src="${A}stop.svg" alt=""></button></div></div>` : `<div ${m.typing ? "data-live" : ""}>${aiMsg(m.text, !m.typing, m.typing)}</div>`}</div>`).join("");
    const left = st.shown.filter((a) => !st.log.some((m) => m.act === a));
    const sugg = st.phase === "done" && left.length ? `<div class="sugg"><span>Спросить ещё:</span>${left.map((a) => tabBtn(p.id, a, false, "top", " tab--ghost")).join("")}</div>` : "";
    return `<div class="panel panel--chat" data-panel="${p.id}"><div class="chat" data-scroll>${msgs}${sugg}${st.phase === "done" ? hints(p) : ""}</div>${input(p.id)}</div>`;
  }
  // ---------- вариант 4 «компакт» ----------
  function panelV4(p, st) {
    const act = st.active;
    if (!act) return "";
    const tabs = st.shown.map((a) => `<button class="seg${a === act ? " is-on" : ""}" data-act="${a}" data-pid="${p.id}" data-slot="top" type="button">${ACTIONS[a].t}</button>`).join("");
    const body = st.phase === "loading"
      ? `<div class="skel"><span>${ACTIONS[act].load}</span><i></i><i></i><i style="width:62%"></i></div>`
      : `<div class="cbody${st.compactOpen || st.phase === "typing" ? " is-open" : ""}" data-live>${para(st.phase === "typing" ? st.cur || "" : p.answers[act])}</div>${st.phase === "done" && p.answers[act].length > 260 && !st.compactOpen ? `<button class="more" data-more="${p.id}" type="button">Развернуть ответ</button>` : ""}`;
    const foot = st.phase === "done"
      ? `<div class="cfoot"><small>ИИ может ошибаться</small><button class="copy" data-copy type="button" aria-label="Скопировать"><img src="${A}copy.svg" alt=""></button><button class="askbtn" data-askopen="${p.id}" type="button">Спросить своё</button></div>${st.ask ? input(p.id) : ""}`
      : st.phase === "loading" ? `<div class="cfoot"><button class="stopline" data-stop="${p.id}" type="button"><img src="${A}stop.svg" alt="">Остановить</button></div>` : "";
    return `<div class="panel panel--compact" data-panel="${p.id}"><div class="chead"><img src="${A}neuro.svg" alt=""><div class="segs">${tabs}</div><button class="cx" data-collapse="${p.id}" type="button" aria-label="Свернуть"><img src="${A}close.svg" alt=""></button></div>${body}${foot}</div>`;
  }

  function neuroBlock(p, st, slot = "top") {
    // табы в посте
    const list = slot === "after" ? p.after : st.shown;
    const activeTab = slot === "after" ? st.afterActive : st.active;
    if (v === 4 && slot === "top" && st.active) return `<div class="neuro">${panelV4(p, st)}</div>`;
    const tabs = list.map((a, i) => tabBtn(p.id, a, activeTab === a && (v === 3 ? drawerFor === p.id : true), slot, st.revealed && i > 0 && slot === "top" ? " is-new" : "")).join("");
    let panel = "";
    if (v === 1) panel = st.slot === slot ? panelV1(p, st) : "";
    if (v === 2 && slot === "top") panel = panelV2(p, st);
    return `<div class="neuro"><div class="bar">${neuroBtn}${tabs}</div>${panel}</div>`;
  }

  // ---------- пост ----------
  function postHTML(p) {
    const st = state[p.id];
    const authorRow = `<div class="author"><span class="who"><img src="${A}user-ava.png" alt="">${p.author}</span>${p.community ? `<span class="who"><img class="sq" src="${A}comm-ava.png" alt="">${p.community}</span>` : ""}${p.theme ? `<span class="who"><span class="theme"><img src="${A}theme.svg" alt=""></span>${p.theme}</span>` : ""}<img class="kebab" src="${A}more.svg" alt=""></div>`;
    const body = p.text.map((x) => `<p>${esc(x).replace(/\n/g, "<br>")}</p>`).join("");
    const fullBody = st.expanded ? p.full.map((x) => `<p>${esc(x)}</p>`).join("") : "";
    const canExpand = p.full.length && !st.expanded;
    // табы «для прочитавших» внизу длинного поста (только в варианте 1 — как в макете)
    const after = v === 1 && st.expanded && p.after ? neuroBlock(p, st, "after") : "";
    return `<article class="post" id="${p.id}">
      <div class="vote"><div class="rate"><img src="${A}rating-plus.svg" alt=""><span>${p.rating}</span><img src="${A}rating-minus.svg" alt=""></div><span class="coll"><img src="${A}minus.svg" alt=""></span></div>
      <div class="card">
        <div class="cin">
          <span class="kind">${p.kind}</span>
          ${authorRow}
          <h2>${p.title}</h2>
          <div class="meta"><span><img src="${A}watch.svg" alt="">${p.date}</span><span><img src="${A}eye.svg" alt="">${p.views}</span></div>
          ${neuroBlock(p, st, "top")}
          <div class="text${st.expanded ? " is-full" : ""}">${body}${fullBody}</div>
          ${canExpand ? `<button class="showall" data-expand="${p.id}" type="button">Показать полностью</button>` : ""}
          ${after}
          <div class="tags"><span class="tag tag--mine">[моё]</span>${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}<span class="tag tag--more"><img src="${A}more-s.svg" alt=""></span></div>
          <div class="reactions"><span><img src="${A}love.svg" alt=""></span><span><img src="${A}smile.svg" alt=""></span></div>
        </div>
        <div class="foot"><span><img src="${A}comment.svg" alt="">${p.comments}</span><span><img src="${A}disk.svg" alt=""></span><span><img src="${A}share.svg" alt=""></span></div>
      </div>
    </article>`;
  }

  // ---------- боковая панель (вариант 3) ----------
  function renderDrawer() {
    const d = $("#drawer");
    if (v !== 3 || !drawerFor) { d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true"); return; }
    const p = POSTS.find((x) => x.id === drawerFor), st = state[drawerFor];
    $("#drawerPost").textContent = p.title;
    const tabs = st.shown.map((a) => tabBtn(p.id, a, st.active === a, "top")).join("");
    $("#drawerBody").innerHTML = `<div class="bar bar--drawer">${tabs}</div>${panelV2(p, st) || ""}`;
    d.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
    const sc = $("#drawerBody [data-scroll]"); if (sc) sc.scrollTop = sc.scrollHeight;
  }

  // ---------- отрисовка ----------
  function renderAll() {
    $("#feed").innerHTML = POSTS.map(postHTML).join("");
    renderDrawer();
    document.querySelectorAll("#feed [data-scroll]").forEach((el) => (el.scrollTop = el.scrollHeight));
  }
  // во время печати перерисовываем только текст ответа, чтобы не мигала вся лента
  function paintAnswer(pid) {
    const st = state[pid], p = POSTS.find((x) => x.id === pid);
    const root = v === 3 ? $("#drawer") : $(`#${pid}`);
    let live = root && root.querySelector("[data-live]");
    if (!live) { renderAll(); return; }
    if (v === 4) { live.innerHTML = para(st.cur || ""); return; }
    live.innerHTML = aiMsg(st.cur || "", false, true);
    const sc = root.querySelector("[data-scroll]"); if (sc) sc.scrollTop = sc.scrollHeight;
  }
  function scrollToMsg(pid, act) {
    const root = v === 3 ? $("#drawer") : $(`#${pid}`);
    const el = root && root.querySelector(`[data-turn="${act}"]`);
    if (el) { el.scrollIntoView({ block: "nearest", behavior: "smooth" }); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1200); }
  }

  // ---------- события ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.matches("[data-act]")) {
      const pid = t.dataset.pid, act = t.dataset.act, slot = t.dataset.slot, st = state[pid];
      const cur = slot === "after" ? st.afterActive : st.active;
      // повторное нажатие на активный таб — свернуть (в варианте 1); в 4 — сегменты только переключают
      if (cur === act && st.slot === slot && v === 1 && st.phase === "done") { collapse(pid); return; }
      if (cur === act && v === 3 && drawerFor === pid) { collapse(pid); return; }
      if (st.phase === "loading" || st.phase === "typing") { clearTimeout(st.timer); if (v === 2 || v === 3) st.log = st.log.filter((m) => !m.typing); }
      if (v === 4) st.compactOpen = false;
      run(pid, act, slot);
      return;
    }
    if (t.matches("[data-stop]")) { stop(t.dataset.stop); return; }
    if (t.matches("[data-collapse]")) { collapse(t.dataset.collapse); return; }
    if (t.matches("[data-expand]")) { const st = state[t.dataset.expand]; st.expanded = true; renderAll(); return; }
    if (t.matches("[data-more]")) { state[t.dataset.more].compactOpen = true; renderAll(); return; }
    if (t.matches("[data-askopen]")) { const st = state[t.dataset.askopen]; st.ask = !st.ask; renderAll(); const i = document.querySelector(`[data-ask="${t.dataset.askopen}"] input`); if (i) i.focus(); return; }
    if (t.matches("[data-copy]")) { const msg = t.closest(".ai, .panel"); const txt = (msg.querySelector(".ai__msg p, .cbody") || msg).innerText; try { navigator.clipboard.writeText(txt); } catch {} toast("Ответ скопирован"); return; }
    if (t.matches("[data-hint]")) { toast(`Откроется Пикабу Нейро с вопросом «${t.dataset.hint}»`); return; }
    if (t.matches("[data-neuro]")) { toast("Откроется Пикабу Нейро"); return; }
    if (t.id === "drawerClose") { drawerFor = null; for (const p of POSTS) state[p.id].active = null; renderAll(); return; }
  });
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-ask]");
    if (!f) return;
    e.preventDefault();
    const q = f.querySelector("input").value.trim();
    toast(q ? `Откроется чат в Пикабу Нейро с вопросом «${q}» и этой перепиской` : "Напишите вопрос — он откроется в Пикабу Нейро");
  });

  // ---------- переключение вариантов ----------
  function setV(n) {
    v = n;
    document.body.dataset.v = n;
    document.querySelectorAll(".demo__group button").forEach((b) => b.classList.toggle("is-on", +b.dataset.v === n));
    $("#desc").innerHTML = DESC[n];
    fit();
    reset();
    renderAll();
  }
  document.querySelectorAll(".demo__group button").forEach((b) => b.addEventListener("click", () => { history.replaceState(null, "", "#v" + b.dataset.v); setV(+b.dataset.v); }));
  $("#reset").addEventListener("click", () => { setV(v); toast("Всё сначала"); });

  // масштаб под узкие экраны: страница Пикабу рассчитана на 1020 + поля
  function fit() { const z = Math.min(1, innerWidth / 1180); $("#zoom").style.zoom = z < 1 ? z : ""; document.documentElement.style.setProperty("--demo-h", $(".demo").offsetHeight + "px"); }
  addEventListener("resize", fit);
  fit();
  setV(+(location.hash.match(/v(\d)/) || [0, 1])[1] || 1);
})();
