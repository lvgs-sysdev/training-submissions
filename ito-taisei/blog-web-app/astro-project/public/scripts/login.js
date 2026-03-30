import { formValidation } from "/scripts/form-validation.js";
formValidation("login-button");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const res = await fetch("/api/login", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const data = await res.json();

  if (data.success) {
    window.location.href = "/top";
  } else {
    alert(data.error);
  }
});
