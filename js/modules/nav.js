export function initNav() {
    const links = document.querySelectorAll(".nav-link");
    if (!links.length) return;

    links.forEach(link => {
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
}