/**
 * Venice Nails & Spa (Lake Nona) — Live Social Media & In-Memory Stream Proxy
 * ============================================================================
 * 1. GET /api/latest-media
 *    - Linked to https://www.facebook.com/lakenonalanding
 *    - Returns the latest 3 media posts.
 *    - Enforces the #nailphoto hashtag rule: any NEW post uploaded to the
 *      account is only displayed if its caption includes #nailphoto
 *      (/#nailphoto\b/i), except for the 3 initial seeded posts configured now.
 *    - Strips any occurrence of the word "Facebook" from all returned fields.
 * 2. GET /api/media-proxy?id=<fbid>
 *    - Streams the live media directly from the remote CDN in memory without
 *      ever downloading or saving social media images to disk.
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

let chromium = null;
for (const candidate of [
  "playwright",
  "/opt/wishshipped-auth/node_modules/playwright",
  "/root/node_modules/playwright",
  "/Users/umarelhashmi/.npm/_npx/e41f203b7505f1fb/node_modules/playwright"
]) {
  try {
    chromium = require(candidate).chromium;
    if (chromium) break;
  } catch (e) {}
}

const PORT = Number(process.env.PORT || 4051);
const ROOT_DIR = path.resolve(__dirname, "..");
const SOCIAL_PAGE_URL = "https://www.facebook.com/lakenonalanding";
const REQUIRED_HASHTAG_REGEX = /#nailphoto\b/i;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function stripPlatformName(str) {
  return String(str || "")
    .replace(/facebook/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Initial 3 live media posts from https://www.facebook.com/lakenonalanding
// (Exempt from #nailphoto requirement per "except for the latest few we will do now")
const INITIAL_SEEDED_MEDIA = [
  {
    id: "1502489521688868",
    isSeededNow: true,
    postUrl:
      "https://www.facebook.com/lakenonalanding/posts/pfbid02jeV7ui17vxmopsL9fZ16EtyfXTDd4XkJ4fZJTTEC9UJNDKbUn2L7C1NjBiBtJsSkl",
    photoUrl: "https://www.facebook.com/photo/?fbid=1502489521688868&set=pcb.1502490058355481",
    cdnUrl:
      "https://scontent-mia5-1.xx.fbcdn.net/v/t39.30808-6/841084969_1502490248355462_7429757075933844450_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=p960x960&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=7WsrRfUJr6AQ7kNvwEI5HAD&_nc_oc=AdqvsRc5rp-UqICfzOJXoNjUqi_HllhUhuTOp6YGtdRuJPRihYi5khagyaRYkVHyWyoWeTqLz35XSa_tq7Zkey3z&_nc_zt=23&_nc_ht=scontent-mia5-1.xx&_nc_gid=6hVnl51GA18GLkB4ayhW5g&_nc_ss=7b289&oh=00_AQOgRwVD7HhXkFuaL8mZ7QBHialNUZ4hQCDiVVVc01Zg_g&oe=6AE5E137",
    date: "October 8",
    title: "Fall Nail Colors & Custom Designs",
    caption:
      "Hello Venice nails supporters, We have some new Fall Nails Colors and we are ready for Halloween designs. Bring in your Nails designs and we will have it done for you."
  },
  {
    id: "1372254201379068",
    isSeededNow: true,
    postUrl:
      "https://www.facebook.com/lakenonalanding/posts/pfbid0BegMNzh3aTTRngVQCRMWddD3DzNHkXohCyr4hoF2GqQ9mWHaSQP4W3NDk5vkrBtwl",
    photoUrl: "https://www.facebook.com/photo/?fbid=1372254201379068&set=pcb.1372254504712371",
    cdnUrl:
      "https://scontent-mia3-2.xx.fbcdn.net/v/t39.30808-6/688822516_1372254654712356_3675904563570993181_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=p960x960&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=7hGsRosChq8Q7kNvwGXLoBO&_nc_oc=Adp00Hl3SBMCE67TVlAEe0dxDxkxqjAegULrtwacCFtuVcf7s6LcN5W0wmDR6177YX0JBaCZ6oZY7ffvpSja0Uzp&_nc_zt=23&_nc_ht=scontent-mia3-2.xx&_nc_gid=g4LssabgD-QzWFrZmzpU-A&_nc_ss=7b289&oh=00_AQM4Dx6qv6wtTW9jvHFrOVUMhOMWozvRMlHki4V4Dy7xtA&oe=6AE5F7B5",
    date: "May 3",
    title: "Go Fresh Cucumber, Orange & Golden Pedicure",
    caption:
      "Exquisite new pedicures featuring Go Fresh Cucumber, Go Fresh Orange, and Golden Pedicure at Venice Nails and Spa."
  },
  {
    id: "1356787419592413",
    isSeededNow: true,
    postUrl:
      "https://www.facebook.com/lakenonalanding/posts/pfbid029yUqnASN4GybputCJLHfBmHeUKWWo7gohEQXvRSbPhDzENrfpufFkGbSPb7TpYWal",
    photoUrl: "https://www.facebook.com/photo/?fbid=1356787419592413&set=pcb.1356787629592392",
    cdnUrl:
      "https://scontent-mia5-1.xx.fbcdn.net/v/t39.30808-6/671699732_1356787696259052_6319282894495076899_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=p960x960&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=b4g-o_C99SkQ7kNvwH86acX&_nc_oc=Adrlp04y7gjr4yOUCpflVyl196OAxU3FboJYhTSZsGM7YNTV-swYPba1ySm4O-3Z-rhU0BsHdkttdTnvUzQVy2eI&_nc_zt=23&_nc_ht=scontent-mia5-1.xx&_nc_gid=DNzCvIFMJIEiw3BYaxr1BQ&_nc_ss=7b289&oh=00_AQOB8EheTvS8sq64bhdsMZw__pKuqhlYjghMjXLLv8ohZA&oe=6AE5D2B8",
    date: "April 13",
    title: "New Manicure Stations & Color Powder Wall",
    caption:
      "We are delighted to announce the successful replacement of our New Nails station. The new setup looks impressive, maintains high cleanliness standards, and offers more open space."
  }
];

const SEEDED_IDS = new Set(INITIAL_SEEDED_MEDIA.map((item) => item.id));
const SEEDED_POST_URLS = new Set(INITIAL_SEEDED_MEDIA.map((item) => item.postUrl));

let activeFeedItems = [...INITIAL_SEEDED_MEDIA];
const liveMediaCatalog = new Map();
for (const item of INITIAL_SEEDED_MEDIA) {
  liveMediaCatalog.set(item.id, item);
}

let lastSyncTime = Date.now();
let syncInFlight = false;

function shouldDisplayPost(post) {
  if (!post) return false;
  if (post.isSeededNow || SEEDED_IDS.has(post.id) || SEEDED_POST_URLS.has(post.postUrl)) {
    return true;
  }
  return REQUIRED_HASHTAG_REGEX.test(String(post.caption || ""));
}

async function syncLiveAccountFeed() {
  if (syncInFlight || !chromium) return;
  syncInFlight = true;
  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      viewport: { width: 1280, height: 1200 }
    });
    const page = await context.newPage();
    await page.goto(SOCIAL_PAGE_URL, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(3000);

    const closeBtn = page.locator('[aria-label="Close"], [role="button"][aria-label="Close"]').first();
    if (await closeBtn.count()) {
      await closeBtn.click().catch(() => {});
    }

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 900));
      await page.waitForTimeout(1000);
    }

    const rawPosts = await page.evaluate(() => {
      const results = [];
      const articles = Array.from(document.querySelectorAll('[role="article"]'));
      for (const art of articles) {
        const links = Array.from(art.querySelectorAll("a[href]")).map((a) => a.href);
        const postUrl =
          links.find((h) => h.includes("/posts/pfbid") || h.includes("/photo/?fbid=") || h.includes("/reel/")) || "";
        const photoLink = links.find((h) => h.includes("fbid=")) || postUrl;
        const fbidMatch = photoLink.match(/fbid=(\d+)/) || postUrl.match(/pfbid([A-Za-z0-9]+)/);
        const id = fbidMatch ? fbidMatch[1] : "";
        const imgs = Array.from(art.querySelectorAll("img"))
          .map((img) => img.src)
          .filter((src) => src.includes("scontent") && !src.includes("emoji"));
        if (!id || !postUrl || !imgs.length) continue;

        const textLines = (art.innerText || "")
          .split("\n")
          .map((l) => l.trim())
          .filter(
            (l) =>
              l &&
              !/^Venice Nails/i.test(l) &&
              !l.includes("All reactions") &&
              l !== "Like" &&
              l !== "Comment" &&
              l !== "Share"
          );

        results.push({
          id,
          postUrl: postUrl.split("?")[0],
          cdnUrl: imgs[0],
          date: textLines[0] || "Latest",
          caption: textLines.slice(1).join(" ").slice(0, 280)
        });
      }
      return results;
    });

    if (Array.isArray(rawPosts) && rawPosts.length > 0) {
      // Refresh CDN URLs for seeded items if matched, and prepend any NEW post that has #nailphoto
      const newHashtagPosts = [];
      for (const p of rawPosts) {
        if (SEEDED_IDS.has(p.id) || SEEDED_POST_URLS.has(p.postUrl)) {
          const existing = INITIAL_SEEDED_MEDIA.find((x) => x.id === p.id || x.postUrl === p.postUrl);
          if (existing && p.cdnUrl) {
            existing.cdnUrl = p.cdnUrl;
            liveMediaCatalog.set(existing.id, existing);
          }
        } else if (REQUIRED_HASHTAG_REGEX.test(p.caption || "")) {
          const item = {
            id: p.id,
            isSeededNow: false,
            hasNailPhotoHashtag: true,
            postUrl: p.postUrl,
            cdnUrl: p.cdnUrl,
            date: stripPlatformName(p.date || "New"),
            title: "Latest #nailphoto Feature",
            caption: stripPlatformName(p.caption)
          };
          newHashtagPosts.push(item);
          liveMediaCatalog.set(item.id, item);
        }
      }

      const combined = [...newHashtagPosts, ...INITIAL_SEEDED_MEDIA].filter(shouldDisplayPost);
      activeFeedItems = combined.slice(0, 3);
      lastSyncTime = Date.now();
    }
  } catch (err) {
    console.warn("[VeniceLive] Sync warning:", err.message);
  } finally {
    syncInFlight = false;
    if (browser) await browser.close().catch(() => {});
  }
}

function handleLatestMedia(req, res) {
  if (Date.now() - lastSyncTime > 15 * 60 * 1000 && !syncInFlight) {
    syncLiveAccountFeed().catch(() => {});
  }

  const eligible = activeFeedItems.filter(shouldDisplayPost).slice(0, 3);
  const items = eligible.map((item) => ({
    id: item.id,
    postUrl: item.postUrl,
    mediaUrl: `/api/media-proxy?id=${encodeURIComponent(item.id)}`,
    cdnUrl: item.cdnUrl,
    date: stripPlatformName(item.date),
    title: stripPlatformName(item.title),
    caption: stripPlatformName(item.caption),
    isSeededNow: Boolean(item.isSeededNow),
    hasNailPhotoHashtag: REQUIRED_HASHTAG_REGEX.test(item.caption || "")
  }));

  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=120",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(
    JSON.stringify({
      ok: true,
      hashtagFilter: "#nailphoto",
      viewMoreUrl: SOCIAL_PAGE_URL,
      updatedAt: new Date(lastSyncTime).toISOString(),
      items
    })
  );
}

function handleMediaProxy(req, res, parsedUrl) {
  const id = String(parsedUrl.searchParams.get("id") || "").trim();
  const entry = liveMediaCatalog.get(id) || activeFeedItems.find((x) => x.id === id);
  if (!entry || !entry.cdnUrl) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("Media ID not found");
  }

  const u = new URL(entry.cdnUrl);
  const proxyReq = https.request(
    {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.facebook.com/"
      },
      timeout: 12000
    },
    (proxyRes) => {
      if (proxyRes.statusCode !== 200) {
        res.writeHead(302, { Location: entry.cdnUrl });
        proxyRes.resume();
        return res.end();
      }
      res.writeHead(200, {
        "Content-Type": proxyRes.headers["content-type"] || "image/jpeg",
        "Cache-Control": "public, max-age=900",
        "Access-Control-Allow-Origin": "*",
        "Cross-Origin-Resource-Policy": "cross-origin"
      });
      proxyRes.pipe(res);
    }
  );
  proxyReq.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(302, { Location: entry.cdnUrl });
      res.end();
    }
  });
  proxyReq.end();
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const LACQUER_ORIGIN = "https://lacquer.beauty";

const VENICE_LACQUER_BRIDGE_SCRIPT = `
<script id="venice-lacquer-preselect">
(function(){
  try {
    var SERVICE_MAP = {
      "1a7bda9b-3462-4f6b-b8eb-ae9edae34f27": "Essential Manicure",
      "7a7026f9-9067-4260-b6db-cf5a479e5160": "Essential Pedicure",
      "7922e7a5-f88f-4f43-87df-0d1279ed1168": "Kid Manicure",
      "6bac6811-dcc8-4dc0-8d80-59c72f61def4": "Kid Pedicure",
      "bef1cdbd-64c2-43b8-a986-8d3f18888763": "Gel Polish Manicure",
      "19f3512a-6f3b-4ba8-9460-068c7a34bf3c": "Gel Polish Pedicure",
      "25f87eee-bfc0-4911-acfc-d16223ef8112": "Gel Color (no service)",
      "5d960443-eb94-45d1-b8ee-339e5af47ad3": "Power Polish Manicure",
      "9c357e1c-93d4-44e4-90e7-8953b1346153": "Power Polish Pedicure",
      "372af7c4-d2cb-4fbc-b082-dd25bcfcf40e": "Acrylic Full Set",
      "097352f7-986f-4ba7-a908-64a2f1bed363": "Acrylic Fill",
      "205d04b3-b4a5-479b-9016-99d5f54028cc": "Dipping Powder",
      "21f23cd4-3a8c-4148-ba6b-4b1946075e21": "Gel-X Extensions",
      "7880831d-9d86-4503-8674-09da0526843d": "Gel Polish Removal",
      "08491bbe-adbc-41d7-85fa-cb031c3800af": "Enhancement Removal",
      "f72bc66c-0f44-4e0c-ae5f-1db82724e679": "Eyebrow Wax",
      "540d5179-a728-4e3b-9efc-93bee24d18dc": "Upper Lip Wax",
      "fa9cb02f-15bd-4c93-8cef-87bb2590b315": "Underarm Wax",
      "462fffc3-cba0-4bca-8493-c268859188c0": "French Tip",
      "808d470d-a276-48e7-8993-ff8a7eb31bfc": "Paraffin Treatment",
      "a2233dd6-ee94-4d21-89fe-3adee3ef8273": "Callus Treatment",
      "c7ed86bd-ddaf-49e0-8494-769a51a5365d": "Polish Change",
      "4a4e10e4-33d5-42dd-a10b-4a8c78606de0": "Nail Fix (per nail)",
      "3a9dc2af-acfb-444b-b134-e4bdab20ffc0": "Nail Trim & File"
    };

    var params = new URLSearchParams(window.location.search);
    var raw = (params.get("services") || "").trim();
    if (!raw) return;

    var requestedTokens = raw.split(",").map(function(s){ return s.trim(); }).filter(Boolean);
    var targetNames = requestedTokens.map(function(tok){
      return SERVICE_MAP[tok] || tok;
    });
    if (!targetNames.length) return;

    var applied = false;
    var attempts = 0;

    function injectPreselectedBanner(matchedNames) {
      if (document.getElementById("venice-preselect-banner")) return;
      var mainEl = document.querySelector("main");
      if (!mainEl) return;

      var banner = document.createElement("div");
      banner.id = "venice-preselect-banner";
      banner.className = "mb-6 rounded-xl border border-rs-accent bg-rs-accent-soft p-4 text-sm";
      banner.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;";

      var info = document.createElement("div");
      info.innerHTML =
        '<div style="font-weight:600;letter-spacing:0.02em;">✓ ' +
        matchedNames.length +
        " " +
        (matchedNames.length === 1 ? "service" : "services") +
        ' already selected from Venice Nails &amp; Spa</div>' +
        '<div style="margin-top:3px;opacity:0.82;">' +
        matchedNames.join(" · ") +
        "</div>";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.style.cssText =
        "padding:9px 18px;border-radius:9999px;background:#1c1917;color:#f5f0e6;font-weight:500;font-size:13px;line-height:1.2;border:none;cursor:pointer;white-space:nowrap;";
      btn.textContent = "Continue to Date & Time →";
      btn.addEventListener("click", function(){
        var continueBtns = Array.from(document.querySelectorAll("button")).filter(function(b){
          return b.textContent && b.textContent.trim() === "Continue" && !b.disabled;
        });
        if (continueBtns.length > 0) {
          continueBtns[0].click();
        }
      });

      banner.appendChild(info);
      banner.appendChild(btn);
      mainEl.insertBefore(banner, mainEl.firstChild);

      var obs = new MutationObserver(function(){
        var h2 = mainEl.querySelector("h2");
        var isServicesStep = h2 && h2.textContent.trim() === "Choose your services";
        banner.style.display = isServicesStep ? "flex" : "none";
      });
      obs.observe(mainEl, { childList: true, subtree: true, characterData: true });
    }

    function trySelectServices() {
      attempts++;
      var checkboxes = Array.from(document.querySelectorAll('button[role="checkbox"]'));
      if (!checkboxes.length) {
        if (attempts < 80) setTimeout(trySelectServices, 60);
        return;
      }

      var matchedNames = [];
      targetNames.forEach(function(wantName){
        var wantLower = wantName.toLowerCase();
        var matchBtn = checkboxes.find(function(btn){
          var titleSpan = btn.querySelector("span.block.font-medium");
          var txt = titleSpan ? titleSpan.textContent.trim() : "";
          return txt.toLowerCase() === wantLower;
        });
        if (matchBtn) {
          matchedNames.push(wantName);
          if (matchBtn.getAttribute("aria-checked") !== "true") {
            matchBtn.click();
          }
        }
      });

      var checkedNow = checkboxes.filter(function(b){
        return b.getAttribute("aria-checked") === "true";
      }).length;

      if (matchedNames.length > 0 && checkedNow >= matchedNames.length) {
        applied = true;
        injectPreselectedBanner(matchedNames);
        if (params.get("step") === "time") {
          setTimeout(function(){
            var continueBtns = Array.from(document.querySelectorAll("button")).filter(function(b){
              return b.textContent && b.textContent.trim() === "Continue" && !b.disabled;
            });
            if (continueBtns.length > 0) continueBtns[0].click();
          }, 80);
        }
        return;
      }

      if (!applied && attempts < 80) {
        setTimeout(trySelectServices, 80);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function(){ setTimeout(trySelectServices, 60); });
    } else {
      setTimeout(trySelectServices, 60);
    }
  } catch (e) {
    console.warn("[VeniceLacquerBridge]", e);
  }
})();
</script>
`;

function isLacquerRoute(pathname) {
  return (
    pathname === "/venice-nails-spa-orlando" ||
    pathname.startsWith("/venice-nails-spa-orlando/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/api/book" ||
    pathname === "/api/broadcast" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/icon/") ||
    pathname.startsWith("/apple-icon") ||
    pathname === "/sw.js"
  );
}

function handleLacquerProxy(req, res, parsedUrl) {
  const pathname = parsedUrl.pathname;
  const isHtmlPage =
    req.method === "GET" &&
    (pathname === "/venice-nails-spa-orlando" || pathname === "/venice-nails-spa-orlando/") &&
    !req.headers["rsc"] &&
    !req.headers["next-router-state-tree"];

  const isWizardChunk =
    req.method === "GET" &&
    pathname.startsWith("/_next/static/chunks/2942-") &&
    pathname.endsWith(".js");

  const upstreamHeaders = {
    "User-Agent": req.headers["user-agent"] || USER_AGENT,
    Accept: req.headers["accept"] || "*/*",
    "Accept-Language": req.headers["accept-language"] || "en-US,en;q=0.9",
    Host: "lacquer.beauty",
    Origin: LACQUER_ORIGIN,
    Referer: `${LACQUER_ORIGIN}/venice-nails-spa-orlando`
  };

  if (req.headers["content-type"]) {
    upstreamHeaders["Content-Type"] = req.headers["content-type"];
  }
  if (req.headers["rsc"]) {
    upstreamHeaders["RSC"] = req.headers["rsc"];
  }
  if (req.headers["next-router-state-tree"]) {
    upstreamHeaders["Next-Router-State-Tree"] = req.headers["next-router-state-tree"];
  }
  if (req.headers["next-url"]) {
    upstreamHeaders["Next-Url"] = req.headers["next-url"];
  }

  // Request uncompressed body when we need to inject our pre-selection script
  if (isHtmlPage || isWizardChunk) {
    upstreamHeaders["Accept-Encoding"] = "identity";
  } else if (req.headers["accept-encoding"]) {
    upstreamHeaders["Accept-Encoding"] = req.headers["accept-encoding"];
  }

  const upstreamReq = https.request(
    {
      hostname: "lacquer.beauty",
      path: pathname + parsedUrl.search,
      method: req.method,
      headers: upstreamHeaders,
      timeout: 20000
    },
    (upstreamRes) => {
      const respHeaders = { ...upstreamRes.headers };
      delete respHeaders["content-security-policy"];
      delete respHeaders["x-frame-options"];

      if (isHtmlPage || isWizardChunk) {
        const chunks = [];
        upstreamRes.on("data", (chunk) => chunks.push(chunk));
        upstreamRes.on("end", () => {
          let body = Buffer.concat(chunks).toString("utf-8");

          if (isHtmlPage) {
            if (body.includes("</body>")) {
              body = body.replace("</body>", `${VENICE_LACQUER_BRIDGE_SCRIPT}</body>`);
            } else {
              body += VENICE_LACQUER_BRIDGE_SCRIPT;
            }
            respHeaders["cache-control"] = "no-store, must-revalidate";
          } else if (isWizardChunk) {
            body = body.replace(
              "[b,_]=(0,i.useState)([])",
              '[b,_]=(0,i.useState)([]),__vPre=(0,i.useEffect)(()=>{try{let u=new URLSearchParams(window.location.search),raw=u.get("services")||"";if(!raw)return;let req=raw.split(",").map(s=>s.trim()).filter(Boolean),valid=req.map(q=>{let m=t.find(x=>x.id===q||x.name.toLowerCase()===q.toLowerCase());return m?m.id:null}).filter(Boolean);if(valid.length>0){_(valid);if(u.get("step")==="time")p(1)}}catch(e){}},[])'
            );
            respHeaders["cache-control"] = "no-store, must-revalidate";
          }

          const outBuf = Buffer.from(body, "utf-8");
          respHeaders["content-length"] = String(outBuf.length);
          delete respHeaders["content-encoding"];
          res.writeHead(upstreamRes.statusCode || 200, respHeaders);
          res.end(outBuf);
        });
        return;
      }

      res.writeHead(upstreamRes.statusCode || 200, respHeaders);
      upstreamRes.pipe(res);
    }
  );

  upstreamReq.on("error", (err) => {
    console.warn("[VeniceLacquerProxy] Error:", err.message);
    if (!res.headersSent) {
      res.writeHead(302, { Location: `${LACQUER_ORIGIN}${pathname}${parsedUrl.search}` });
      res.end();
    }
  });

  if (req.method !== "GET" && req.method !== "HEAD") {
    req.pipe(upstreamReq);
  } else {
    upstreamReq.end();
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  if (pathname === "/api/latest-media") {
    return handleLatestMedia(req, res);
  }
  if (pathname === "/api/media-proxy") {
    return handleMediaProxy(req, res, parsedUrl);
  }
  if (isLacquerRoute(pathname)) {
    return handleLacquerProxy(req, res, parsedUrl);
  }

  let relPath = pathname === "/" ? "/index.html" : pathname;
  relPath = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(ROOT_DIR, relPath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=300"
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[VeniceLive] Listening on http://127.0.0.1:${PORT}`);
});
