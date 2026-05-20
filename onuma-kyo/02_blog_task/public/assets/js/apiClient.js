export const post = async (apiEndpoint, dataBody) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataBody),
    });

    console.log(res);
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      return data;
    }
    if (data.error) {
      return data;
    }
    // catchの中で一緒に処理するために例外をスロー
    throw new Error(`${res.status} ${res.statusText}`);
  } catch (error) {
    console.error('Error:', error);
    return {
      error: error,
      message: ['予期しないエラーが発生しました'],
    };
  }
};

export const get = async (apiEndpoint) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: 'GET',
    });

    console.log(res);
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      return data;
    }
    if (data.error) {
      return data;
    }
    // catchの中で一緒に処理するために例外をスロー
    throw new Error(`${res.status} ${res.statusText}`);
  } catch (error) {
    console.error('Error:', error);
    return {
      error: error,
      message: ['予期しないエラーが発生しました'],
    };
  }
};

export const put = async (apiEndpoint, dataBody, csrfToken) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(dataBody),
    });

    console.log(res);
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      return data;
    }
    if (data.error) {
      return data;
    }
    // catchの中で一緒に処理するために例外をスロー
    throw new Error(`${res.status} ${res.statusText}`);
  } catch (error) {
    console.error('Error:', error);
    return {
      error: error,
      message: ['予期しないエラーが発生しました'],
    };
  }
};
