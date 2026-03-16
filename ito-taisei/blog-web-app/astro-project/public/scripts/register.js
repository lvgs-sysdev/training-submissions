import { formValidation } from "/scripts/form-validation.js";
formValidation("register-button");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const res = await fetch("/api/register", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (data.success) {
    window.location.href = "/login";
  } else {
    alert(data.error);
  }
});
