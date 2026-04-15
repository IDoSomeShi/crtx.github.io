document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // BOOT (SMOOTH FADE)
    // =========================
    const boot = document.getElementById("boot");
    const bootText = document.getElementById("bootText");

    const lines = [
        "Initializing SynAura...",
        "Loading CORE...",
        "Linking NODE modules...",
        "Activating SCALE...",
        "System Ready."
    ];

    if (boot && bootText) {
        let i = 0;

        function type() {
            if (i < lines.length) {
                bootText.innerHTML += lines[i] + "\n";
                i++;
                setTimeout(type, 280);
            } else {
                setTimeout(() => {
                    boot.style.opacity = "0";
                    boot.style.transition = "opacity 0.6s ease";

                    setTimeout(() => {
                        boot.style.display = "none";
                    }, 600);
                }, 400);
            }
        }

        type();
    }

    // =========================
    // SMOOTH SCROLL
    // =========================
    window.scrollToSection = function () {
        const firstSection = document.querySelector("#about");
        if (firstSection) {
            firstSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    // =========================
    // FADE-IN (CLEAN + RELIABLE)
    // =========================
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".card").forEach(el => {
        el.classList.add("fade-in");
        observer.observe(el);
    });

    // =========================
    // NAV ACTIVE TRACKING (FIXED)
    // =========================
    const navLinks = document.querySelectorAll(".nav-link");

    function updateActiveNav() {
        let scrollPos = window.scrollY + 120;

        navLinks.forEach(link => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            const section = document.querySelector(href);
            if (!section) return;

            if (
                section.offsetTop <= scrollPos &&
                section.offsetTop + section.offsetHeight > scrollPos
            ) {
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav);

    // =========================
    // NEURAL BACKGROUND (STABLE)
    // =========================
    const canvas = document.getElementById("bannerCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    let nodes = [];
    let mouse = { x: null, y: null };

    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
        }

        move() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "#00ff9c";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#00ff9c";
            ctx.fill();
        }
    }

    for (let i = 0; i < 90; i++) {
        nodes.push(new Node());
    }

    function connect() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                let dx = nodes[i].x - nodes[j].x;
                let dy = nodes[i].y - nodes[j].y;
                let dist = dx * dx + dy * dy;

                if (dist < 13000) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = "rgba(0,255,156,0.06)";
                    ctx.stroke();
                }
            }

            // subtle mouse interaction (NO BIG CIRCLE BUG)
            if (mouse.x !== null) {
                let dx = nodes[i].x - mouse.x;
                let dy = nodes[i].y - mouse.y;
                let dist = dx * dx + dy * dy;

                if (dist < 15000) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = "rgba(0,255,156,0.15)";
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        nodes.forEach(n => {
            n.move();
            n.draw();
        });

        connect();

        requestAnimationFrame(animate);
    }

    animate();
});