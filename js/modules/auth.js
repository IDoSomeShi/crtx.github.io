export function initAuth() {

    // LOGIN
    window.loginUser = () => {
        const username = document.getElementById("user")?.value;
        const password = document.getElementById("pass")?.value;

        if (!username || !password) {
            alert("Enter username and password");
            return;
        }

        // simple demo auth (you can replace later)
        localStorage.setItem("synaura_role", "admin");

        window.location.href = "index.html";
    };

    // REGISTER
    window.registerUser = () => {
        const username = document.getElementById("user")?.value;
        const password = document.getElementById("pass")?.value;

        if (!username || !password) {
            alert("Enter username and password");
            return;
        }

        // store fake user (for now)
        localStorage.setItem("synaura_user", username);
        localStorage.setItem("synaura_auth", "true");

        window.location.href = "index.html";
    };
}