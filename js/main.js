function scrollToSection() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
    });
}

window.addEventListener("load", () => {
    document.body.style.visibility = "visible";
    document.body.style.opacity = "1";
});