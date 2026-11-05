/* Посещение сайта → быстрые ссылки кабинета + полоски «← Кабинет» сверху/снизу. */
(function () {
  var KEY = "pp_visited_sites";
  var el = document.currentScript;
  var id = (el && el.getAttribute("data-site")) || "";

  function readList() {
    var a = [];
    var b = [];
    try {
      a = JSON.parse(sessionStorage.getItem(KEY) || "[]");
    } catch (e) {}
    try {
      b = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {}
    if (!Array.isArray(a)) a = [];
    if (!Array.isArray(b)) b = [];
    var out = [];
    a.concat(b).forEach(function (x) {
      if (x && out.indexOf(x) === -1) out.push(x);
    });
    return out;
  }

  function writeList(list) {
    var raw = JSON.stringify(list);
    try {
      sessionStorage.setItem(KEY, raw);
    } catch (e) {}
    try {
      localStorage.setItem(KEY, raw);
    } catch (e) {}
  }

  function mark(siteId) {
    if (!siteId) return;
    var list = readList();
    if (list.indexOf(siteId) === -1) {
      list.push(siteId);
      writeList(list);
    } else {
      writeList(list);
    }
  }

  mark(id);

  function bar() {
    var p = document.createElement("p");
    p.className = "pp-cab-bar";
    var href = "../cabinet/index.html?v=3" + (id ? "&from=" + encodeURIComponent(id) : "");
    p.innerHTML = '<a href="' + href + '">← Кабинет детектива</a>';
    return p;
  }

  function inject() {
    if (document.querySelector(".pp-cab-bar")) return;
    if (!document.getElementById("pp-cab-bar-css")) {
      var css = document.createElement("style");
      css.id = "pp-cab-bar-css";
      css.textContent =
        ".pp-cab-bar{margin:0 0 12px;padding:0;font-size:.88rem;line-height:1.35}" +
        ".pp-cab-bar a{font-weight:600;text-decoration:none}" +
        ".pp-cab-bar a:hover{text-decoration:underline}" +
        ".pp-cab-bar.pp-cab-bar-bot{margin:28px 0 0;padding-top:14px;border-top:1px solid rgba(128,128,128,.28)}" +
        "body.mail-open .pp-cab-bar{display:block!important}";
      document.head.appendChild(css);
    }
    var wrap = document.querySelector(".wrap") || document.body;
    var top = bar();
    var bot = bar();
    bot.classList.add("pp-cab-bar-bot");
    wrap.insertBefore(top, wrap.firstChild);
    wrap.appendChild(bot);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
