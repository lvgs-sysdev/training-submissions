
async function checkSessionAndSetClass() {
  const res = await fetch("/api/session");
  if (res.ok) {
    const data = await res.json();
    if (data.isLoggedIn) {
      document.documentElement.classList.add("is-logged-in");
    } else {
      document.documentElement.classList.remove("is-logged-in");
    }
  }
}

checkSessionAndSetClass();
