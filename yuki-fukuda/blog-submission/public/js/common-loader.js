async function loadComponents() {
  const components = [
    { id: "header-placeholder", path: "/components/header.html" },
    { id: "footer-placeholder", path: "/components/footer.html" },
  ];

  for (const comp of components) {
    const el = document.getElementById(comp.id);
    if (el) {
      try {
        const response = await fetch(comp.path);
        const html = await response.text();
        el.innerHTML = html;
      } catch (err) {
        console.error(`${comp.path}の読み込みに失敗しました`, err);
      }
    }
  }

  if (window.checkLogin) {
    window.checkLogin();
  }

  document.dispatchEvent(new Event("componentLoaded"));
}

document.addEventListener("DOMContentLoaded", loadComponents);
