export function initBoot() {
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
}