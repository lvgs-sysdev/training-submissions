//テストコード
//手順
// ターミナルでディレクトリ移動
/// Nature-Lends/src/BackendScript/service/scan/　で実施
//実行コマンド　npx tsx ./scan.ts
//schemaで正確な値が来ていることを保証しているので、値が出てくることを確認できれば良い
//GeoGebraでざっくり８角形ができていることを確認する

import { userGeolocationdata } from "../../../src/library/scan/typeDeffinition.ts";
import { ScanAreaCalculation } from "../../../src/BackendScript/service/scan/ScanAreaCalculation.ts";

const testlocation: userGeolocationdata = {
  longitude: 140,
  latitude: 40,
};

const result = ScanAreaCalculation(testlocation);
console.log(result);

const testlocationZero: userGeolocationdata = {
  longitude: -122,
  latitude: -50,
};

const resultZero = ScanAreaCalculation(testlocationZero);
console.log(resultZero);
