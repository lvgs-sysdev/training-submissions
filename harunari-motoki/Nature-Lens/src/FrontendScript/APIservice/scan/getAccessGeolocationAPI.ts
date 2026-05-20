import { GeolocationAPIResponse } from "../../../library/scan/typeDeffinition.js";

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
    };
    return returnItems;
  }
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maxiumAge: 0,
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
    if (error && typeof error === "object" && "code" in error) {
      const errorCode = (error as { code: number }).code;
      let returnItems: GeolocationAPIResponse = {
        status: "failure",
      };
      switch (errorCode) {
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          returnItems = {
            status: "failure",
            errorDetail: GeolocationPositionError.POSITION_UNAVAILABLE,
          };
          console.log("位置情報が利用できないメッセージをreturn前");
          return returnItems;
        case GeolocationPositionError.PERMISSION_DENIED:
          returnItems = {
            status: "failure",
            errorDetail: GeolocationPositionError.PERMISSION_DENIED,
          };
          console.log("許可されていないメッセージをreturn前");
          return returnItems;
        case GeolocationPositionError.TIMEOUT:
          returnItems = {
            status: "failure",
            errorDetail: GeolocationPositionError.TIMEOUT,
          };
          console.log("タイムアウトメッセージをreturn前");
          return returnItems;
        default:
          returnItems = {
            status: "failure",
          };
          return returnItems;
      }
    } else {
      let returnItems: GeolocationAPIResponse = {
        status: "failure",
      };
      return returnItems;
    }
  }
}
