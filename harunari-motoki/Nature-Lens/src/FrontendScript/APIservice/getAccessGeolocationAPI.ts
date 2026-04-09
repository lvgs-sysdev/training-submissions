import { GeolocationAPIResponse } from "../../sharedObject/typeDiffinition.ts";

function getPositionPromise(
  options: PositionOptions,
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      options,
    );
  });
}

export async function getAccessGeolocationAPI() {
  if (!navigator.geolocation) {
    const returnItems: GeolocationAPIResponse = {
      status: "error",
      message: "お使いのブラウザは位置情報に対応していません",
    };
    return returnItems;
  }
  const options = {
    enableHighAccuracy: true,
    timeout: 10000, //単位ms
    maxiumAge: 0, //キャッシュされた位置情報は使わない
  };

  try {
    const position = await getPositionPromise(options);
    const { latitude, longitude } = position.coords;
    let returnItems: GeolocationAPIResponse = {
      status: "success",
      data: { latitude: latitude, longitude: longitude },
    };
    return returnItems;
  } catch (error: any) {
    switch (error.code) {
      case error.TIMEOUT:
        let returnItems: GeolocationAPIResponse = {
          status: "error",
          message: "タイムアウトしました。電波のいい場所で再度試してください",
        };
        return returnItems;
      case error.PERMISSION_DENIED:
        returnItems = {
          status: "error",
          message: "位置情報の利用が許可されていません。",
        };
        return returnItems;
      case error.POSITION_UNAVAILABLE:
        returnItems = {
          status: "error",
          message: "位置情報が利用できません。",
        };
        return returnItems;
    }
    let returnItems: GeolocationAPIResponse = {
      status: "error",
      message: "原因不明のエラーです。",
    };

    return returnItems;
  }
}

//testはブラウザのコンソール上で実行する
