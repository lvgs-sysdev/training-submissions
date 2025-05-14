export const showAlert = (element) => {
    if (element) {
        element.classList.add('is-show');
    }
}

export const removeAlert = (element) => {
    if (element) {
        element.classList.remove('is-show');
    }
}