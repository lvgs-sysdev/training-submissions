// テキストエリアバリデーション
const MAX_LENGTH = 1000;
const MIN_LENGTH = 10;

export const ERROR_MESSAGES = {
    required: '必須項目です',
    tooLong: `本文は ${MAX_LENGTH} 文字以下で入力してください`,
    tooShort: `本文は ${MIN_LENGTH} 文字以上で入力してください`,
}

export function textAreaValidate() {
    document.addEventListener('DOMContentLoaded', () => {
        const textAreas = document.querySelectorAll('.textarea-group textarea');
        if (textAreas.length === 0) return;

        const validationState = new Map();

        function showError(inputElement, message) {
            clearError(inputElement);
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            inputElement.parentElement.appendChild(errorElement);
        }

        function clearError(inputElement) {
            const errorElement = inputElement.parentElement.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }

        function checkAllTextAreas() {
            let allValid = true;
            textAreas.forEach(area => {
                if (area.required && validationState.get(area) !== true) {
                    allValid = false;
                }
            });
            
            const event = new CustomEvent('validationChange', {
                detail: {
                    isValid: allValid,
                    source: 'textAreas'
                }
            });
            document.dispatchEvent(event);
        }

        textAreas.forEach(input => {
            input.addEventListener('input', () => {
                const length = input.value.length;
                let isValid = false;

                clearError(input);

                if (length === 0) {
                    if (input.required) {
                        showError(input, ERROR_MESSAGES.required);
                    } else {
                        isValid = true;
                    }
                } else if (length < MIN_LENGTH) {
                    showError(input, ERROR_MESSAGES.tooShort);
                } else if (length > MAX_LENGTH) {
                    showError(input, ERROR_MESSAGES.tooLong);
                } else {
                    isValid = true;
                }

                validationState.set(input, isValid);
                checkAllTextAreas();
            });

            if (input.value.length === 0 && input.required) {
                validationState.set(input, false);
            } else {
                validationState.set(input, true);
            }
        });

        checkAllTextAreas();
    });
}
