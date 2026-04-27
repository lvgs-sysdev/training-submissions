import { userGeolocationdata } from "../../../library/scan/typeDeffinition.js";

export async function scanareaCalculation({
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
  ScanArea.push(ScanArea[0]);

  const vertexes = ScanArea.map((n) => `${n.lng} ${n.lat}`);
  const wktString = `POLYGON((${vertexes.join(",")}))`;

  console.log(wktString);
  return wktString;
}
