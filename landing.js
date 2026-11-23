(function () {
  var C = window.UNITY || {};
  document.documentElement.classList.add("js");

  // 1. Sistema Global de Alertas estilo "¡Logro de Minecraft Desbloqueado!"
  var toastEl = document.getElementById("mc-toast");
  var toastTitle = document.getElementById("mc-toast-title");
  var toastDesc = document.getElementById("mc-toast-desc");
  var toastIcon = toastEl ? toastEl.querySelector(".mc-toast-icon") : null;
  var toastTimer = null;

  function showMcToast(title, desc, icon) {
    if (!toastEl) return;
    if (toastTitle) toastTitle.textContent = title || "¡Logro Desbloqueado!";
    if (toastDesc) toastDesc.textContent = desc || "";
    if (toastIcon) toastIcon.textContent = icon || "🏆";
    toastEl.classList.add("is-active");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-active");
    }, 3400);
  }
  window.showMcToast = showMcToast;

  // 2. IP del Servidor y Botones de Copiar con Toast de Logro
  var realIp = (C.ip || "").trim();
  var activeIp = realIp || (C.previewIp || "play.unitycraft.net").trim();

  document.querySelectorAll("[data-ip]").forEach(function (el) {
    el.textContent = activeIp;
  });

  document.querySelectorAll("[data-bedrock]").forEach(function (el) {
    if (C.bedrockPort) {
      el.textContent = "Puerto " + C.bedrockPort;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });

  var live = document.getElementById("live");
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var originalText = btn.textContent;
      var onCopied = function () {
        btn.textContent = "✔ ¡IP Copiada!";
        if (live) live.textContent = "IP copiada al portapapeles: " + activeIp;
        showMcToast("¡Logro Desbloqueado!", "IP copiada: " + activeIp, "🏆");
        setTimeout(function () {
          btn.textContent = originalText;
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(activeIp).then(onCopied, function () {
          prompt("Copia la IP del servidor:", activeIp);
        });
      } else {
        prompt("Copia la IP del servidor:", activeIp);
      }
    });
  });

  // 3. Contador de Jugadores en Tiempo Real (cuando hay IP real configurada)
  var playersBadge = document.querySelector("[data-players-online]");
  if (playersBadge && realIp) {
    fetch("https://api.mcsrvstat.us/3/" + encodeURIComponent(realIp))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.online && d.players) {
          playersBadge.textContent = d.players.online + " JUGADORES EN LÍNEA";
        }
      })
      .catch(function () {});
  }

  // 4. Enlaces Externos Configurables (se ocultan si están vacíos)
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var url = C[a.getAttribute("data-link")];
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.hidden = true;
    }
  });

  // 5. Menú Móvil Accesible
  var b = document.querySelector(".burger");
  var n = document.getElementById("menu");
  if (b && n) {
    b.addEventListener("click", function () {
      var o = n.classList.toggle("open");
      b.setAttribute("aria-expanded", String(o));
    });
    n.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        n.classList.remove("open");
        b.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 6. Modales Nativos (<dialog>) y Generador OTP /vincular
  function generateOtpCode() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var code = "UC-";
    for (var i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-open-modal");
      var modal = document.getElementById(id);
      if (modal && typeof modal.showModal === "function") {
        modal.showModal();
      }
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var modal = btn.closest("dialog");
      if (modal) modal.close();
    });
  });

  document.querySelectorAll("[data-regen-otp]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var otpEl = document.getElementById("otp-cmd");
      if (otpEl) {
        var newCmd = "/vincular " + generateOtpCode();
        otpEl.textContent = newCmd;
        showMcToast("Nuevo Código OTP", "Generado: " + newCmd, "🔐");
      }
    });
  });

  document.querySelectorAll("[data-copy-cmd]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy-cmd"));
      if (!target) return;
      var cmd = target.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(function () {
          showMcToast("¡Comando Copiado!", cmd + " listo para pegar en el chat", "⚡");
        });
      }
    });
  });

  // 7. Copia rápida al hacer clic en cualquier comando <code>/comando</code> en Tutoriales
  document.querySelectorAll("table code, .tip code, p code, li code").forEach(function (codeEl) {
    var txt = codeEl.textContent.trim();
    if (txt.indexOf("/") === 0) {
      codeEl.style.cursor = "pointer";
      codeEl.title = "Haz clic para copiar el comando";
      codeEl.addEventListener("click", function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(function () {
            showMcToast("¡Comando Copiado!", txt + " copiado al portapapeles", "⌨️");
          });
        }
      });
    }
  });

  // 8. FASE 2: Sincronización de Perfil, Skin 3D/2D y Leaderboards (perfil.html)
  var PRESET_PLAYERS = {
    jakemy: {
      rank: "📺 STREAMER OFICIAL · TIKTOK LIVE",
      money: "$184,500",
      job: "Minero Maestro (Nv. 32)",
      playtime: "318h 40m",
      kd: "3.92 K/D",
      bosses: "84 Jefes",
      wave: "Oleada 64",
      claims: "9,400 / 10,000",
      power: "Nivel 164"
    },
    josetan: {
      rank: "📺 STREAMER OFICIAL · TIKTOK LIVE",
      money: "$169,200",
      job: "Cazador de Jefes (Nv. 30)",
      playtime: "294h 15m",
      kd: "3.65 K/D",
      bosses: "79 Jefes",
      wave: "Oleada 61",
      claims: "8,900 / 10,000",
      power: "Nivel 158"
    },
    technoblade: {
      rank: "👑 RANGO [LEGEND]",
      money: "$142,800",
      job: "Guerrero (Nv. 29)",
      playtime: "240h 10m",
      kd: "5.12 K/D",
      bosses: "68 Jefes",
      wave: "Oleada 58",
      claims: "7,200 / 8,500",
      power: "Nivel 149"
    }
  };

  function applyPlayerProfile(nick, silent) {
    var cleanNick = (nick || "").trim().replace(/[^a-zA-Z0-9_]/g, "");
    if (!cleanNick) return;

    try {
      localStorage.setItem("unitycraft_nick", cleanNick);
    } catch (e) {}

    // Actualizar avatares del Header en todas las páginas
    document.querySelectorAll(".header .player-avatar, .player-hud .player-avatar").forEach(function (img) {
      img.src = "https://mc-heads.net/avatar/" + encodeURIComponent(cleanNick) + "/32";
      img.alt = "Avatar de " + cleanNick;
    });

    var userEl = document.getElementById("profile-username");
    var bodyImg = document.getElementById("profile-skin-body");
    if (!userEl || !bodyImg) return;

    userEl.textContent = cleanNick;
    bodyImg.src = "https://mc-heads.net/body/" + encodeURIComponent(cleanNick) + "/140";
    bodyImg.alt = "Skin de " + cleanNick;

    var key = cleanNick.toLowerCase();
    var p = PRESET_PLAYERS[key];
    if (!p) {
      var seed = 0;
      for (var i = 0; i < cleanNick.length; i++) seed += cleanNick.charCodeAt(i);
      p = {
        rank: "⚡ RANGO [SURVIVOR PRO]",
        money: "$" + (25000 + (seed * 137) % 95000).toLocaleString("es-ES"),
        job: "Minero (Nv. " + (14 + (seed % 15)) + ")",
        playtime: (60 + (seed % 180)) + "h " + (seed % 59) + "m",
        kd: (1.4 + ((seed % 25) / 10)).toFixed(2) + " K/D",
        bosses: (12 + (seed % 45)) + " Jefes",
        wave: "Oleada " + (24 + (seed % 32)),
        claims: (3200 + (seed * 23) % 4500).toLocaleString("es-ES") + " / 8,000",
        power: "Nivel " + (85 + (seed % 65))
      };
    }

    var rankTag = document.querySelector(".profile-rank-tag");
    if (rankTag) rankTag.textContent = p.rank;
    var map = {
      "stat-vault-money": p.money,
      "stat-active-job": p.job,
      "stat-playtime": p.playtime,
      "stat-kd": p.kd,
      "stat-bosses": p.bosses,
      "stat-wave": p.wave,
      "stat-claim-blocks": p.claims,
      "stat-power-level": p.power
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = map[id];
    });

    if (!silent) {
      showMcToast("¡Perfil Sincronizado!", "Mostrando Skin y Stats de " + cleanNick, "🟢");
    }
  }

  var savedNick = "";
  try {
    savedNick = localStorage.getItem("unitycraft_nick") || "";
  } catch (e) {}
  if (savedNick) {
    applyPlayerProfile(savedNick, true);
  }

  var searchForm = document.getElementById("form-search-player");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("input-mc-nick");
      if (input && input.value.trim()) {
        applyPlayerProfile(input.value.trim(), false);
      }
    });
  }

  document.querySelectorAll("[data-inspect-player]").forEach(function (row) {
    row.addEventListener("click", function () {
      var targetNick = row.getAttribute("data-inspect-player");
      var input = document.getElementById("input-mc-nick");
      if (input) input.value = targetNick;
      applyPlayerProfile(targetNick, false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // 9. FASE 3: Monedero Global de UnityTokens, Filtros de Tienda, Canjes y Recargas
  var userTokens = 1250;
  try {
    var storedTokens = localStorage.getItem("unitycraft_tokens");
    if (storedTokens !== null && !isNaN(Number(storedTokens))) {
      userTokens = Number(storedTokens);
    }
  } catch (e) {}

  function getActiveNick() {
    try {
      return localStorage.getItem("unitycraft_nick") || "Steve_UC";
    } catch (e) {
      return "Steve_UC";
    }
  }

  function renderTokensAndTarget() {
    var formatted = "🪙 " + userTokens.toLocaleString("es-ES");
    document.querySelectorAll("[data-user-tokens]").forEach(function (el) {
      el.textContent = formatted;
    });
    var currentNick = getActiveNick();
    var targetNickEl = document.getElementById("store-target-nick");
    if (targetNickEl) targetNickEl.textContent = currentNick;
    document.querySelectorAll("[data-history-default-nick]").forEach(function (el) {
      el.textContent = currentNick;
    });
  }

  function setTokens(newAmount) {
    userTokens = Math.max(0, Number(newAmount) || 0);
    try {
      localStorage.setItem("unitycraft_tokens", String(userTokens));
    } catch (e) {}
    renderTokensAndTarget();
  }
  renderTokensAndTarget();

  // Filtros de Categoría en tienda.html
  var filterBtns = document.querySelectorAll("[data-filter]");
  var storeCards = document.querySelectorAll(".store-card[data-category]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      storeCards.forEach(function (card) {
        var match = cat === "all" || card.getAttribute("data-category") === cat;
        card.hidden = !match;
      });
    });
  });

  // Flujo de Compra / Canje con UnityTokens
  var pendingPurchase = null;
  var checkoutModal = document.getElementById("modal-checkout-item");
  var topupModal = document.getElementById("modal-topup");

  document.querySelectorAll("[data-buy-name]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var itemName = btn.getAttribute("data-buy-name");
      var itemCost = Number(btn.getAttribute("data-buy-cost") || 0);
      var rawCmd = btn.getAttribute("data-buy-cmd") || "";
      var player = getActiveNick();
      var finalCmd = "/" + rawCmd.replace("{player}", player);

      if (userTokens < itemCost) {
        showMcToast(
          "Tokens Insuficientes",
          "Te faltan " + (itemCost - userTokens) + " 🪙 para " + itemName,
          "🪙"
        );
        if (topupModal && typeof topupModal.showModal === "function") {
          topupModal.showModal();
        }
        return;
      }

      pendingPurchase = {
        name: itemName,
        cost: itemCost,
        player: player,
        cmd: finalCmd
      };

      var nameEl = document.getElementById("checkout-item-name");
      var playerEl = document.getElementById("checkout-item-player");
      var costEl = document.getElementById("checkout-item-cost");
      var cmdEl = document.getElementById("checkout-item-cmd");

      if (nameEl) nameEl.textContent = itemName;
      if (playerEl) playerEl.textContent = player;
      if (costEl) costEl.textContent = "🪙 " + itemCost.toLocaleString("es-ES");
      if (cmdEl) cmdEl.textContent = finalCmd;

      if (checkoutModal && typeof checkoutModal.showModal === "function") {
        checkoutModal.showModal();
      }
    });
  });

  var confirmPurchaseBtn = document.getElementById("btn-confirm-purchase");
  var historyBody = document.getElementById("order-history-body");

  if (confirmPurchaseBtn) {
    confirmPurchaseBtn.addEventListener("click", function () {
      if (!pendingPurchase) return;
      if (userTokens < pendingPurchase.cost) return;

      setTokens(userTokens - pendingPurchase.cost);

      if (historyBody) {
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td><strong>" + pendingPurchase.name + "</strong></td>" +
          "<td>" + pendingPurchase.player + "</td>" +
          "<td><code>" + pendingPurchase.cmd + "</code></td>" +
          "<td><strong style='color:var(--color-gold)'>🪙 " + pendingPurchase.cost + "</strong></td>" +
          "<td><span class='lb-badge' style='color:var(--color-primary)'>✔ ENTREGADO</span></td>";
        historyBody.insertBefore(tr, historyBody.firstChild);
      }

      if (checkoutModal) checkoutModal.close();
      var currentPurchase = pendingPurchase;
      pendingPurchase = null;

      if (C.apiUrl) {
        fetch(C.apiUrl.replace(/\/$/, "") + "/api/store/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player: currentPurchase.player,
            itemName: currentPurchase.name
          })
        }).catch(function () {});
      }

      showMcToast(
        "¡Compra Entregada In-Game!",
        currentPurchase.name + " enviado a " + currentPurchase.player,
        "🎁"
      );
    });
  }

  // Pasarela de Recarga de UnityTokens
  var selectedTopupTokens = 1400;
  var selectedTopupUsd = "5.99";
  var selectedPayMethod = "Stripe / Tarjeta";

  function updateTopupSummary() {
    var tEl = document.getElementById("topup-summary-tokens");
    var uEl = document.getElementById("topup-summary-usd");
    if (tEl) tEl.textContent = "🪙 " + selectedTopupTokens.toLocaleString("es-ES") + " Tokens";
    if (uEl) uEl.textContent = "$" + selectedTopupUsd + " USD (" + selectedPayMethod + ")";
  }

  document.querySelectorAll("[data-pay-method]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectedPayMethod = btn.getAttribute("data-pay-method");
      document.querySelectorAll("[data-pay-method]").forEach(function (b) {
        b.classList.toggle("is-selected", b === btn);
      });
      updateTopupSummary();
    });
  });

  document.querySelectorAll("[data-quick-pkg]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectedTopupTokens = Number(btn.getAttribute("data-quick-pkg") || 1400);
      selectedTopupUsd = btn.getAttribute("data-quick-usd") || "5.99";
      updateTopupSummary();
    });
  });

  document.querySelectorAll("[data-select-topup]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectedTopupTokens = Number(btn.getAttribute("data-select-topup") || 1400);
      selectedTopupUsd = btn.getAttribute("data-select-usd") || "5.99";
      updateTopupSummary();
      if (topupModal && typeof topupModal.showModal === "function") {
        topupModal.showModal();
      }
    });
  });

  var processTopupBtn = document.getElementById("btn-process-topup");
  if (processTopupBtn) {
    processTopupBtn.addEventListener("click", function () {
      setTokens(userTokens + selectedTopupTokens);
      if (topupModal) topupModal.close();
      showMcToast(
        "¡Recarga Exitosa!",
        "+" + selectedTopupTokens.toLocaleString("es-ES") + " UnityTokens acreditados vía " + selectedPayMethod,
        "💎"
      );
    });
  }

  // 10. Scroll Reveal con IntersectionObserver
  var els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  } else {
    els.forEach(function (el) {
      el.classList.add("in");
    });
  }
})();

(function () {
  var rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var prog = document.getElementById("prog");
  var hd = document.querySelector("header");
  var sc = document.getElementById("scene");
  var st = document.querySelector(".stars");
  var mo = document.querySelector(".moon");

  function onS() {
    var y = scrollY;
    var h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (hd) hd.classList.toggle("sm", y > 40);
    if (!rm && y < 900 && st && mo && sc) {
      st.style.transform = "translate3d(0," + y * 0.15 + "px,0)";
      mo.style.transform = "translate3d(0," + y * 0.35 + "px,0)";
      sc.style.transform = "translate3d(0," + y * -0.06 + "px,0)";
    }
  }
  addEventListener("scroll", onS, { passive: true });
  onS();

  // Texto rotativo con efecto de escritura en Hero
  var el = document.getElementById("rot");
  if (el) {
    var w = [
      "survival global",
      "minijuegos y arcades",
      "mazmorras con jefes",
      "oleadas infinitas",
      "regalos de TikTok LIVE",
      "cosméticos únicos"
    ];
    var i = 0;
    var c = 0;
    var del = false;
    if (rm) {
      el.textContent = w[0];
    } else {
      (function t() {
        var s = w[i];
        c += del ? -1 : 1;
        el.textContent = s.slice(0, c);
        var d = del ? 35 : 75;
        if (!del && c === s.length) {
          del = true;
          d = 1500;
        } else if (del && c === 0) {
          del = false;
          i = (i + 1) % w.length;
          d = 300;
        }
        setTimeout(t, d);
      })();
    }
  }

  // Spotlight e inclinación 3D acelerada por GPU con requestAnimationFrame
  if (!rm && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll(".card").forEach(function (k) {
      var rafId = null;
      k.addEventListener("pointermove", function (e) {
        if (rafId) return;
        rafId = requestAnimationFrame(function () {
          var r = k.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width;
          var y = (e.clientY - r.top) / r.height;
          k.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
          k.style.setProperty("--my", (y * 100).toFixed(1) + "%");
          k.style.transform =
            "perspective(850px) rotateX(" +
            ((0.5 - y) * 5).toFixed(2) +
            "deg) rotateY(" +
            ((x - 0.5) * 7).toFixed(2) +
            "deg) translate3d(0,-5px,0)";
          rafId = null;
        });
      });
      k.addEventListener("pointerleave", function () {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        k.style.transform = "";
      });
    });
  }
})();
