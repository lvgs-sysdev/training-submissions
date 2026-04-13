import { GeolocationAPIResponse } from "../../sharedObject/typeDeffinition.ts";

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
      status: "failure",
      message: "お使いのブラウザは位置情報に対応していません",
    };
    return returnItems;
  }
  const options = {
    enableHighAccuracy: true,
    timeout: 3000, //単位ms
    maxiumAge: 0, //キャッシュされた位置情報は使わない
  };
  console.log("GeolocationAPIのtry-catch前");

  try {
    const position = await getPositionPromise(options);
    const { latitude, longitude } = position.coords;
    let returnItems: GeolocationAPIResponse = {
      status: "success",
      data: { latitude: latitude, longitude: longitude },
    };
    return returnItems;
  } catch (error: unknown) {
    if (
      error instanceof GeolocationPositionError ||
      (error as any).code !== undefined
    ) {
      const errorCode = (error as any).code;
      //エラーコードを返すのは良いが、エラーの内容を決めるのはコントローラの役割　言語をmodelで決めてしまうのはよくない
      let returnItems: GeolocationAPIResponse = {
        status: "failure",
        message: "switchに入る前に定義してエラー回避",
      };
      switch (errorCode) {
        case 3: //GeolocationPositionError.TIMEOUT:
          returnItems = {
            status: "failure",
            message: "タイムアウトしました。電波のいい場所で再度試してください",
          };
          console.log("タイムアウトメッセージをreturn前");
          return returnItems;
        case 1: //GeolocationPositionError.PERMISSION_DENIED:
          returnItems = {
            status: "failure",
            message: "位置情報の利用が許可されていません。",
          };
          console.log("許可されていないメッセージをreturn前");
          return returnItems;
        case 2: //GeolocationPositionError.POSITION_UNAVAILABLE:
          returnItems = {
            status: "failure",
            message: "位置情報が利用できません。",
          };
          console.log("位置情報不許可メッセージをreturn前");
          return returnItems;
        default:
          returnItems = {
            status: "failure",
            message: "原因不明のエラーです。",
          };
          return returnItems;
      }
    } else {
      let returnItems: GeolocationAPIResponse = {
        status: "failure",
        message: "原因不明のエラーです。",
      };
      return returnItems;
    }
  }
}

//testはブラウザのコンソール上で実行する
