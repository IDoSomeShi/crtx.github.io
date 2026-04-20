export function initCards() {
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
}