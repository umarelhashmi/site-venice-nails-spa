/* ==========================================================================
   VENICE NAILS & SPA — INTERACTIVE ATELIER ENGINE
   ========================================================================== */

(function () {
  "use strict";

  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // =========================================================================
  // 1. EXACT 24 SERVICES & EXACT PRICES FROM LACQUER.BEAUTY + NAILSITES.COM
  // =========================================================================
  const EXACT_SERVICES = [
    // 1. Essential Manicure & Pedicure
    {
      id: "1a7bda9b-3462-4f6b-b8eb-ae9edae34f27",
      category: "Essential Manicure & Pedicure",
      name: "Essential Manicure",
      altName: "Classic Manicure",
      price: 35,
      duration: 30,
      desc: "Natural nail shaping, cuticle care, and polish."
    },
    {
      id: "7a7026f9-9067-4260-b6db-cf5a479e5160",
      category: "Essential Manicure & Pedicure",
      name: "Essential Pedicure",
      altName: "Spa Pedicure",
      price: 45,
      duration: 45,
      desc: "Soak, nail shaping, cuticle care, and polish."
    },
    {
      id: "7922e7a5-f88f-4f43-87df-0d1279ed1168",
      category: "Essential Manicure & Pedicure",
      name: "Kid Manicure",
      price: 20,
      duration: 20,
      desc: ""
    },
    {
      id: "6bac6811-dcc8-4dc0-8d80-59c72f61def4",
      category: "Essential Manicure & Pedicure",
      name: "Kid Pedicure",
      price: 30,
      duration: 25,
      desc: ""
    },

    // 2. Gel Polish
    {
      id: "bef1cdbd-64c2-43b8-a986-8d3f18888763",
      category: "Gel Polish",
      name: "Gel Polish Manicure",
      price: 55,
      duration: 45,
      desc: "Long-wear gel color with extra shine."
    },
    {
      id: "19f3512a-6f3b-4ba8-9460-068c7a34bf3c",
      category: "Gel Polish",
      name: "Gel Polish Pedicure",
      price: 65,
      duration: 60,
      desc: ""
    },
    {
      id: "25f87eee-bfc0-4911-acfc-d16223ef8112",
      category: "Gel Polish",
      name: "Gel Color (no service)",
      price: 20,
      duration: 20,
      desc: ""
    },

    // 3. Power Polish
    {
      id: "5d960443-eb94-45d1-b8ee-339e5af47ad3",
      category: "Power Polish",
      name: "Power Polish Manicure",
      price: 50,
      duration: 50,
      desc: ""
    },
    {
      id: "9c357e1c-93d4-44e4-90e7-8953b1346153",
      category: "Power Polish",
      name: "Power Polish Pedicure",
      price: 70,
      duration: 65,
      desc: ""
    },

    // 4. Nail Enhancements
    {
      id: "372af7c4-d2cb-4fbc-b082-dd25bcfcf40e",
      category: "Nail Enhancements",
      name: "Acrylic Full Set",
      price: 85,
      duration: 75,
      desc: "Full acrylic set for added length and shape."
    },
    {
      id: "097352f7-986f-4ba7-a908-64a2f1bed363",
      category: "Nail Enhancements",
      name: "Acrylic Fill",
      price: 75,
      duration: 55,
      desc: ""
    },
    {
      id: "205d04b3-b4a5-479b-9016-99d5f54028cc",
      category: "Nail Enhancements",
      name: "Dipping Powder",
      price: 65,
      duration: 60,
      desc: ""
    },
    {
      id: "21f23cd4-3a8c-4148-ba6b-4b1946075e21",
      category: "Nail Enhancements",
      name: "Gel-X Extensions",
      price: 85,
      duration: 90,
      desc: ""
    },

    // 5. Removal
    {
      id: "7880831d-9d86-4503-8674-09da0526843d",
      category: "Removal",
      name: "Gel Polish Removal",
      price: 20,
      duration: 15,
      desc: ""
    },
    {
      id: "08491bbe-adbc-41d7-85fa-cb031c3800af",
      category: "Removal",
      name: "Enhancement Removal",
      price: 30,
      duration: 25,
      desc: ""
    },

    // 6. Waxing
    {
      id: "f72bc66c-0f44-4e0c-ae5f-1db82724e679",
      category: "Waxing",
      name: "Eyebrow Wax",
      price: 25,
      duration: 15,
      desc: ""
    },
    {
      id: "540d5179-a728-4e3b-9efc-93bee24d18dc",
      category: "Waxing",
      name: "Upper Lip Wax",
      price: 15,
      duration: 10,
      desc: ""
    },
    {
      id: "fa9cb02f-15bd-4c93-8cef-87bb2590b315",
      category: "Waxing",
      name: "Underarm Wax",
      price: 30,
      duration: 20,
      desc: ""
    },

    // 7. Add-Ons
    {
      id: "462fffc3-cba0-4bca-8493-c268859188c0",
      category: "Add-Ons",
      name: "French Tip",
      price: 20,
      duration: 10,
      desc: ""
    },
    {
      id: "808d470d-a276-48e7-8993-ff8a7eb31bfc",
      category: "Add-Ons",
      name: "Paraffin Treatment",
      price: 15,
      duration: 10,
      desc: ""
    },
    {
      id: "a2233dd6-ee94-4d21-89fe-3adee3ef8273",
      category: "Add-Ons",
      name: "Callus Treatment",
      price: 15,
      duration: 10,
      desc: ""
    },

    // 8. Other
    {
      id: "c7ed86bd-ddaf-49e0-8494-769a51a5365d",
      category: "Other",
      name: "Polish Change",
      price: 20,
      duration: 15,
      desc: ""
    },
    {
      id: "4a4e10e4-33d5-42dd-a10b-4a8c78606de0",
      category: "Other",
      name: "Nail Fix (per nail)",
      price: 5,
      duration: 5,
      desc: ""
    },
    {
      id: "3a9dc2af-acfb-444b-b134-e4bdab20ffc0",
      category: "Other",
      name: "Nail Trim & File",
      price: 20,
      duration: 10,
      desc: ""
    }
  ];

  let activeCategory = "all";
  const selectedServiceIds = new Set();

  const ledgerGrid = document.getElementById("serviceLedgerGrid");
  const estimatorEmpty = document.getElementById("estimatorEmpty");
  const estimatorList = document.getElementById("estimatorList");
  const estimatorTotals = document.getElementById("estimatorTotals");
  const estimatorDuration = document.getElementById("estimatorDuration");
  const estimatorPrice = document.getElementById("estimatorPrice");
  const clearEstimatorBtn = document.getElementById("clearEstimatorBtn");
  const bookSelectedLacquerBtn = document.getElementById("bookSelectedLacquerBtn");

  function syncLacquerBookingLinks(items) {
    const selectedIds = items.map((s) => s.id);
    const targetHref =
      selectedIds.length > 0
        ? `/venice-nails-spa-orlando?services=${encodeURIComponent(selectedIds.join(","))}`
        : "/venice-nails-spa-orlando";

    if (bookSelectedLacquerBtn) {
      bookSelectedLacquerBtn.setAttribute("href", targetHref);
      bookSelectedLacquerBtn.textContent =
        selectedIds.length > 0
          ? `Book Selected on Lacquer (${selectedIds.length}) ->`
          : "Book Selected on Lacquer ->";
    }

    document
      .querySelectorAll('a[href*="lacquer.beauty/venice-nails-spa-orlando"], a[href^="/venice-nails-spa-orlando"]')
      .forEach((a) => {
        if (a === bookSelectedLacquerBtn) return;
        a.setAttribute(
          "href",
          selectedIds.length > 0 ? targetHref : "https://lacquer.beauty/venice-nails-spa-orlando"
        );
      });
  }

  function renderServices() {
    if (!ledgerGrid) return;
    const filtered =
      activeCategory === "all"
        ? EXACT_SERVICES
        : EXACT_SERVICES.filter((s) => s.category === activeCategory);

    ledgerGrid.innerHTML = filtered
      .map((srv) => {
        const isSelected = selectedServiceIds.has(srv.id);
        return `
          <button
            type="button"
            class="service-tile ${isSelected ? "selected" : ""}"
            data-srv-id="${esc(srv.id)}"
            aria-pressed="${isSelected ? "true" : "false"}"
          >
            <div class="srv-info">
              <span class="srv-cat-tag">${esc(srv.category)}</span>
              <span class="srv-name">${esc(srv.name)}${srv.altName ? ` <small style="opacity:0.7">(${esc(srv.altName)})</small>` : ""}</span>
              ${srv.desc ? `<span class="srv-desc">${esc(srv.desc)}</span>` : ""}
            </div>
            <div class="srv-right">
              <span class="srv-price">$${srv.price}</span>
              <span class="srv-duration">${srv.duration} min</span>
            </div>
          </button>
        `;
      })
      .join("");

    ledgerGrid.querySelectorAll(".service-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-srv-id");
        if (!id) return;
        if (selectedServiceIds.has(id)) {
          selectedServiceIds.delete(id);
        } else {
          selectedServiceIds.add(id);
        }
        renderServices();
        renderEstimator();
      });
    });
  }

  function renderEstimator() {
    if (!estimatorList) return;
    const items = EXACT_SERVICES.filter((s) => selectedServiceIds.has(s.id));
    syncLacquerBookingLinks(items);
    if (items.length === 0) {
      estimatorEmpty.hidden = false;
      estimatorTotals.hidden = true;
      clearEstimatorBtn.hidden = true;
      estimatorList.innerHTML = "";
      return;
    }

    estimatorEmpty.hidden = true;
    estimatorTotals.hidden = false;
    clearEstimatorBtn.hidden = false;

    let totalMin = 0;
    let totalCost = 0;

    estimatorList.innerHTML = items
      .map((item) => {
        totalMin += item.duration;
        totalCost += item.price;
        return `
          <li class="estimator-item">
            <span>${esc(item.name)} (${item.duration}m)</span>
            <strong>$${item.price}</strong>
          </li>
        `;
      })
      .join("");

    estimatorDuration.textContent = `${totalMin} min`;
    estimatorPrice.textContent = `$${totalCost}`;
  }

  if (clearEstimatorBtn) {
    clearEstimatorBtn.addEventListener("click", () => {
      selectedServiceIds.clear();
      renderServices();
      renderEstimator();
    });
  }

  document.querySelectorAll(".orbit-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      activeCategory = pill.getAttribute("data-cat") || "all";
      document.querySelectorAll(".orbit-pill").forEach((p) => {
        const active = p === pill;
        p.classList.toggle("active", active);
        p.setAttribute("aria-selected", active ? "true" : "false");
      });
      renderServices();
    });
  });

  document.querySelectorAll("[data-jump-cat]").forEach((link) => {
    link.addEventListener("click", () => {
      const targetCat = link.getAttribute("data-jump-cat");
      if (!targetCat) return;
      const pill = document.querySelector(`.orbit-pill[data-cat="${targetCat}"]`);
      if (pill) pill.click();
    });
  });

  renderServices();
  renderEstimator();

  // =========================================================================
  // 2. LOOKBOOK FAN TAB SWITCHER (NAIL WORK vs. SALON & POLISH CENTER)
  // =========================================================================
  const nailTipDeck = document.getElementById("nailTipDeck");
  const salonVitrineDeck = document.getElementById("salonVitrineDeck");

  document.querySelectorAll(".fan-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const mode = tab.getAttribute("data-fan-mode");
      document.querySelectorAll(".fan-tab").forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle("active", isCurrent);
        t.setAttribute("aria-selected", isCurrent ? "true" : "false");
      });
      if (mode === "salon") {
        nailTipDeck.classList.add("hidden");
        salonVitrineDeck.classList.remove("hidden");
      } else {
        salonVitrineDeck.classList.add("hidden");
        nailTipDeck.classList.remove("hidden");
      }
    });
  });

  // =========================================================================
  // 3. NATIVE BUILT-IN VIEWER: "LATEST from Venice Nails:"
  //    - Linked to https://www.facebook.com/lakenonalanding
  //    - New posts require #nailphoto hashtag (/#nailphoto\b/i) to appear,
  //      except for the 3 initial seeded posts configured now.
  //    - Zero downloaded Facebook files on disk (streams via /api/media-proxy
  //      and live remote scontent CDN URL).
  //    - Strictly ZERO occurrences of the word "Facebook" in this section!
  // =========================================================================
  const REQUIRED_HASHTAG_REGEX = /#nailphoto\b/i;

  function stripForbiddenPlatformWord(str) {
    return String(str || "")
      .replace(/facebook/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const INITIAL_LATEST_POSTS = [
    {
      id: "1502489521688868",
      isSeededNow: true,
      postUrl:
        "https://www.facebook.com/lakenonalanding/posts/pfbid02jeV7ui17vxmopsL9fZ16EtyfXTDd4XkJ4fZJTTEC9UJNDKbUn2L7C1NjBiBtJsSkl",
      mediaUrl: "/api/media-proxy?id=1502489521688868",
      cdnUrl:
        "https://scontent-mia5-1.xx.fbcdn.net/v/t39.30808-6/841084969_1502490248355462_7429757075933844450_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=p960x960&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=7WsrRfUJr6AQ7kNvwEI5HAD&_nc_oc=AdqvsRc5rp-UqICfzOJXoNjUqi_HllhUhuTOp6YGtdRuJPRihYi5khagyaRYkVHyWyoWeTqLz35XSa_tq7Zkey3z&_nc_zt=23&_nc_ht=scontent-mia5-1.xx&_nc_gid=6hVnl51GA18GLkB4ayhW5g&_nc_ss=7b289&oh=00_AQOgRwVD7HhXkFuaL8mZ7QBHialNUZ4hQCDiVVVc01Zg_g&oe=6AE5E137",
      date: "October 8",
      title: "New Fall Nail Colors & Halloween Designs",
      caption:
        "Hello Venice nails supporters, We have some new Fall Nails Colors and we are ready for Halloween designs. Bring in your Nails designs and we will have it done for you."
    },
    {
      id: "1372254201379068",
      isSeededNow: true,
      postUrl:
        "https://www.facebook.com/lakenonalanding/posts/pfbid0BegMNzh3aTTRngVQCRMWddD3DzNHkXohCyr4hoF2GqQ9mWHaSQP4W3NDk5vkrBtwl",
      mediaUrl: "/api/media-proxy?id=1372254201379068",
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
      mediaUrl: "/api/media-proxy?id=1356787419592413",
      cdnUrl:
        "https://scontent-mia5-1.xx.fbcdn.net/v/t39.30808-6/671699732_1356787696259052_6319282894495076899_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=p960x960&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=b4g-o_C99SkQ7kNvwH86acX&_nc_oc=Adrlp04y7gjr4yOUCpflVyl196OAxU3FboJYhTSZsGM7YNTV-swYPba1ySm4O-3Z-rhU0BsHdkttdTnvUzQVy2eI&_nc_zt=23&_nc_ht=scontent-mia5-1.xx&_nc_gid=DNzCvIFMJIEiw3BYaxr1BQ&_nc_ss=7b289&oh=00_AQOB8EheTvS8sq64bhdsMZw__pKuqhlYjghMjXLLv8ohZA&oe=6AE5D2B8",
      date: "April 13",
      title: "New Manicure Stations & Color Powder Wall",
      caption:
        "We are delighted to announce the successful replacement of our New Nails station yesterday. The new setup looks impressive, maintains high cleanliness standards, and offers more open space."
    }
  ];

  const SEEDED_POST_IDS = new Set(INITIAL_LATEST_POSTS.map((p) => p.id));

  function filterByHashtagRule(posts) {
    return (posts || []).filter((item) => {
      if (!item) return false;
      if (item.isSeededNow || SEEDED_POST_IDS.has(item.id)) return true;
      return REQUIRED_HASHTAG_REGEX.test(String(item.caption || ""));
    });
  }

  function renderLatestThreeMedia(items) {
    const grid = document.getElementById("latestMediaGrid");
    if (!grid) return;

    const validItems = filterByHashtagRule(items).slice(0, 3);
    grid.innerHTML = validItems
      .map((item, idx) => {
        const cleanTitle = stripForbiddenPlatformWord(item.title || `Studio Update ${idx + 1}`);
        const cleanCaption = stripForbiddenPlatformWord(item.caption);
        const cleanDate = stripForbiddenPlatformWord(item.date || "Latest");
        const postUrl = item.postUrl || "https://www.facebook.com/lakenonalanding";
        const primarySrc = item.mediaUrl || `/api/media-proxy?id=${encodeURIComponent(item.id)}`;
        const fallbackCdn = item.cdnUrl || "assets/nailsites/hero-01.webp";

        return `
          <a href="${esc(postUrl)}" target="_blank" rel="noopener" class="latest-card">
            <div class="latest-card-media">
              <img
                src="${esc(primarySrc)}"
                alt="${esc(cleanTitle)}"
                loading="lazy"
                width="420"
                height="240"
                onerror="this.onerror=null;this.src='${esc(fallbackCdn)}';"
              />
              <span class="latest-date-pill">${esc(cleanDate)}</span>
              <span class="latest-open-pill">Open Post -&gt;</span>
            </div>
            <div class="latest-card-body">
              <h3>${esc(cleanTitle)}</h3>
              <p>${esc(cleanCaption)}</p>
            </div>
          </a>
        `;
      })
      .join("");
  }

  async function initLatestVeniceViewer() {
    renderLatestThreeMedia(INITIAL_LATEST_POSTS);
    try {
      const resp = await fetch("/api/latest-media");
      if (resp.ok) {
        const data = await resp.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const filtered = filterByHashtagRule(data.items);
          if (filtered.length >= 3) {
            renderLatestThreeMedia(filtered.slice(0, 3));
          }
        }
      }
    } catch (e) {
      // Static fallback already rendered from live CDN URLs
    }
  }

  initLatestVeniceViewer();

  // =========================================================================
  // 4. CUSTOMER HANDS PHOTO RIBBON & VERIFIED GOOGLE REVIEWS
  // =========================================================================
  const CUSTOMER_PHOTOS = [
    {
      src: "assets/customers/customer-04-siara-ursino-5star.jpg",
      label: "Siara U. · Tech: Angie",
      caption: "Customer Review Photo by Siara Ursino (5★) — Almond French & Holiday Nail Art by Angie"
    },
    {
      src: "assets/customers/customer-05-siara-ursino-5star.jpg",
      label: "Siara U. · Minimalist Heart",
      caption: "Customer Review Photo by Siara Ursino (5★) — Sheer Pink Almond Swirl & Heart Art by Angie"
    },
    {
      src: "assets/customers/customer-18-delinna-crupi-5star.jpg",
      label: "Delinna C. · Tech: Ms. Thao",
      caption: "Customer Review Photo by Delinna Crupi (5★) — Pink Coffin Set with 3D Floral Art by Ms. Thao"
    },
    {
      src: "assets/customers/customer-28-joann-venant-5star.jpg",
      label: "Joann V. · Tech: Yan",
      caption: "Customer Review Photo by Joann Venant (5★) — Black & White Swirl French Tip Almond Set by Yan"
    },
    {
      src: "assets/customers/customer-30-amy-maitner-5star.jpg",
      label: "Amy M. · Hand-Painted Florals",
      caption: "Customer Review Photo by Amy Maitner (5★) — Milky White Manicure with Hand-Painted Florals"
    },
    {
      src: "assets/customers/customer-01-adreanna-breland-5star.jpg",
      label: "Adreanna B. · Tech: Jenny",
      caption: "Customer Review Photo by Adreanna Breland (5★) — Luxury Steam Pedicure with Jenny"
    },
    {
      src: "assets/customers/customer-03-abril-gauthier-5star.jpg",
      label: "Abril G. · Tech: Ms. Thao",
      caption: "Customer Review Photo by Abril Gauthier (5★) — Pastel Butter Yellow Manicure by Ms. Thao"
    },
    {
      src: "assets/customers/customer-26-bethany-dawn-5star.jpg",
      label: "Bethany D. · Tech: Kim",
      caption: "Customer Review Photo by Bethany Dawn (5★) — Charcoal Shimmer & Rose-Gold Glitter Set by Kim"
    },
    {
      src: "assets/customers/customer-07-siara-ursino-5star.jpg",
      label: "Siara U. · Baby Pink Gloss",
      caption: "Customer Review Photo by Siara Ursino (5★) — Classic Glossy Baby-Pink Manicure by Angie"
    },
    {
      src: "assets/customers/customer-19-tiana-lewis-5star.jpg",
      label: "Tiana L. · Emerald Shimmer",
      caption: "Customer Review Photo by Tiana Lewis (5★) — Shimmering Emerald Green Oval Manicure"
    },
    {
      src: "assets/customers/customer-10-siara-ursino-5star.jpg",
      label: "Siara U. · Custom Star Art",
      caption: "Customer Review Photo by Siara Ursino (5★) — Custom Hand-Painted Star & Stripe Nail Art by Angie"
    },
    {
      src: "assets/customers/customer-14-aurimar-a-4star.jpg",
      label: "Aurimar A. · Coral Gel Set",
      caption: "Customer Review Photo by Aurimar A. — Vibrant Coral Gel Manicure & Pedicure"
    }
  ];

  const VERIFIED_REVIEWS = [
    {
      author: "Adreanna Breland",
      meta: "Local Guide · Pedicure",
      techGroup: "Jenny",
      techLabel: "Tech: Jenny",
      photo: "assets/customers/customer-01-adreanna-breland-5star.jpg",
      text: "Jenny was seriously amazing. This was honestly the best pedicure I’ve ever had. She was thorough from beginning to end, and the massage pressure was perfect—nice and firm the whole time, exactly how I like it. My nails came out absolutely perfect, and the salon was super clean and smelled so fresh."
    },
    {
      author: "Abril Gauthier",
      meta: "Verified Google Review · Relaxing & Cozy",
      techGroup: "Ms Thao",
      techLabel: "Tech: Ms. Thao",
      photo: "assets/customers/customer-03-abril-gauthier-5star.jpg",
      text: "Ms Thao she is THE BEST, always so careful and making sure every detail is perfect! The environment is clean and relaxing! 10/10♥️"
    },
    {
      author: "Kylie Bennett",
      meta: "Verified Google Review · Nail Art & Dip Powder",
      techGroup: "May & Kelly",
      techLabel: "Techs: May & Kelly",
      photo: "",
      text: "I have been coming here since I moved to Orlando. My first place I went for my nails and my last. Ive been getting my nails done with May for 4 years. She is amazing and pays attention to so much detail. I also get my nails done with Kelly when May is unavailable and she is just as great!"
    },
    {
      author: "Siara Ursino",
      meta: "Verified Google Review · 13 Customer Photos",
      techGroup: "Angie",
      techLabel: "Tech: Angie & Front Desk Young",
      photo: "assets/customers/customer-04-siara-ursino-5star.jpg",
      text: "For the last year I have been seeing Angie and I always come in with nail inspiration pictures and she nails it every time, her attention to detail is amazing! Also, my Mom has began seeing Angie and loves her nails so much! All of the nail techs, including Young at the front desk, are always very friendly."
    },
    {
      author: "Nancy Ortiz",
      meta: "Verified Google Review · Acrylics, Dip & Pedicure",
      techGroup: "Kim",
      techLabel: "Tech: Kim",
      photo: "assets/customers/customer-26-bethany-dawn-5star.jpg",
      text: "I've been seeing Kim for over 5 years and I am 100% pleased with the service she gives me every time I see her. Kim's work area is always very clean and all her supplies are always sterilized. I leave the nail spa feeling happy with my Beautiful, Elegant Nails!"
    },
    {
      author: "Delinna Crupi",
      meta: "Verified Google Review · Pristine Maintenance",
      techGroup: "Ms Thao",
      techLabel: "Tech: Ms. Thao",
      photo: "assets/customers/customer-18-delinna-crupi-5star.jpg",
      text: "Thao is absolutely AAAMMAAZZIINNGGG!!! I highly recommend anyone looking for a nail tech who takes her time and perfects every nail!"
    },
    {
      author: "Cristina Cevallos",
      meta: "Verified Google Review · Dip Powder & Pedicure",
      techGroup: "Luyen & Hana",
      techLabel: "Tech: Luyen",
      photo: "",
      text: "LUYEN is absolutely amazing! I bring in my nail designs that I like and she creates them perfectly every single time!"
    },
    {
      author: "Rafael Jovet-Ramos",
      meta: "Verified Google Review · Manicure & Pedicure",
      techGroup: "Luyen & Hana",
      techLabel: "Tech: Hana",
      photo: "",
      text: "Loved my experience at Venice Nails & Spa! The staff (Hana) was super friendly, the salon was clean and relaxing, and my nails came out perfect. Definitely coming back!"
    },
    {
      author: "Joann Venant",
      meta: "Verified Google Review · Custom Nail Art",
      techGroup: "Luyen & Hana",
      techLabel: "Tech: Yan",
      photo: "assets/customers/customer-28-joann-venant-5star.jpg",
      text: "Yan always takes great care of my nails and brings every custom design to life with precision. Consistently clean, welcoming salon in Lake Nona."
    }
  ];

  const handsRibbon = document.getElementById("customerHandsRibbon");
  if (handsRibbon) {
    handsRibbon.innerHTML = CUSTOMER_PHOTOS.map(
      (item) => `
        <button
          type="button"
          class="hand-chip"
          data-lightbox="${esc(item.src)}"
          data-caption="${esc(item.caption)}"
        >
          <img src="${esc(item.src)}" alt="${esc(item.caption)}" loading="lazy" width="180" height="148" />
          <span class="hand-chip-meta">${esc(item.label)}</span>
        </button>
      `
    ).join("");
  }

  let activeTechFilter = "all";
  const reviewsBento = document.getElementById("reviewsBento");

  function renderReviews() {
    if (!reviewsBento) return;
    const list =
      activeTechFilter === "all"
        ? VERIFIED_REVIEWS
        : VERIFIED_REVIEWS.filter((r) => r.techGroup === activeTechFilter);

    reviewsBento.innerHTML = list
      .map(
        (r) => `
          <article class="review-tile">
            <div>
              <div class="review-top">
                <div>
                  <div class="review-author">${esc(r.author)}</div>
                  <div class="review-meta">${esc(r.meta)}</div>
                </div>
                <div class="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
              </div>
              <p class="review-quote">“${esc(r.text)}”</p>
            </div>
            <div class="review-bottom">
              <span class="tech-badge">${esc(r.techLabel)}</span>
              ${
                r.photo
                  ? `<button type="button" class="review-thumb-btn" data-lightbox="${esc(r.photo)}" data-caption="Verified Google Review Photo by ${esc(r.author)} (${esc(r.techLabel)})" aria-label="View review photo by ${esc(r.author)}">
                      <img src="${esc(r.photo)}" alt="Nail photo by ${esc(r.author)}" loading="lazy" width="36" height="36" />
                    </button>`
                  : ""
              }
            </div>
          </article>
        `
      )
      .join("");

    bindLightboxTriggers(reviewsBento);
  }

  document.querySelectorAll(".tech-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      activeTechFilter = pill.getAttribute("data-tech") || "all";
      document.querySelectorAll(".tech-pill").forEach((p) => p.classList.toggle("active", p === pill));
      renderReviews();
    });
  });

  renderReviews();

  // =========================================================================
  // 5. LIVE ORLANDO HOURS HUD (America/New_York)
  // =========================================================================
  const HOURS_BY_DAY = {
    0: { open: 10 * 60, close: 17 * 60, label: "10:00 AM – 5:00 PM" }, // Sun
    1: { open: 9 * 60 + 30, close: 19 * 60 + 30, label: "9:30 AM – 7:30 PM" }, // Mon
    2: { open: 9 * 60 + 30, close: 19 * 60 + 30, label: "9:30 AM – 7:30 PM" }, // Tue
    3: { open: 9 * 60 + 30, close: 19 * 60 + 30, label: "9:30 AM – 7:30 PM" }, // Wed
    4: { open: 9 * 60 + 30, close: 19 * 60 + 30, label: "9:30 AM – 7:30 PM" }, // Thu
    5: { open: 9 * 60 + 30, close: 19 * 60 + 30, label: "9:30 AM – 7:30 PM" }, // Fri
    6: { open: 9 * 60 + 30, close: 18 * 60 + 30, label: "9:30 AM – 6:30 PM" } // Sat
  };

  function updateOrlandoLiveStatus() {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false
      }).formatToParts(now);

      const wkMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      let dayIdx = now.getDay();
      let hour = now.getHours();
      let minute = now.getMinutes();

      for (const p of parts) {
        if (p.type === "weekday" && wkMap[p.value] !== undefined) dayIdx = wkMap[p.value];
        if (p.type === "hour") hour = parseInt(p.value, 10) % 24;
        if (p.type === "minute") minute = parseInt(p.value, 10);
      }

      document.querySelectorAll(".hours-row").forEach((row) => {
        row.classList.toggle("today", Number(row.getAttribute("data-day")) === dayIdx);
      });

      const sched = HOURS_BY_DAY[dayIdx];
      const minsNow = hour * 60 + minute;
      const isOpen = sched && minsNow >= sched.open && minsNow < sched.close;

      const railStatus = document.getElementById("railLiveStatus");
      const railDot = document.getElementById("railPulseDot");
      const mobileStatus = document.getElementById("mobileLiveStatus");
      const hoursBadge = document.getElementById("hoursCardBadge");

      if (isOpen) {
        const closeHr = Math.floor(sched.close / 60);
        const closeMin = sched.close % 60;
        const closeFormatted = `${closeHr > 12 ? closeHr - 12 : closeHr}:${closeMin === 0 ? "00" : closeMin} PM`;
        if (railStatus) railStatus.textContent = `Open Now · Closes ${closeFormatted}`;
        if (railDot) railDot.classList.remove("closed");
        if (mobileStatus) mobileStatus.textContent = `Open · Until ${closeFormatted}`;
        if (hoursBadge) hoursBadge.textContent = `Open Today (${sched.label})`;
      } else {
        if (railStatus) railStatus.textContent = `Open 7 Days · ${sched ? sched.label : ""}`;
        if (railDot) railDot.classList.add("closed");
        if (mobileStatus) mobileStatus.textContent = "Open 7 Days";
        if (hoursBadge) hoursBadge.textContent = `Today: ${sched ? sched.label : "Open 7 Days"}`;
      }
    } catch (e) {}
  }

  updateOrlandoLiveStatus();

  // =========================================================================
  // 6. LIGHTBOX & VERBATIM LEGAL POLICY MODALS
  // =========================================================================
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "Venice Nails & Spa Photo";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightboxModal.hidden = false;
    lightboxModal.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.hidden = true;
    lightboxModal.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.src = "";
  }

  function bindLightboxTriggers(root = document) {
    root.querySelectorAll("[data-lightbox]").forEach((el) => {
      if (el.dataset.boundLightbox) return;
      el.dataset.boundLightbox = "1";
      el.addEventListener("click", () => {
        openLightbox(el.getAttribute("data-lightbox"), el.getAttribute("data-caption"));
      });
    });
  }

  bindLightboxTriggers(document);

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Legal Policy Modal
  const policyModal = document.getElementById("policyModal");
  const policyClose = document.getElementById("policyClose");

  function activatePolicyTab(tabKey) {
    document.querySelectorAll(".policy-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-policy-tab") === tabKey);
    });
    ["privacy", "terms", "accessibility"].forEach((key) => {
      const pane = document.getElementById(`policy-${key}`);
      if (pane) pane.hidden = key !== tabKey;
    });
  }

  function openPolicyModal(tabKey) {
    if (!policyModal) return;
    activatePolicyTab(tabKey || "privacy");
    policyModal.hidden = false;
    policyModal.setAttribute("aria-hidden", "false");
  }

  function closePolicyModal() {
    if (!policyModal) return;
    policyModal.hidden = true;
    policyModal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-open-policy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openPolicyModal(btn.getAttribute("data-open-policy"));
    });
  });

  document.querySelectorAll(".policy-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activatePolicyTab(btn.getAttribute("data-policy-tab"));
    });
  });

  if (policyClose) policyClose.addEventListener("click", closePolicyModal);
  if (policyModal) {
    policyModal.addEventListener("click", (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closePolicyModal();
    }
  });
})();
