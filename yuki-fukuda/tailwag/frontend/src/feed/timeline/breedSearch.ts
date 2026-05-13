import { PostApi } from "../../utils/api";
import { Breed } from "../posts/type";

let allBreeds: Breed[] = [];
export let selectedBreeds: Breed[] = [];

export const initBreedSearch = async () => {
  const datalist = document.getElementById("breed-options");
  const input = document.getElementById(
    "breed-search-input",
  ) as HTMLInputElement;
  if (!datalist || !input) return;

  allBreeds = await PostApi.fetchBreeds();
  datalist.innerHTML = allBreeds
    .map((b) => `<option value="${b.name}">`)
    .join("");

  input.oninput = () => {
    const breed = allBreeds.find((b) => b.name === input.value);
    if (breed && !selectedBreeds.some((s) => s.id === breed.id)) {
      selectedBreeds.push(breed);
      renderBreedTags();
      input.value = "";
    }
  };
};

const renderBreedTags = () => {
  const container = document.getElementById("selected-breeds-tags");
  if (!container) return;

  container.innerHTML = selectedBreeds
    .map(
      (b) => `
    <span class="breed-tag-badge"># ${b.name} <span class="remove-tag" data-id="${b.id}">×</span></span>
  `,
    )
    .join("");

  container.querySelectorAll(".remove-tag").forEach((el) => {
    (el as HTMLElement).onclick = () => {
      selectedBreeds = selectedBreeds.filter(
        (b) => b.id !== Number(el.getAttribute("data-id")),
      );
      renderBreedTags();
    };
  });
};

export const clearSelectedBreeds = () => {
  selectedBreeds = [];
  renderBreedTags();
};
