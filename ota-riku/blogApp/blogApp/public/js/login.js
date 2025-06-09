document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("login-block");
  setLoginStatus();

  async function setLoginStatus() {
    const response = await fetch("/api/login-status");
    const data = await response.json();
    const loggedIn = data.loggedIn;

    element.innerHTML = ``;
    console.log(`${element.innerHTML}`);
    if (loggedIn) {
      element.innerHTML = `
        <div class="login-status-container">
                  <a href="/user">
                    <img
                      src="/Image/icon/AngelaSaunder.jpg"
                      alt="AngelaSaunder"
                      class="userprofile-icon-aspect userprofile-icon"
                    />
                  </a>
                </div>
      `;
    } else {
      element.innerHTML = `
        <div class="login-button-container">
            <a href="/Login.html" class="login-text">Login</a>
            <a href="/RegistAccount.html" type="button" class="login-button"
              >Get Started</a
            >
          </div>
      `;
    }
  }
});
