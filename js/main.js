const modules = [];

import { initCanvas } from "./modules/canvas.js";
import { initBoot } from "./modules/boot.js";
import { initNav } from "./modules/nav.js";
import { initCards } from "./modules/cards.js";
import { initAuth } from "./modules/auth.js";

const roadmapData = {
  aura: {
    title: "Aura — Core Foundation",
    theme: "Neon green, terminal style",
    goal: "Establish core framework and base UI",
    features: [
      "Runtime + modular system foundation",
      "Base UI with tabs: Chat, Debug, Files, System, Control",
      "Voice input (ALT hold)",
      "Module manager skeleton",
      "Theme system: Aura",
      "Logging & Debug system",
      "Startup animation + Pip-Boy visuals"
    ],
    notes: "Foundation phase—systems are placeholders but testable."
  },

  pulse: {
    title: "Pulse — Active Node Layer",
    theme: "Reactive UI, subtle animation",
    goal: "Make the system alive and responsive",
    features: [
      "Modules execute real functions",
      "Event-driven behavior",
      "Background processes",
      "UI upgrades (status bars, waveform)",
      "Dynamic logging",
      "Work interfaces (Dev, Modding, Security)"
    ],
    notes: "First real working stage."
  },

  halo: {
    title: "Halo — Expansion & Extensibility",
    theme: "Bright, expanding UI",
    goal: "Turn system into a modular platform",
    features: [
      "Drop-in plugin system",
      "Module marketplace (local → online)",
      "Dynamic UI per interface",
      "Multi-theme support",
      "Enhanced voice assistant",
      "External tool launching"
    ],
    notes: "Becomes a platform, not just a shell."
  },

  nova: {
    title: "Nova — Deep AI Integration",
    theme: "Energetic, intelligent UI",
    goal: "Make AI central",
    features: [
      "AI routes commands to modules",
      "Context awareness",
      "IDE + code assistant",
      "Integrated toolsets per interface",
      "UI panel output integration"
    ],
    notes: "AI becomes proactive."
  },

  phantom: {
    title: "Phantom — Automation Layer",
    theme: "Minimal, stealthy",
    goal: "Automated workflows",
    features: [
      "Task chains",
      "Voice-triggered routines",
      "Pipeline execution",
      "Advanced logging + monitoring",
      "Module-to-module triggers"
    ],
    notes: "Autopilot phase."
  },

  eclipse: {
    title: "Eclipse — Unified Ecosystem",
    theme: "Polished, sleek",
    goal: "Stable release",
    features: [
      "Multi-interface integration",
      "Multi-language modules",
      "Theme switching",
      "Full voice system",
      "Installer + updater",
      "Complete plugin ecosystem"
    ],
    notes: "First real stable release."
  }
};

const roadmapThemes = {
  aura: {
    color: "#00ff9c",
    glow: "0 0 25px #00ff9c",
    bg: "rgba(0,255,156,0.05)",
    particleType: "grid"
  },

  pulse: {
    color: "#00ffd0",
    glow: "0 0 30px #00ffd0",
    bg: "rgba(0,255,200,0.05)",
    particleType: "pulse"
  },

  halo: {
    color: "#aaff00",
    glow: "0 0 40px #aaff00",
    bg: "rgba(170,255,0,0.05)",
    particleType: "burst"
  },

  nova: {
    color: "#00ccff",
    glow: "0 0 50px #00ccff",
    bg: "rgba(0,200,255,0.05)",
    particleType: "flow"
  },

  phantom: {
    color: "#aa00ff",
    glow: "0 0 20px #aa00ff",
    bg: "rgba(170,0,255,0.05)",
    particleType: "fog"
  },

  eclipse: {
    color: "#8888ff",
    glow: "0 0 35px #8888ff",
    bg: "rgba(120,120,255,0.05)",
    particleType: "orbit"
  }
};

function registerModule(name, initFn) {
  modules.push({ name, initFn });
}

window.setUserRole = (role) => {
  localStorage.setItem("synaura_role", role);
  adminView("users");
};

window.isAdmin = () => {
  return localStorage.getItem("synaura_role") === "admin";
};

window.saveData = () => {
  try {
    const data = JSON.parse(document.getElementById("dataEditor").value);

    Object.keys(data).forEach(k => {
      localStorage.setItem(k, data[k]);
    });

    alert("Saved");
  } catch {
    alert("Invalid JSON");
  }
};

window.toggleModuleBackend = async (name) => {
  await fetch("http://localhost:3000/api/modules/toggle", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name })
  });

  adminView("modules");
};

window.installModuleBackend = async (name) => {
  await fetch("http://localhost:3000/api/modules/install", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name })
  });

  adminView("modules");
};

window.loginUser = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    alert("Login failed");
    return;
  }

  const data = await res.json();

  localStorage.setItem("synaura_auth", "true");
  localStorage.setItem("synaura_role", data.role);
  localStorage.setItem("synaura_user", username);

  window.location.href = "index.html";
};

window.installModule = () => {
  const name = document.getElementById("newModule").value;

  let modules = JSON.parse(localStorage.getItem("installed") || "[]");

  modules.push({ name, enabled: true });

  localStorage.setItem("installed", JSON.stringify(modules));

  adminView("modules");
};

window.toggleAdmin = () => {
  const panel = document.getElementById("adminPanel");
  if (!panel) return;

  if (!isAdmin()) {
    alert("Admin only");
    return;
  }

  panel.classList.toggle("hidden");
};

const logs = [];

["log", "warn", "error"].forEach(type => {
  const original = console[type];

  console[type] = (...args) => {
    logs.push({ type, message: args.join(" ") });
    original(...args);
  };
});

window.toggleModule = (name) => {
  let modules = JSON.parse(localStorage.getItem("installed") || "[]");

  modules = modules.map(m =>
    m.name === name ? { ...m, enabled: !m.enabled } : m
  );

  localStorage.setItem("installed", JSON.stringify(modules));
  renderModules();
};

window.runQuickCommand = () => {
  const cmd = document.getElementById("quickCmd").value;

  if (cmd === "reload") location.reload();
  if (cmd === "clear") logs.length = 0;
  if (cmd === "admin") localStorage.setItem("synaura_role","admin");

  console.log("Executed:", cmd);
};

window.initAdminPage = () => {
  const auth = localStorage.getItem("synaura_auth");
  const role = localStorage.getItem("synaura_role");

  if (auth !== "true" || role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  adminView("overview");
};

window.runAdminCommand = () => {
  const cmd = document.getElementById("cmdInput").value;

  if (cmd === "reset") {
    localStorage.clear();
    location.reload();
  }

  if (cmd === "modules") {
    console.log(localStorage.getItem("installed"));
  }

  if (cmd === "admin") {
    localStorage.setItem("synaura_role", "admin");
  }

  console.log("Command:", cmd);
};

window.adminView = (view) => {
  const el = document.getElementById("adminView");
  if (!el) return;

  switch (view) {

    case "overview":
      el.innerHTML = `
        <h2>System Overview</h2>
        <p>User: ${localStorage.getItem("synaura_user")}</p>
        <p>Role: ${localStorage.getItem("synaura_role")}</p>
      `;
      break;

    case "modules":
      fetch("http://localhost:3000/api/modules")
        .then(r => r.json())
        .then(mods => {
          el.innerHTML = `
            <h2>Modules</h2>

            ${mods.map(m => `
              <div>
                ${m.name} (${m.enabled ? "ON" : "OFF"})
                <button onclick="toggleModuleBackend('${m.name}')">Toggle</button>
              </div>
            `).join("")}
          `;
        });
      break;

    case "users":
      el.innerHTML = `
        <h2>User Control</h2>
        <button onclick="setUserRole('admin')">Admin</button>
        <button onclick="setUserRole('user')">User</button>
      `;
      break;

    case "data":
      el.innerHTML = `
        <h2>Data</h2>
        <pre>${JSON.stringify(localStorage, null, 2)}</pre>
      `;
      break;

    case "commands":
      el.innerHTML = `
        <h2>Commands</h2>
        <input id="cmdInput">
        <button onclick="runAdminCommand()">Run</button>
      `;
      break;
  }
};

window.openRoadmap = (version) => {
  const data = roadmapData[version];
  if (!data) return;

  let scene = document.getElementById("roadmapScene");

  if (!scene) {
    scene = document.createElement("div");
    scene.id = "roadmapScene";
    document.body.appendChild(scene);
  }

  scene.innerHTML = `
    <canvas id="sceneCanvas"></canvas>

    <div class="scene-content">

      <div class="scene-header">
        <h1>${data.title}</h1>
        <button onclick="closeRoadmap()">✕</button>
      </div>

      <div class="scene-body">
        <p><strong>Theme:</strong> ${data.theme}</p>
        <p><strong>Goal:</strong> ${data.goal}</p>

        <h3>Features</h3>
        <ul>
          ${data.features.map(f => `<li>${f}</li>`).join("")}
        </ul>

        <p class="notes">${data.notes}</p>
      </div>

    </div>
  `;

  const theme = roadmapThemes[version];

  scene.className = `active ${version}`;
  scene.style.setProperty("--main-color", theme.color);

  startSceneParticles(version);
};

window.closeRoadmap = () => {
  const scene = document.getElementById("roadmapScene");
  if (scene) scene.classList.remove("active");
};

window.runCommand = () => {
  const cmd = document.getElementById("cmdInput").value;

  if (cmd === "clear") {
    logs.length = 0;
  }

  if (cmd === "modules") {
    console.log(localStorage.getItem("installed"));
  }

  if (cmd === "logout") {
    logout();
  }

  renderLogs();
};

window.showAdminTab = (tab) => {
  const el = document.getElementById("adminContent");
  if (!el) return;

  switch (tab) {
    case "dashboard":
      el.innerHTML = `<h3>Dashboard</h3>`;
      break;

    case "users":
      el.innerHTML = `
        <h3>Users</h3>
        <p>${localStorage.getItem("synaura_user")}</p>
      `;
      break;

    case "modules":
      renderModules();
      break;

    case "storage":
      el.innerHTML = `
        <h3>Storage</h3>
        <pre>${JSON.stringify(localStorage, null, 2)}</pre>
      `;
      break;

    case "security":
      el.innerHTML = `
        <h3>Security</h3>
        <button onclick="logout()">Logout</button>
      `;
      break;

    case "console":
      el.innerHTML = `
        <h3>Console</h3>
        <div id="logOutput" class="admin-logs"></div>

        <textarea id="cmdInput"></textarea>
        <button onclick="runCommand()">Run</button>
      `;
      renderLogs();
      break;
  }
};

window.promoteAdmin = () => {
  localStorage.setItem("synaura_role", "admin");
  alert("User is now admin");
};

registerModule("auth", initAuth);
registerModule("canvas", initCanvas);
registerModule("adminUI", injectAdminPanel);

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.visibility = "visible";
  document.body.style.opacity = "1";
  document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "Z") {
    e.preventDefault(); // stop browser behavior
    window.toggleAdmin();
  }
});

  modules.forEach((mod) => {
    try {
      mod.initFn();
      console.log(`[MODULE LOADED] ${mod.name}`);
    } catch (err) {
      console.warn(`[MODULE FAILED] ${mod.name}`, err);
    }
  });
});

// =========================
// SCROLL BUTTON
// =========================
function scrollToSection() {
    const section = document.querySelector("#about");
    if (section) section.scrollIntoView({ behavior: "smooth" });
}

// =========================
// DOCS SYSTEM
// =========================
function openDoc(type, el) {

    const content = {

        "getting-started": {
            title: "Getting Started",
            body: `
            <div class="doc-section">
                <h3>Install</h3>
                <pre><code>git clone your-repo
cd ai_os
python main.py</code></pre>
            </div>
            `
        },

        "node-system": {
            title: "Node System",
            body: `
            <div class="doc-section">
                <h3>Overview</h3>
                <p>Nodes are modular extensions.</p>
            </div>
            `
        },

        "api": {
            title: "API",
            body: `
            <div class="doc-section">
                <h3>Status</h3>
                <p>In development</p>
            </div>
            `
        }

    };

    const doc = content[type];
    if (!doc) return;

    const title = document.getElementById("docTitle");
    const body = document.getElementById("docBody");

    if (!title || !body) return;

    title.innerText = doc.title;
    body.innerHTML = doc.body;
}

// =========================
// COPY BUTTONS
// =========================
function addCopyButtons() {
    document.querySelectorAll("pre").forEach(block => {

        if (block.querySelector(".copy-btn")) return;

        const btn = document.createElement("button");
        btn.innerText = "Copy";
        btn.className = "copy-btn";

        btn.onclick = () => {
            navigator.clipboard.writeText(block.innerText);
            btn.innerText = "Copied!";
            setTimeout(() => btn.innerText = "Copy", 1000);
        };

        block.appendChild(btn);
    });
}

// =========================
// AUTH
// =========================
function checkAuth(page) {
    const auth = localStorage.getItem("synaura_auth");

    if (auth === "true") {
        window.location.href = page;
    } else {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("synaura_auth");
    window.location.href = "login.html";
}

function requireAuth() {
  const auth = localStorage.getItem("synaura_auth");

  if (auth !== "true") {
    window.location.href = "login.html";
  }
}

window.requireAuth = requireAuth;

// =========================
// BOOT SYSTEM
// =========================
registerModule("boot", () => {
    const boot = document.getElementById("boot");
    const bootText = document.getElementById("bootText");
    if (!boot || !bootText) return;

    const lines = [
        "Initializing SynAura...",
        "Loading CORE...",
        "Linking NODE modules...",
        "Activating SCALE...",
        "System Ready."
    ];

    let i = 0;

    function type() {
        if (i < lines.length) {
            bootText.innerHTML += lines[i] + "\n";
            i++;
            setTimeout(type, 250);
        } else {
            boot.style.opacity = "0";
            setTimeout(() => boot.style.display = "none", 500);
        }
    }

    type();
});


// =========================
// NAV + TRANSITIONS
// =========================
registerModule("nav", () => {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#")) return;

            e.preventDefault();
            document.body.style.opacity = "0";

            setTimeout(() => {
                window.location.href = href;
            }, 200);
        });
    });
});


// =========================
// CARD ANIMATIONS
// =========================
registerModule("cards", () => {
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(el => {
        el.classList.add("fade-in");
        observer.observe(el);
    });
});

window.checkAuth = checkAuth;
window.scrollToSection = scrollToSection;
window.logout = logout;
window.goHome = () => {
  window.location.href = "index.html";
};

function handleAuthProtection() {
  const protectedPages = ["marketplace.html", "profiles.html"];
  const current = window.location.pathname.split("/").pop();

  if (protectedPages.includes(current)) {
    const auth = localStorage.getItem("synaura_auth");

    if (auth !== "true") {
      window.location.href = "login.html";
    }
  }
}

registerModule("authGuard", handleAuthProtection);

function injectAdminPanel() {
  if (document.getElementById("adminPanel")) return;

  const panel = document.createElement("div");
  panel.id = "adminPanel";
  panel.className = "hidden";

  panel.innerHTML = `
  <div class="admin-layout">

    <div class="admin-sidebar">
      <div class="admin-title">SynAura Admin</div>

      <button onclick="showAdminTab('dashboard')">Dashboard</button>
      <button onclick="showAdminTab('users')">Users</button>
      <button onclick="showAdminTab('modules')">Modules</button>
      <button onclick="showAdminTab('storage')">Storage</button>
      <button onclick="showAdminTab('security')">Security</button>
      <button onclick="showAdminTab('console')">Console</button>
    </div>

    <div class="admin-content" id="adminContent">
    </div>

  </div>
`;

  Object.assign(panel.style, {
  position: "fixed",
  top: "0",
  left: "0",
  width: "600px",
  height: "65vh",
  background: "#050505",
  borderRight: "2px solid #00ff9c",
  zIndex: "9999",
  color: "#00ff9c",
  fontFamily: "monospace",
  boxShadow: "0 0 40px rgba(0,255,156,0.2)"
});

  document.body.appendChild(panel);

  updateAdminPanel();
}

function updateAdminPanel() {
  const user = localStorage.getItem("synaura_user") || "none";
  const role = localStorage.getItem("synaura_role") || "none";

  const modules = JSON.parse(localStorage.getItem("installed") || "[]");

  const userEl = document.getElementById("adminUser");
  const roleEl = document.getElementById("adminRole");
  const modEl = document.getElementById("adminModules");

  if (userEl) userEl.innerText = user;
  if (roleEl) roleEl.innerText = role;

  if (modEl) {
    modEl.innerHTML = modules.map(m => `
      <div style="margin-bottom:6px;">
        ${m}
        <button onclick="removeModule('${m}')">x</button>
      </div>
    `).join("");
  }
}

function renderModules() {
  const el = document.getElementById("adminContent");

  const modules = JSON.parse(localStorage.getItem("installed") || "[]");

  el.innerHTML = `
    <h3>Modules</h3>

    ${modules.map(m => `
      <div class="admin-module">
        ${m.name}
        <button onclick="toggleModule('${m.name}')">
          ${m.enabled ? "Disable" : "Enable"}
        </button>
        <button onclick="removeModule('${m.name}')">X</button>
      </div>
    `).join("")}
  `;
}

function startSystemMonitor() {
  const modEl = document.getElementById("modCount");
  const memEl = document.getElementById("memUsage");
  const fpsEl = document.getElementById("fps");

  let last = performance.now();
  let frames = 0;

  function loop() {
    frames++;

    const now = performance.now();
    if (now - last >= 1000) {
      if (fpsEl) fpsEl.innerText = frames + " fps";
      frames = 0;
      last = now;
    }

    if (modEl) {
      const mods = JSON.parse(localStorage.getItem("installed") || "[]");
      modEl.innerText = mods.length;
    }

    if (memEl && performance.memory) {
      memEl.innerText =
        Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB";
    }

    requestAnimationFrame(loop);
  }

  loop();
}

function renderLogs() {
  const el = document.getElementById("logOutput");
  if (!el) return;

  el.innerHTML = logs.map(l => `
    <div style="color:${
      l.type === "error" ? "red" :
      l.type === "warn" ? "yellow" : "#00ff9c"
    }">
      [${l.type}] ${l.message}
    </div>
  `).join("");
}

function renderAdminModules() {
  const el = document.getElementById("adminView");

  const modules = JSON.parse(localStorage.getItem("installed") || "[]");

  el.innerHTML = `
    <h2>Module Control</h2>

    ${modules.map(m => `
      <div class="admin-module">
        ${m.name || m}

        <button onclick="toggleModule('${m.name || m}')">
          Toggle
        </button>

        <button onclick="loadModule('${m.name || m}')">
          Run
        </button>
      </div>
    `).join("")}
  `;
}

function renderActiveModules() {
  const mods = JSON.parse(localStorage.getItem("installed") || "[]");

  return mods.map(m => `
    <div>
      ${m.name}
      <button onclick="toggleModule('${m.name}')">
        ${m.enabled ? "ON" : "OFF"}
      </button>
    </div>
  `).join("");
}

function startRoadmapParticles(version) {
  const canvas = document.getElementById("roadmapCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const theme = roadmapThemes[version];

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let particles = [];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5,
      size: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.color;

    particles.forEach(p => {

      // 🔥 DIFFERENT BEHAVIOR PER VERSION
      switch (theme.particleType) {

        case "grid":
          p.y += 0.3;
          if (p.y > canvas.height) p.y = 0;
          break;

        case "pulse":
          p.x += Math.sin(Date.now() * 0.002);
          break;

        case "burst":
          p.x += p.vx * 3;
          p.y += p.vy * 3;
          break;

        case "flow":
          p.x += Math.cos(p.y * 0.01);
          p.y += 0.5;
          break;

        case "fog":
          p.x += p.vx * 0.2;
          p.y += p.vy * 0.2;
          break;

        case "orbit":
          p.x += Math.cos(Date.now() * 0.001 + p.y);
          p.y += Math.sin(Date.now() * 0.001 + p.x);
          break;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

function animateTimeline() {
  const steps = document.querySelectorAll(".step");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));
}

document.addEventListener("DOMContentLoaded", () => {
  animateTimeline();
});