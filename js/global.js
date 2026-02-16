console.log("Global JS Loaded");

document.addEventListener("DOMContentLoaded", function () {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.className = "dark";
    } 
    else if (savedTheme === "light") {
        document.body.className = "light";
    } 
    else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.body.className = prefersDark ? "dark" : "light";
    }

});

function toggleTheme() {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
        html.className = "light";
        localStorage.setItem("theme", "light");
    } else {
        html.className = "dark";
        localStorage.setItem("theme", "dark");
    }
}
