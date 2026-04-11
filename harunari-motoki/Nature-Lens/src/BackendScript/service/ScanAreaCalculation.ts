import { userGeolocationdata } from "../../sharedObject/typeDeffinition.ts";

export async function ScanAreaCalculation({
  latitude,
  longitude,
}: userGeolocationdata) {
  interface coordinate {
    lng: number;
    lat: number;
  }
  type PolygonCoord = coordinate[];
  const ScanArea: PolygonCoord = [];

  const PolygonNum: number = 8;

  for (let i = 0; i < PolygonNum; i++) {
    let angle = (360 / PolygonNum) * i;
    let radius = angle * (Math.PI / 180);
    let lng: number = longitude + 0.009 * Math.cos(radius);
    let lat: number = latitude + 0.009 * Math.sin(radius);
    let point: coordinate = { lng: lng, lat: lat };
    ScanArea.push(point);
  }
  ScanArea.push(ScanArea[0]); //最後に最初の一点を追加

  const vertexes = ScanArea.map((n) => `${n.lng} ${n.lat}`);
  const wktString = `POLYGON((${vertexes.join(",")}))`;

  console.log(wktString);
  return wktString;
}

//テストコード
// cd ../domain/scan/
// npx tsx ./scan.ts
// const testlocation: Location = {
//   longitude: 139.79695930100348,
//   latitude: 35.70046691514662,
// };

// ScanAreaCalculation(testlocation);
