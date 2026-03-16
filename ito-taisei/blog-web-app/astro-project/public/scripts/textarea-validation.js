const MAX_LENGTH = 1000;
const MIN_LENGTH = 10;

export const ERROR_MESSAGES = {
  required: '必須項目です',
  tooLong: `本文は ${MAX_LENGTH} 文字以下で入力してください`,
  tooShort: `本文は ${MIN_LENGTH} 文字以上で入力してください`,
};

export function setupTextareaValidation(formParam = document, onValidityChange = () => {}) {
  const root = (formParam instanceof HTMLElement) ? formParam : document;
  const textAreas = Array.from(root.querySelectorAll('.textarea-group textarea'));
  if (textAreas.length === 0) {
    onValidityChange(true);
    return { teardown: () => {} };
  }

  const validationState = new Map();
  const touched = new WeakSet();
  let showAll = false;
  let submitAttempted = false;

  function dispatchValidationChange(isValid) {
    const evt = new CustomEvent('validationChange', { detail: { isValid, source: 'textAreas' }});
    document.dispatchEvent(evt);
    try { onValidityChange(!!isValid); } catch (e) {}
  }

  function showError(inputElement, message) {
    clearError(inputElement);
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    inputElement.parentElement.appendChild(errorElement);
    inputElement.setAttribute('aria-invalid', 'true');
  }

  function clearError(inputElement) {
    const errorElement = inputElement.parentElement.querySelector('.field-error');
    if (errorElement) errorElement.remove();
    inputElement.removeAttribute('aria-invalid');
  }

  function validateSingle(input, reveal = false) {
    clearError(input);
    const length = input.value.length;
    let isValid = false;

    if (length === 0) {
      if (reveal) {
        showError(input, ERROR_MESSAGES.required);
        isValid = false;
      } else {
        isValid = !input.required;
      }
    } else if (length < MIN_LENGTH) {
      showError(input, ERROR_MESSAGES.tooShort);
    } else if (length > MAX_LENGTH) {
      showError(input, ERROR_MESSAGES.tooLong);
    } else {
      isValid = true;
    }

    validationState.set(input, isValid);
    return isValid;
  }

  function validateAll(reveal = false) {
    let allValid = true;
    textAreas.forEach(area => {
      const revealThis = reveal || showAll || submitAttempted || touched.has(area);
      const ok = validateSingle(area, revealThis);
      if (!ok) allValid = false;
    });
    dispatchValidationChange(allValid);
    return allValid;
  }

  textAreas.forEach(input => {
    if (input.value.length === 0 && input.required) {
      validationState.set(input, false);
    } else {
      validationState.set(input, true);
    }

    input.addEventListener('input', () => {
      touched.add(input);
      if (!showAll) {
        showAll = true;
      }
      validateAll(true);
    });

    input.addEventListener('blur', () => {
      touched.add(input);
      showAll = true;
      validateAll(true);
    });
  });

  validateAll(false);

  return {
    forceShowAll: () => {
      submitAttempted = true;
      showAll = true;
      validateAll(true);
    },
    teardown: () => {
    }
  };
}
