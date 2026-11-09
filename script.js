document.addEventListener("DOMContentLoaded", function () {
  // السنة في التذييل
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // رسالة واتساب جاهزة
  var waBtn = document.getElementById("whatsappBtn");
  if (waBtn) {
    var msg = "السلام عليكم، شفت سيرتك الرقمية وأبغى أستفسر عن خدماتك.";
    waBtn.href = "https://wa.me/966501896483?text=" + encodeURIComponent(msg);
  }

  // ظهور الأقسام تدريجيًا عند التمرير
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // تمييز الرابط النشط في شريط التنقل حسب القسم الظاهر
  var navLinks = document.querySelectorAll(".nav__links a");
  var sections = document.querySelectorAll("main section[id]");

    var navList = document.querySelector(".nav__links");

  function setActive(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("data-target") === id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
        // نحرّك الشريط الأفقي فقط، بدون ما نلمس سكرول الصفحة
        if (navList) {
          var l = link.getBoundingClientRect();
          var n = navList.getBoundingClientRect();
          navList.scrollLeft += (l.left + l.width / 2) - (n.left + n.width / 2);
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  // زر تحميل PDF (يفتح نافذة الطباعة، اختاري "حفظ كـ PDF")
  var printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      // نُظهر كل الأقسام قبل الطباعة تحسبًا لأي قسم لم يظهر بالتمرير بعد
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      window.print();
    });
  }

  // نسخ البريد الإلكتروني
  var copyBtn = document.getElementById("copyEmail");
  var emailLink = document.getElementById("emailLink");
  if (copyBtn && emailLink) {
    copyBtn.addEventListener("click", function () {
      var email = emailLink.textContent.trim();
      var done = function () {
        copyBtn.textContent = "تم النسخ ✓";
        setTimeout(function () {
          copyBtn.textContent = "نسخ";
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () {});
      } else {
        var temp = document.createElement("textarea");
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {}
        document.body.removeChild(temp);
      }
    });
  }
});