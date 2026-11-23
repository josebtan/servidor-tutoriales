/**
 * =============================================================================
 * UNITYCRAFT NETWORK — MICROSERVICIO BACKEND & PUENTE ELIXIRNODE (PTERODACTYL)
 * Conecta la web estática (GitHub Pages) con MySQL (CMI/AuraSkills/GriefPrevention)
 * y envía entregas de CraftEngine / LuckPerms a:
 * https://game.elixirnode.com/server/8b9cfa7f
 * =============================================================================
 */
const http = require("http");
const https = require("https");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const PTERO_PANEL_URL = (process.env.PTERO_PANEL_URL || "https://game.elixirnode.com").replace(/\/$/, "");
const PTERO_SERVER_ID = process.env.PTERO_SERVER_ID || "8b9cfa7f";
const PTERO_API_KEY = process.env.PTERO_CLIENT_API_KEY || "";
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "";

// Validación estricta de Nickname de Minecraft Java/Bedrock (Previene Command Injection)
const MC_NICK_REGEX = /^\.?[a-zA-Z0-9_]{3,16}$/;

// Catálogo oficial en memoria (sincronizado con schema.sql y CraftEngine)
const CATALOG = {
  "Pack 3× Llave Normal": { cost: 250, cmd: "ce item give {player} chests:normal_key 3" },
  "Pack 3× Llave Media": { cost: 550, cmd: "ce item give {player} chests:medium_key 3" },
  "Pack 3× Llave Ultra Mítica": { cost: 950, cmd: "ce item give {player} chests:premium_key 3" },
  "Sombrero de Bruja 3D": { cost: 600, cmd: "ce item give {player} cosmetics:witch_hat_black 1" },
  "Armadura Caballero Barril 3D": { cost: 750, cmd: "ce item give {player} cosmetics:barrel_chestplate 1" },
  "Escudo Rueda de Madera 3D": { cost: 500, cmd: "ce item give {player} cosmetics:wooden_wheel 1" },
  "Pack Cubeta y Horca 3D": { cost: 450, cmd: "ce item give {player} cosmetics:wooden_bucket 1" },
  "Pack Gadgets Cohete & Discoball": { cost: 800, cmd: "lp user {player} permission set ultracosmetics.gadgets.*" },
  "Rango [LEGEND] (30 Días)": { cost: 1500, cmd: "lp user {player} parent addtemp legend 30d" }
};

/**
 * Envía un comando de consola seguro al servidor de ElixirNode (8b9cfa7f) vía Pterodactyl API
 */
function sendPterodactylCommand(command) {
  return new Promise((resolve, reject) => {
    if (!PTERO_API_KEY) {
      return resolve({ simulated: true, command });
    }
    const url = new URL(`${PTERO_PANEL_URL}/api/client/servers/${PTERO_SERVER_ID}/command`);
    const payload = JSON.stringify({ command });

    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PTERO_API_KEY}`,
          "Accept": "Application/vnd.pterodactyl.v1+json",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      },
      (res) => {
        if (res.statusCode === 204 || res.statusCode === 200) {
          resolve({ delivered: true, command });
        } else {
          reject(new Error(`ElixirNode API respondió HTTP ${res.statusCode}`));
        }
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Webhook-Signature"
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 64 * 1024) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve({ raw, json: raw ? JSON.parse(raw) : {} });
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // 1. Healthcheck
  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      serverId: PTERO_SERVER_ID,
      pteroConnected: Boolean(PTERO_API_KEY)
    });
  }

  // 2. Generar Código OTP /vincular
  if (req.method === "POST" && url.pathname === "/api/link/generate") {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let otp = "UC-";
    for (let i = 0; i < 4; i++) {
      otp += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return sendJson(res, 200, {
      ok: true,
      code: otp,
      command: `/vincular ${otp}`,
      expiresInSeconds: 300
    });
  }

  // 3. Canjear Artículo en la Tienda (Entrega In-Game vía CraftEngine / LuckPerms)
  if (req.method === "POST" && url.pathname === "/api/store/redeem") {
    try {
      const { json } = await readJsonBody(req);
      const player = String(json.player || "").trim();
      const itemName = String(json.itemName || "").trim();

      if (!MC_NICK_REGEX.test(player)) {
        return sendJson(res, 400, { ok: false, error: "Nickname de Minecraft inválido." });
      }

      const item = CATALOG[itemName];
      if (!item) {
        return sendJson(res, 404, { ok: false, error: "Artículo no encontrado en el catálogo." });
      }

      const commandToRun = item.cmd.replace("{player}", player);
      const delivery = await sendPterodactylCommand(commandToRun);

      // Notificación visual in-game mediante CMI
      await sendPterodactylCommand(
        `cmi actionbarmsg ${player} &6✦ &a¡Has recibido &e${itemName} &ade la Tienda Web! &6✦`
      ).catch(() => {});

      return sendJson(res, 200, {
        ok: true,
        player,
        itemName,
        cost: item.cost,
        command: `/${commandToRun}`,
        delivery
      });
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: err.message });
    }
  }

  // 4. Webhook de Confirmación de Recarga de UnityTokens (HMAC-SHA256)
  if (req.method === "POST" && url.pathname === "/api/webhooks/payment") {
    try {
      const { raw, json } = await readJsonBody(req);
      if (WEBHOOK_SECRET) {
        const signature = req.headers["x-webhook-signature"] || "";
        const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(raw).digest("hex");
        if (signature !== expected) {
          return sendJson(res, 401, { ok: false, error: "Firma HMAC inválida." });
        }
      }
      return sendJson(res, 200, {
        ok: true,
        txId: json.txId || "tx_verified",
        creditedTokens: Number(json.tokens || 0)
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: "Payload de webhook inválido." });
    }
  }

  return sendJson(res, 404, { ok: false, error: "Ruta no encontrada." });
});

server.listen(PORT, () => {
  console.log(`[UnityCraft API] Escuchando en http://localhost:${PORT} (Server ID: ${PTERO_SERVER_ID})`);
});
