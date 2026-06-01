// login・registerテキストボックスバリデーション
const USER_NAME_MAX = 255;
const USER_ID_MAX = 20;
const PASS_MAX = 255;
const PASS_MIN = 8;

export const ERROR_MESSAGES = {
    required: '必須項目です。',
    userNameTooLong: `ユーザー名は${USER_NAME_MAX}文字以内で入力してください。`,
    userIdTooLong: `ユーザーIDは${USER_ID_MAX}文字以内で入力してください。`,
    passwordTooLong: `パスワードは${PASS_MAX}文字以内で入力してください。`,
    passwordTooShort: `パスワードは${PASS_MIN}文字以上で入力してください。`,
};

export function formValidation(buttonId) {

    document.addEventListener('DOMContentLoaded', () => {

        const userNameInput = document.getElementById('user_name');
        const userIdInput = document.getElementById('user_id');
        const passwordInput = document.getElementById('password');
        const submitButton = document.getElementById(buttonId);

        if (!userIdInput || !passwordInput || !submitButton) { // login画面にはuserNameのinputが無いため省略
            return;
        }

        // バリデーションの状態を保存
        const validationState = {
            userName: !userNameInput,
            userId: false,
            password: false,
        };

        // ボタン制御
        function buttonValidityCheck() {
            const allValid = validationState.userName && 
                             validationState.userId && 
                             validationState.password;
            submitButton.disabled = !allValid;
        }

        // エラー表示・非表示制御
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

        const inputs = [userNameInput, userIdInput, passwordInput].filter(Boolean); // login画面にはuserNameのinputが無いためfilterで除外

        function handleInput() {

            const anyInputHasValue = inputs.some(input => input.value.length > 0);

            inputs.forEach(input => {
                const length = input.value.length;
                let isValid = false;
                
                clearError(input);

                if (length === 0) {
                    if (anyInputHasValue) {
                        showError(input, ERROR_MESSAGES.required);
                    }
                    isValid = false;

                } else {

                    if (input === userNameInput) {
                        if (length > USER_NAME_MAX) {
                            showError(input, ERROR_MESSAGES.userNameTooLong);
                        } else {
                            isValid = true;
                        }
                    
                    } else if (input === userIdInput) {
                        if (length > USER_ID_MAX) {
                            showError(input, ERROR_MESSAGES.userIdTooLong);
                        } else {
                            isValid = true;
                        }

                    } else if (input === passwordInput) {
                        if (length > PASS_MAX) {
                            showError(input, ERROR_MESSAGES.passwordTooLong);
                        } else if (length < PASS_MIN) {
                            showError(input, ERROR_MESSAGES.passwordTooShort);
                        } else {
                            isValid = true;
                        }
                    }
                }

                if (input === userNameInput) validationState.userName = isValid;
                if (input === userIdInput) validationState.userId = isValid;
                if (input === passwordInput) validationState.password = isValid;
            });

            buttonValidityCheck();
        }

        inputs.forEach(input => {
            input.addEventListener('input', handleInput);
        });

        buttonValidityCheck();
    });
}
