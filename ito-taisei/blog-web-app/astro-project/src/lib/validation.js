const USER_NAME_MAX = 255;
const USER_ID_MAX = 20;
const PASS_MAX = 255;
const PASS_MIN = 8;

function validateUserId(user_id) {
  if (!user_id || user_id.length === 0) {
    return { field: 'user_id', error: '必須項目です。' };
  }
  if (user_id.length > USER_ID_MAX) {
    return { field: 'user_id', error: `ユーザーIDは${USER_ID_MAX}文字以内で入力してください。` };
  }
  return null;
}

function validatePassword(password) {
  if (!password || password.length === 0) {
    return { field: 'password', error: '必須項目です。' };
  }
  if (password.length > PASS_MAX) {
    return { field: 'password', error: `パスワードは${PASS_MAX}文字以内で入力してください。` };
  }
  if (password.length < PASS_MIN) {
    return { field: 'password', error: `パスワードは${PASS_MIN}文字以上で入力してください。` };
  }
  return null;
}

function validateUserName(user_name) {
  if (user_name && user_name.length > USER_NAME_MAX) {
    return { field: 'user_name', error: `ユーザー名は${USER_NAME_MAX}文字以内で入力してください。` };
  }
  return null;
}

// 新規登録用
export function validateUserForm({ user_name, user_id, password }) {
  return (
    validateUserId(user_id) ||
    validatePassword(password) ||
    validateUserName(user_name)
  );
}

// ログイン用
export function validateLoginForm({ user_id, password }) {
  return (
    validateUserId(user_id) ||
    validatePassword(password)
  );
}
