/**
 * ==========================================================================
 * WERKBANK & LIEFERKETTE — JAVASCRIPT CONTROLLERS
 * Bhushan Patel Portfolio: Interactions, Scroll-Drawing & Animations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initI18n();
  initPageLoad();
  initCustomCursor();
  initScrollProgressBar();
  initBlueprintParallax();
  initMagneticButtons();
  initScrollObserver();
  initRouteLineDraw();
  initOlderStationsToggle();
  initAusbildungYears();
  initMilestonesObserver();
  initNavScrollSpy();
  initContactForm();
  initCvDownload();
});

/* --------------------------------------------------------------------------
   1. PAGE LOAD CURTAIN WIPE & HERO TEXT REVEAL
   -------------------------------------------------------------------------- */
function initPageLoad() {
  const curtain = document.getElementById('page-curtain');
  const heroTitle = document.getElementById('hero-main-title');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (curtain) curtain.classList.add('loaded');
      setTimeout(() => {
        if (heroTitle) heroTitle.classList.add('revealed');
      }, 350);
    }, 200);
  });

  // Fallback in case window load fired early
  setTimeout(() => {
    if (curtain && !curtain.classList.contains('loaded')) {
      curtain.classList.add('loaded');
      if (heroTitle) heroTitle.classList.add('revealed');
    }
  }, 1200);
}

/* --------------------------------------------------------------------------
   2. CUSTOM SMALL CURSOR (ORANGE DOT & LAGGING RING)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot = document.getElementById('custom-cursor-dot');
  const ring = document.getElementById('custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Grow cursor on interactive elements
  const interactiveSelector = 'a, button, input, textarea, .station-card, .stamp-ticket-card, .projekt-editorial-row';
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL PROGRESS BAR (2px SAFETY ORANGE)
   -------------------------------------------------------------------------- */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.pageYOffset / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. HERO BLUEPRINT GRID PARALLAX
   -------------------------------------------------------------------------- */
function initBlueprintParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroSection = document.getElementById('hero');
  const grid = document.getElementById('hero-blueprint-grid');
  if (!heroSection || !grid) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const moveX = relX * 18;
    const moveY = relY * 18;
    grid.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    grid.style.transform = 'translate(0px, 0px)';
  });
}

/* --------------------------------------------------------------------------
   5. MAGNETIC BUTTONS
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
}

/* --------------------------------------------------------------------------
   7. SCROLL-DRAWN SUPPLY-CHAIN ROUTE LINE ("ERFAHRUNG")
   -------------------------------------------------------------------------- */
function initRouteLineDraw() {
  const container = document.getElementById('erfahrung-route-container');
  const line = document.getElementById('route-line-svg');
  const nodes = document.querySelectorAll('.station-node');
  if (!container || !line) return;

  function updateRoute() {
    const rect = container.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalH = container.offsetHeight;

    // How far container is through viewport
    const startY = rect.top - windowH * 0.75;
    const endY = rect.bottom - windowH * 0.4;
    const progress = Math.min(1, Math.max(0, -startY / (endY - startY || 1)));

    const dashLength = 1200;
    line.style.strokeDashoffset = dashLength * (1 - progress);

    // Light up nodes reached
    nodes.forEach((node) => {
      const nodeRect = node.getBoundingClientRect();
      if (nodeRect.top < windowH * 0.72) {
        node.classList.add('active-node');
      } else {
        node.classList.remove('active-node');
      }
    });
  }

  window.addEventListener('scroll', updateRoute, { passive: true });
  window.addEventListener('resize', updateRoute);
  updateRoute();
}

/* --------------------------------------------------------------------------
   8. TOGGLE "WEITERE STATIONEN ANZEIGEN" (DHL, ERNSTING'S, ETC.)
   -------------------------------------------------------------------------- */
function initOlderStationsToggle() {
  const toggleBtn = document.getElementById('btn-toggle-older-stations');
  const collapseBox = document.getElementById('older-stations-collapse');
  if (!toggleBtn || !collapseBox) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = collapseBox.classList.contains('expanded');
    if (isExpanded) {
      collapseBox.classList.remove('expanded');
      toggleBtn.innerHTML = `<span>${currentLang === 'en' ? TRANSLATIONS.en.erfahrung.toggleShow : TRANSLATIONS.de.erfahrung.toggleShow}</span>`;
    } else {
      collapseBox.classList.add('expanded');
      toggleBtn.innerHTML = `<span>${currentLang === 'en' ? TRANSLATIONS.en.erfahrung.toggleHide : TRANSLATIONS.de.erfahrung.toggleHide}</span>`;
    }
  });
}

/* --------------------------------------------------------------------------
   9. AUSBILDUNG YEAR COUNT-UP / ROLL
   -------------------------------------------------------------------------- */
function initAusbildungYears() {
  const section = document.getElementById('ausbildung');
  const yearEls = document.querySelectorAll('.huge-year-outline');
  if (!section || yearEls.length === 0) return;

  let hasRun = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasRun) {
      hasRun = true;
      yearEls.forEach((el) => {
        const target = parseInt(el.getAttribute('data-year') || '2025', 10);
        let current = target - 35;
        const interval = setInterval(() => {
          current++;
          el.textContent = current;
          if (current >= target) {
            clearInterval(interval);
            el.textContent = target;
          }
        }, 22);
      });
      observer.unobserve(section);
    }
  }, { threshold: 0.2 });

  observer.observe(section);
}

/* --------------------------------------------------------------------------
   10. ALS NÄCHSTES MILESTONES LIGHTING UP
   -------------------------------------------------------------------------- */
function initMilestonesObserver() {
  const milestoneItems = document.querySelectorAll('.milestone-item');
  if (milestoneItems.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-milestone');
      }
    });
  }, { threshold: 0.35 });

  milestoneItems.forEach((item) => observer.observe(item));
}

/* --------------------------------------------------------------------------
   11. ACTIVE NAV HIGHLIGHTING & SMOOTH SCROLLING
   -------------------------------------------------------------------------- */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  const burgerBtn = document.getElementById('nav-burger-btn');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   12. CONTACT FORM (VALIDATION + MAILTO FALLBACK)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('kontakt-form');
  const feedback = document.getElementById('kontakt-feedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('kontakt-name').value.trim();
    const email = document.getElementById('kontakt-email').value.trim();
    const message = document.getElementById('kontakt-message').value.trim();

    if (!name || !email || !message) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.color = '#E4572E';
        feedback.textContent = 'Bitte füllen Sie alle erforderlichen Felder aus.';
      }
      return;
    }

    const mailSubject = encodeURIComponent(`Kontaktanfrage von ${name}`);
    const mailBody = encodeURIComponent(`Hallo Bhushan,\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}\n\nMit freundlichen Grüßen,\n${name}`);
    const mailUrl = `mailto:bpatel7765@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    window.location.href = mailUrl;

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.color = '#F1ECE2';
      const successMsg = currentLang === 'en'
        ? `Thank you, <strong>${name}</strong>! Your email client was opened. If not, <a href="${mailUrl}" style="color: #E4572E; text-decoration: underline;">please click here</a>.`
        : `Vielen Dank, <strong>${name}</strong>! Ihr E-Mail-Programm wurde geöffnet. Falls nicht, <a href="${mailUrl}" style="color: #E4572E; text-decoration: underline;">klicken Sie bitte hier</a>.`;
      feedback.innerHTML = successMsg;
    }
  });
}

/* ==========================================================================
   13. THEME CONTROLLER (DARK / LIGHT MODE)
   ========================================================================== */
let currentTheme = 'light';

function initTheme() {
  const savedTheme = localStorage.getItem('bhushan_portfolio_theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    currentTheme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    currentTheme = 'dark';
  } else {
    currentTheme = 'light';
  }
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  currentTheme = theme;
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('bhushan_portfolio_theme', theme);
  updateThemeButtonUI();
}

function toggleTheme() {
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
}
window.toggleTheme = toggleTheme;

function updateThemeButtonUI() {
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  const themeText = document.getElementById('theme-mode-text');
  const mobileThemeText = document.getElementById('mobile-theme-mode-text');

  const isDark = currentTheme === 'dark';

  if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'inline-block';
  if (moonIcon) moonIcon.style.display = isDark ? 'inline-block' : 'none';

  const labelText = isDark
    ? (currentLang === 'en' ? 'DARK' : 'DUNKEL')
    : (currentLang === 'en' ? 'LIGHT' : 'HELL');

  if (themeText) themeText.textContent = labelText;
  if (mobileThemeText) {
    mobileThemeText.textContent = isDark
      ? (currentLang === 'en' ? 'DARK MODE' : 'DUNKELMODUS')
      : (currentLang === 'en' ? 'LIGHT MODE' : 'HELLMODUS');
  }
}

/* ==========================================================================
   14. INTERNATIONALIZATION (DE / EN SWITCHER)
   ========================================================================== */
let currentLang = 'de';

const TRANSLATIONS = {
  de: {
    nav: {
      profil: "Profil",
      erfahrung: "Erfahrung",
      ausbildung: "Ausbildung",
      faehigkeiten: "Fähigkeiten",
      projekte: "Projekte",
      zertifikate: "Zertifikate",
      alsNaechstes: "Als Nächstes",
      kontakt: "Kontakt",
      cvBtn: "Lebenslauf (PDF)",
      mobileCvBtn: "Lebenslauf herunterladen (PDF) ↓"
    },
    hero: {
      techLabel: "[ 00 ] PRODUKTION · QUALITÄT · SUPPLY CHAIN",
      subline: '"Ich verbinde technisches Produktionsverständnis mit kaufmännischem <em>Know-how</em>."',
      desc: "Engagierter Fachmann mit Erfahrung in Produktion und Qualitätskontrolle sowie akademischem Hintergrund im internationalen Geschäftsmanagement. Aktuell vertiefe ich ERP-Systeme, Produktionsplanung und Produktionsadministration.",
      statusText: "Aktuell: Produktion &amp; Qualitätskontrolle bei BWT Pool Products GmbH, Zörbig",
      metaStandort: "STANDORT:",
      locationText: "Dessau, Deutschland",
      metaTel: "TEL:",
      metaEmail: "E-MAIL:",
      btnCv: "Lebenslauf herunterladen (PDF)",
      btnProfil: "Profil ansehen",
      btnKontakt: "Kontakt aufnehmen",
      badgeText: "PRODUKTION • QUALITÄT • SUPPLY CHAIN •"
    },
    ticker: "ERP · Dynamics 365 · SAP · Power BI · Excel & VBA · KANBAN · Lean Management · CAPA · Risikomanagement · Lieferkettenmanagement · Qualitätskontrolle ·",
    profil: {
      sectionNum: "01 — PROFIL",
      title: "Werdegang &amp; Fokus",
      quote: '"Als Mitgründer von Vitalgrün sowie als Freelancer für US-amerikanische Unternehmen verfüge ich über Erfahrung in Lieferkettenmanagement, Produktbeschaffung, Produktdesign und operativen Geschäftsprozessen."',
      desc: "Meine tägliche Arbeit basiert auf Präzision an der Werkbank und Übersicht entlang der globalen Lieferkette. Ob Qualitätsprüfung von Fertigwaren, präziser PVC-Zuschnitt nach Zeichnung, Heißkeil- und Hochfrequenzschweißarbeiten oder ERP-gestützte Stücklisten- und Bestandsverwaltung – ich verbinde praktische Ausführung mit kaufmännischer Prozesssicherheit.",
      fact1Label: "Sprachen",
      fact1Sub: "Deutsch (B2), Englisch (Muttersprache), Hindi (fließend)",
      fact2Num: "MSc & Bachelor",
      fact2Label: "Doppelter Abschluss",
      fact2Sub: "Internationales Geschäftsmanagement (Berlin) &amp; Bachelor (Indien)",
      fact3Num: "Indien → Deutschland",
      fact3Label: "Internationale Laufbahn",
      fact3Sub: "Produktionserfahrung in Tier-1-Umgebungen und in der deutschen Industrie"
    },
    erfahrung: {
      sectionNum: "02 — ERFAHRUNG",
      title: "Lieferketten-Route",
      dim: "7 STATIONEN // 2022–2026",
      bwtRole: "Mitarbeiter Produktion &amp; Qualitätskontrolle",
      bwtDate: "01.2026 – Heute",
      bwtCompany: "BWT Pool Products GmbH, Zörbig (Deutschland)",
      bwtB1: "Qualitätskontrolle von Fertigprodukten und Unterstützung der laufenden Produktionsprozesse",
      bwtB2: "Bearbeitung und Zuschnitt von PVC-Materialien nach technischen Zeichnungen und Vorgaben",
      bwtB3: "Vorbereitung und Durchführung spezieller Zuschnitte sowie Heißkeil- und Hochfrequenzschweißarbeiten",
      bwtB4: "Unterstützung bei Material-, Bestands- und produktionsbezogenen Abläufen",
      vitalRole: "Mitgründer – Produkt- &amp; Geschäftsentwicklung",
      vitalDate: "Aktuell",
      vitalCompany: "Vitalgrün, Indien",
      vitalB1: "Aufbau und Weiterentwicklung eines Geschäftsmodells im Bereich natürlicher Lebensmittel- und Pflanzenprodukte",
      vitalB2: "Produktbeschaffung, Lieferantenrecherche, Produktentwicklung und Produktkalkulation",
      vitalB3: "Entwicklung und Koordination von Beschaffungs-, Produktions-, Verpackungs- und Vertriebsprozessen",
      vitalB4: "Recherche internationaler B2B-Kunden, Geschäftspartner und Absatzmöglichkeiten",
      freeRole: "Freelancer – Supply Chain, Product Sourcing &amp; Operations",
      freeDate: "Aktuell",
      freeCompany: "Internationale / US-amerikanische Kunden",
      freeB1: "Unterstützung verschiedener US-amerikanischer Unternehmen im Supply-Chain-Management und in operativen Geschäftsprozessen",
      freeB2: "Product Sourcing, Lieferantenrecherche und Unterstützung bei der Auswahl geeigneter Produkte und Beschaffungslösungen",
      freeB3: "Unterstützung bei Product Design, Produktentwicklung und operativer Umsetzung",
      freeB4: "Koordination von Aufgaben entlang der Lieferkette von der Produktidee bis zur Beschaffung und Umsetzung",
      dhlRole: "Zustellassistent",
      dhlDate: "09.2025 – 12.2025",
      dhlCompany: "DHL, Deutschland",
      dhlB1: "Routenplanung, pünktliche Lieferung und professionelle Kundenkommunikation mit Fokus auf eine sichere und effiziente Paketabwicklung",
      ernstRole: "Mitarbeiter Warenannahme &amp; Lieferung",
      ernstDate: "07.2025 – 09.2025",
      ernstCompany: "Ernsting's Family, Deutschland",
      ernstB1: "Kontrolle eingehender Waren, Organisation von Filiallieferungen und enge Zusammenarbeit mit dem Logistikteam für einen reibungslosen Ablauf",
      riddhiRole: "Produktion &amp; Qualitätskontrolle",
      riddhiDate: "05.2022 – 11.2022",
      riddhiCompany: "Riddhi Pharma, Indien",
      riddhiB1: "Praktische Erfahrung in pharmazeutischer Produktion und Qualitätskontrolle sowie Unterstützung bei produktions- und qualitätsbezogenen Abläufen",
      sunRole: "Praktikum Qualitätssicherung",
      sunDate: "12.2022 – 05.2023",
      sunCompany: "Sun Pharma, Indien",
      sunB1: "Unterstützung im Bereich Qualitätssicherung mit Schwerpunkt auf Dokumentation, Qualitätsprozessen und pharmazeutischen Standards",
      toggleShow: "+ Weitere Stationen anzeigen (DHL, Ernsting’s, Riddhi Pharma, Sun Pharma)",
      toggleHide: "− Frühere Stationen einklappen"
    },
    ausbildung: {
      sectionNum: "03 — AUSBILDUNG",
      title: "Akademische Abschlüsse",
      dim: "BERLIN // INDIEN",
      deg1Title: "MSc Internationales Geschäftsmanagement",
      deg1Uni: "University of Europe for Applied Sciences, Berlin",
      deg1Desc: "Lieferkettenmanagement, Produktions- und Geschäftsplanung, Betriebs- und Prozessmanagement, Vertrieb und Geschäftsentwicklung, Marketing sowie internationale Geschäftsprozesse.",
      deg2Title: "B.Pharm (Bachelor of Pharmacy)",
      deg2Uni: "Parul Universität, Indien",
      deg2Desc: "Qualitätssicherung, Arzneimittelentwicklung, Einhaltung gesetzlicher Vorschriften | Nebenfach: Arzneimittelproduktion."
    },
    faehigkeiten: {
      sectionNum: "04 — FÄHIGKEITEN",
      title: "Kompetenz &amp; Systeme",
      dim: "METHODEN &amp; SOFTWARE",
      col1Title: "Schwerpunkte / Fokus",
      col2Title: "Technische Fähigkeiten",
      skill1: "Produktionsplanung und Produktionsadministration",
      skill2: "Qualitätskontrolle und Produktionsunterstützung",
      skill3: "Import und Export von Materialien und Produkten",
      skill4: "Lieferkettenmanagement und Beschaffungsprozesse",
      skill5: "Produktbeschaffung und Lieferantenmanagement",
      skill6: "CAPA (Corrective and Preventive Actions)",
      skill7: "Abweichungsmanagement",
      skill8: "Risikomanagement und Kontinuierliche Prozessverbesserung",
      skill9: "KANBAN, Lean Management",
      skill10: "Technisches Verständnis und Arbeiten nach Zeichnungen und Vorgaben",
      skill11: "Teamarbeit, Eigeninitiative und selbstständige Arbeitsweise",
      profGute: "gute Kenntnisse",
      profVertiefung: "in Vertiefung",
      profWeiter: "in Weiterbildung"
    },
    projekte: {
      sectionNum: "05 — PROJEKTE",
      title: "Projekte &amp; Abschlussarbeiten",
      dim: "4 HIGHLIGHTS",
      p1Title: "Vitalgrün – Geschäfts- und Produktentwicklung",
      p1Desc: "Laufendes Projekt · Aufbau eines nachhaltigen Geschäftsmodells für natürliche Lebensmittel &amp; Pflanzenprodukte, B2B-Vertrieb und End-to-End-Produktkalkulation.",
      p2Title: "Internationale Supply-Chain-Projekte – Freelancer",
      p2Desc: "Laufend · Beratung US-amerikanischer Unternehmen in Produktbeschaffung, Lieferantenrecherche, Product Design und Lieferkettenkoordination.",
      p3Title: "Komplexität der pharmazeutischen Lieferkette und ihre Auswirkungen auf die Verbraucher",
      p3Desc: "Masterarbeit 2025 · Analyse von Vulnerabilitäten, Kaltkettenüberwachung, GDP-Konformität und Versorgungsengpässen in Europa.",
      p4Title: "Entwicklung und Charakterisierung von Aceclofenac Medicated Lollipops",
      p4Desc: "Abschlussforschung 2022 · Formulierungsoptimierung, Charakterisierung der Wirkstofffreisetzung via HPLC, FTIR und DSC sowie Qualitätskontrollprüfungen."
    },
    zertifikate: {
      sectionNum: "06 — ZERTIFIKATE",
      title: "Bescheinigungen &amp; Sprachen",
      dim: "QUALITÄTSNACHWEISE",
      badgeZert: "LAUFEND",
      badgeStd: "STANDARD",
      badgeFach: "FACHNACHWEIS",
      badgeGmp: "GMP COMPLIANCE",
      badgeWs: "WORKSHOP",
      z1Title: "Microsoft Dynamics 365 Finance &amp; Operations",
      z1Issuer: "WEITERBILDUNG // ERP",
      z1Desc: "Schwerpunkt: Produktionsaufträge, Stammdaten, Stücklisten (BOMs), Materialverwaltung und Produktionsplanung.",
      z2Title: "Microsoft Dynamics 365 Supply Chain Management",
      z2Issuer: "WEITERBILDUNG // SCM",
      z2Desc: "Schwerpunkt: Lagerverwaltung, Beschaffung, Bestandsmanagement und Master Planning.",
      z3Title: "ISO 9001:2001 – Grundlagen des Qualitätsmanagements",
      z3Issuer: "QUALITÄTSSYSTEME",
      z3Desc: "Grundsätze des prozessorientierten Qualitätsmanagements, Auditierung und KVP.",
      z4Title: "Bedeutung der Kalibrierung und Validierung in der Pharmazie",
      z4Issuer: "VADODARA, GUJARAT",
      z4Desc: "Kalibrierung von Messgeräten und Prüfsystemen sowie Qualifizierungsvorgaben (IQ/OQ/PQ).",
      z5Title: "Gute Herstellungspraxis (GMP)",
      z5Issuer: "HERSTELLUNGSSCHULUNG",
      z5Desc: "1. Bedeutung von Produktqualität, Sicherheit und Compliance · 2. Sicherheitsmaßnahmen für Schulung und Dokumentation · 3. Abweichungen &amp; Risikomanagement.",
      z6Title: 'Workshop "Good To Great- SO"',
      z6Issuer: "AJANTA PHARMA LTD.",
      z6Desc: "Operative Exzellenz in der Fertigung, Lean-Prinzipien und organisatorische Qualitätskultur.",
      langDeName: "Deutsch",
      langDeLevel: "B2 — Sicher im Berufsalltag",
      langEnName: "Englisch",
      langEnLevel: "Muttersprache — Verhandlungssicher",
      langHiName: "Hindi",
      langHiLevel: "Fließend"
    },
    alsNaechstes: {
      sectionNum: "07 — ALS NÄCHSTES",
      title: "Geplante Weiterentwicklung",
      dim: "ZIELE // 2026+",
      m1Tag: "MEILENSTEIN 01 // ERP",
      m1Title: "Vertiefung Microsoft Dynamics 365 F&amp;O",
      m1Desc: "Umfassende Beherrschung von Produktionsmodulen, Stücklistenauflösung, Dispositionsläufen (MRP) und systemischer Kostenkalkulation.",
      m2Tag: "MEILENSTEIN 02 // SCM",
      m2Title: "Produktionsplanung &amp; Prozessoptimierung",
      m2Desc: "Weiterentwicklung in der operativen Fertigungsleitung, KANBAN-Steuerung und Schnittstellenoptimierung zwischen Beschaffung und Fertigung.",
      m3Tag: "MEILENSTEIN 03 // ANALYTICS",
      m3Title: "Power BI, SAP &amp; Datenbasierte Optimierung",
      m3Desc: "Aufbau interaktiver Dashboards zur Fertigungseffizienz (OEE), Lieferantentreue und proaktiven Qualitätskontroll-Metriken."
    },
    kontakt: {
      sectionNum: "08 — KONTAKT",
      title: "Gespräch beginnen",
      subline: '"Bereit für neue Herausforderungen in Produktionsleitung, Qualitätskontrolle oder Supply Chain Management."',
      infoTitle: "DIREKTER KONTAKT",
      formNameLabel: "Ihr Name *",
      formEmailLabel: "Ihre E-Mail-Adresse *",
      formMsgLabel: "Ihre Nachricht *",
      formNamePlaceholder: "z.B. Dr. Thomas Weber",
      formEmailPlaceholder: "name@unternehmen.de",
      formMsgPlaceholder: "Guten Tag Herr Patel, wir suchen Verstärkung für...",
      btnSend: "Nachricht senden →"
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
      backToTop: "↑ Zurück zum Seitenanfang"
    }
  },
  en: {
    nav: {
      profil: "Profile",
      erfahrung: "Experience",
      ausbildung: "Education",
      faehigkeiten: "Skills",
      projekte: "Projects",
      zertifikate: "Certifications",
      alsNaechstes: "Next Steps",
      kontakt: "Contact",
      cvBtn: "Resume (PDF)",
      mobileCvBtn: "Download Resume (PDF) ↓"
    },
    hero: {
      techLabel: "[ 00 ] PRODUCTION · QUALITY · SUPPLY CHAIN",
      subline: '"I combine technical manufacturing precision with commercial <em>know-how</em>."',
      desc: "Dedicated professional with expertise in production and quality control alongside an academic background in international business management. Currently advancing knowledge in ERP systems, production planning, and manufacturing administration.",
      statusText: "Current: Production &amp; Quality Control at BWT Pool Products GmbH, Zörbig",
      metaStandort: "LOCATION:",
      locationText: "Dessau, Germany",
      metaTel: "PHONE:",
      metaEmail: "EMAIL:",
      btnCv: "Download Resume (PDF)",
      btnProfil: "View Profile",
      btnKontakt: "Get In Touch",
      badgeText: "PRODUCTION • QUALITY • SUPPLY CHAIN •"
    },
    ticker: "ERP · Dynamics 365 · SAP · Power BI · Excel & VBA · KANBAN · Lean Management · CAPA · Risk Management · Supply Chain Management · Quality Control ·",
    profil: {
      sectionNum: "01 — PROFILE",
      title: "Background &amp; Focus",
      quote: '"As co-founder of Vitalgrün and freelancer for US companies, I bring hands-on experience across supply chain management, product sourcing, design, and operational business workflows."',
      desc: "My daily practice combines precision on the manufacturing floor with end-to-end command of global supply chains. From finished goods quality inspection and blueprint PVC fabrication to hot-wedge welding and ERP bill of materials management, I link physical craftsmanship with solid business process integrity.",
      fact1Label: "Languages",
      fact1Sub: "German (B2), English (Native), Hindi (Fluent)",
      fact2Num: "MSc & Bachelor",
      fact2Label: "Dual Degree",
      fact2Sub: "International Business Management (Berlin) &amp; Bachelor (India)",
      fact3Num: "India → Germany",
      fact3Label: "Global Career Path",
      fact3Sub: "Manufacturing experience across Tier-1 operations and German industry"
    },
    erfahrung: {
      sectionNum: "02 — EXPERIENCE",
      title: "Career &amp; Supply Chain Route",
      dim: "7 STATIONS // 2022–2026",
      bwtRole: "Production &amp; Quality Control Associate",
      bwtDate: "01.2026 – Present",
      bwtCompany: "BWT Pool Products GmbH, Zörbig (Germany)",
      bwtB1: "Quality control of finished products and continuous manufacturing support",
      bwtB2: "Processing and precision cutting of PVC materials based on engineering blueprints",
      bwtB3: "Preparation of custom cuts and execution of hot-wedge and high-frequency welding",
      bwtB4: "Operational support in material handling, inventory workflows, and production scheduling",
      vitalRole: "Co-Founder – Product &amp; Business Development",
      vitalDate: "Present",
      vitalCompany: "Vitalgrün, India",
      vitalB1: "Establishment and growth of a sustainable business model in organic food & plant products",
      vitalB2: "Strategic product sourcing, supplier vetting, product development, and cost calculation",
      vitalB3: "End-to-end coordination of procurement, manufacturing, packaging, and distribution",
      vitalB4: "International B2B client acquisition, partnership establishment, and sales expansion",
      freeRole: "Freelancer – Supply Chain, Product Sourcing &amp; Operations",
      freeDate: "Present",
      freeCompany: "International / US-based Clients",
      freeB1: "Advising US companies on supply chain architecture and operational execution",
      freeB2: "Product sourcing, supplier vetting, and selection of optimal procurement solutions",
      freeB3: "Assisting with product design refinement, prototype development, and operations",
      freeB4: "Synchronizing supply chain touchpoints from product conception to commercial fulfillment",
      dhlRole: "Delivery Assistant",
      dhlDate: "09.2025 – 12.2025",
      dhlCompany: "DHL, Germany",
      dhlB1: "Route planning, timely dispatch, and customer relations focused on secure, efficient parcel logistics",
      ernstRole: "Goods Receiving &amp; Dispatch Associate",
      ernstDate: "07.2025 – 09.2025",
      ernstCompany: "Ernsting's Family, Germany",
      ernstB1: "Inbound goods verification, store delivery organization, and active collaboration with logistics dispatch",
      riddhiRole: "Production &amp; Quality Control",
      riddhiDate: "05.2022 – 11.2022",
      riddhiCompany: "Riddhi Pharma, India",
      riddhiB1: "Hands-on experience in pharmaceutical production lines, in-process quality control, and compliance records",
      sunRole: "Quality Assurance Internship",
      sunDate: "12.2022 – 05.2023",
      sunCompany: "Sun Pharma, India",
      sunB1: "QA department support with emphasis on GMP documentation, SOP adherence, and pharma standards",
      toggleShow: "+ Show Additional Stations (DHL, Ernsting’s, Riddhi Pharma, Sun Pharma)",
      toggleHide: "− Collapse Earlier Stations"
    },
    ausbildung: {
      sectionNum: "03 — EDUCATION",
      title: "Academic Degrees",
      dim: "BERLIN // INDIA",
      deg1Title: "MSc International Business Management",
      deg1Uni: "University of Europe for Applied Sciences, Berlin",
      deg1Desc: "Supply chain management, production & business planning, operations & process control, sales & business development, and international trade workflows.",
      deg2Title: "B.Pharm (Bachelor of Pharmacy)",
      deg2Uni: "Parul University, India",
      deg2Desc: "Quality assurance, drug formulation, regulatory compliance | Minor: Pharmaceutical Manufacturing."
    },
    faehigkeiten: {
      sectionNum: "04 — SKILLS",
      title: "Core Competencies &amp; Tools",
      dim: "METHODS &amp; SOFTWARE",
      col1Title: "Core Focus Areas",
      col2Title: "Technical Capabilities",
      skill1: "Production Planning and Manufacturing Administration",
      skill2: "Quality Control and In-Process Inspection Support",
      skill3: "Import and Export of Materials and Finished Goods",
      skill4: "Supply Chain Management and Procurement Workflows",
      skill5: "Strategic Sourcing and Supplier Relationship Management",
      skill6: "CAPA (Corrective and Preventive Actions)",
      skill7: "Deviation and Non-Conformance Management",
      skill8: "Risk Management and Continuous Process Improvement (CIP)",
      skill9: "KANBAN and Lean Manufacturing",
      skill10: "Technical Drawing Comprehension & Blueprint Specifications",
      skill11: "Team Collaboration, High Initiative and Autonomous Work Style",
      profGute: "Proficient",
      profVertiefung: "Advanced Study",
      profWeiter: "Ongoing Training"
    },
    projekte: {
      sectionNum: "05 — PROJECTS",
      title: "Projects &amp; Academic Research",
      dim: "4 HIGHLIGHTS",
      p1Title: "Vitalgrün – Business &amp; Product Development",
      p1Desc: "Ongoing Project · Development of a sustainable business model for natural foods & botanical goods, B2B distribution, and end-to-end unit costing.",
      p2Title: "International Supply Chain Projects – Freelancer",
      p2Desc: "Ongoing · Consulting US enterprises on product procurement, vendor evaluation, industrial design refinement, and logistics synchronization.",
      p3Title: "Complexity of the Pharmaceutical Supply Chain and Its Impact on Consumers",
      p3Desc: "Master's Thesis 2025 · Critical analysis of supply chain bottlenecks, cold-chain integrity, GDP compliance, and European drug shortages.",
      p4Title: "Formulation and Characterization of Aceclofenac Medicated Lollipops",
      p4Desc: "Degree Research 2022 · Drug release optimization, analytic characterization via HPLC, FTIR, and DSC, alongside stringent quality release testing."
    },
    zertifikate: {
      sectionNum: "06 — CERTIFICATIONS",
      title: "Certifications &amp; Languages",
      dim: "QUALITY CREDENTIALS",
      badgeZert: "ONGOING",
      badgeStd: "STANDARD",
      badgeFach: "CREDENTIAL",
      badgeGmp: "GMP COMPLIANCE",
      badgeWs: "WORKSHOP",
      z1Title: "Microsoft Dynamics 365 Finance &amp; Operations",
      z1Issuer: "PROFESSIONAL TRAINING // ERP",
      z1Desc: "Focus: Production orders, master data, bill of materials (BOM), material management, and capacity scheduling.",
      z2Title: "Microsoft Dynamics 365 Supply Chain Management",
      z2Issuer: "PROFESSIONAL TRAINING // SCM",
      z2Desc: "Focus: Warehouse management, strategic procurement, inventory optimization, and master planning.",
      z3Title: "ISO 9001:2001 – Quality Management Fundamentals",
      z3Issuer: "QUALITY SYSTEMS",
      z3Desc: "Core principles of process-oriented quality systems, internal auditing, and continuous improvement.",
      z4Title: "Calibration and Validation in Pharmaceutical Technology",
      z4Issuer: "VADODARA, GUJARAT",
      z4Desc: "Calibration standards for measuring equipment and qualification protocols (IQ/OQ/PQ).",
      z5Title: "Good Manufacturing Practice (GMP)",
      z5Issuer: "MANUFACTURING COMPLIANCE",
      z5Desc: "1. Product quality, patient safety & regulatory compliance · 2. Training and documentation protocols · 3. Deviation & risk governance.",
      z6Title: 'Workshop "Good To Great- SO"',
      z6Issuer: "AJANTA PHARMA LTD.",
      z6Desc: "Operational excellence on the manufacturing floor, lean methodologies, and quality culture.",
      langDeName: "German",
      langDeLevel: "B2 — Professional Working Proficiency",
      langEnName: "English",
      langEnLevel: "Native Language — Full Professional",
      langHiName: "Hindi",
      langHiLevel: "Fluent"
    },
    alsNaechstes: {
      sectionNum: "07 — NEXT STEPS",
      title: "Professional Roadmap",
      dim: "OBJECTIVES // 2026+",
      m1Tag: "MILESTONE 01 // ERP",
      m1Title: "Advanced Microsoft Dynamics 365 F&amp;O",
      m1Desc: "Comprehensive command of manufacturing modules, multi-level BOM explosion, MRP runs, and systematic cost accounting.",
      m2Tag: "MILESTONE 02 // SCM",
      m2Title: "Production Planning &amp; Process Optimization",
      m2Desc: "Deepening operations management, KANBAN visual controls, and seamless interface coordination between procurement and shop floor.",
      m3Tag: "MILESTONE 03 // ANALYTICS",
      m3Title: "Power BI, SAP &amp; Data-Driven Operations",
      m3Desc: "Engineering operational dashboards for overall equipment effectiveness (OEE), vendor lead-time reliability, and proactive QC analytics."
    },
    kontakt: {
      sectionNum: "08 — CONTACT",
      title: "Get In Touch",
      subline: '"Ready for new challenges in production management, quality control, or supply chain operations."',
      infoTitle: "DIRECT CONTACT",
      formNameLabel: "Your Name *",
      formEmailLabel: "Your Email Address *",
      formMsgLabel: "Your Message *",
      formNamePlaceholder: "e.g. Dr. Thomas Weber",
      formEmailPlaceholder: "name@company.com",
      formMsgPlaceholder: "Hello Mr. Patel, we are seeking support for...",
      btnSend: "Send Message →"
    },
    footer: {
      rights: "All rights reserved.",
      backToTop: "↑ Back to top"
    }
  }
};

function initI18n() {
  const savedLang = localStorage.getItem('bhushan_portfolio_lang');
  if (savedLang === 'en' || savedLang === 'de') {
    currentLang = savedLang;
  } else {
    currentLang = 'de';
  }
  setLanguage(currentLang);
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('bhushan_portfolio_lang', lang);

  // Update active state on buttons
  const deBtns = [document.getElementById('lang-btn-de'), document.getElementById('mobile-lang-btn-de')];
  const enBtns = [document.getElementById('lang-btn-en'), document.getElementById('mobile-lang-btn-en')];

  deBtns.forEach(b => { if (b) b.classList.toggle('active', lang === 'de'); });
  enBtns.forEach(b => { if (b) b.classList.toggle('active', lang === 'en'); });

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getNestedTranslation(TRANSLATIONS[lang], key);
    if (val !== undefined) el.textContent = val;
  });

  // Update elements with data-i18n-html
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = getNestedTranslation(TRANSLATIONS[lang], key);
    if (val !== undefined) el.innerHTML = val;
  });

  // Update elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = getNestedTranslation(TRANSLATIONS[lang], key);
    if (val !== undefined) el.setAttribute('placeholder', val);
  });

  // Update rotating circular badge
  const badgeText = document.getElementById('rotating-badge-text');
  if (badgeText) badgeText.textContent = TRANSLATIONS[lang].hero.badgeText;

  // Update Ticker
  const t1 = document.getElementById('ticker-item-1');
  const t2 = document.getElementById('ticker-item-2');
  if (t1) t1.textContent = TRANSLATIONS[lang].ticker;
  if (t2) t2.textContent = TRANSLATIONS[lang].ticker;

  // Update Theme text
  updateThemeButtonUI();

  // Update Older Stations toggle button
  const toggleBtn = document.getElementById('btn-toggle-older-stations');
  const collapseBox = document.getElementById('older-stations-collapse');
  if (toggleBtn && collapseBox) {
    const isExpanded = collapseBox.classList.contains('expanded');
    toggleBtn.innerHTML = `<span>${isExpanded ? TRANSLATIONS[lang].erfahrung.toggleHide : TRANSLATIONS[lang].erfahrung.toggleShow}</span>`;
  }

  // Update CV download links to language-specific file
  const resumeFilename = lang === 'en' ? 'Bhushan_Patel_Resume.pdf' : 'Bhushan_Patel_Lebenslauf.pdf';
  document.querySelectorAll('.cv-download-btn').forEach(btn => {
    btn.setAttribute('href', `assets/${resumeFilename}`);
    btn.setAttribute('download', resumeFilename);
  });
}
window.setLanguage = setLanguage;

function getNestedTranslation(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
}

/* ==========================================================================
   15. RESUME / CV DOWNLOAD HANDLER
   ========================================================================== */
function initCvDownload() {
  document.querySelectorAll('.cv-download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isEnglish = currentLang === 'en';
      const filename = isEnglish ? 'Bhushan_Patel_Resume.pdf' : 'Bhushan_Patel_Lebenslauf.pdf';
      btn.setAttribute('href', `assets/${filename}`);
      btn.setAttribute('download', filename);
    });
  });
}
