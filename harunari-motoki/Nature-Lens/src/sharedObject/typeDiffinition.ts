//サーバサイドに届く位置データのバリデーションチェック
export const coordinateSchema = {
  body: {
    type: "object",
    required: ["latitude", "longitude"],
    properties: {
      latitude: {
        type: "number",
        minimum: -90,
        maximum: 90,
      },
      longitude: {
        type: "number",
        minimum: -180,
        maximum: 180,
      },
    },
  },
};

//クライアントサイドの位置データ型
export interface Location {
  longitude: number;
  latitude: number;
}

//GeolocationAPI接続関数からの返答用型
type GeolocationAPISuccess = {
  status: "success";
  data: { latitude: number; longitude: number };
};
type GeolocationAPIFailure = {
  status: "error";
  message: string;
};
export type GeolocationAPIResponse =
  | GeolocationAPISuccess
  | GeolocationAPIFailure;

// GBIFデータの外殻の型
export interface GBIFOuterBox {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count: number;
  results: GBIFdetailInfo[];
  facets: any[];
}

// GBIFの生物詳細データ部分の型
export interface GBIFdetailInfo {
  key: number;
  // scientificName: string;
  // scientificNameAuthorship: string;
  // acceptedScientificName: string;
  kingdom: string;
  // phylum: string;
  // order: string;
  // family: string;
  // genus: string;
  species: string;
  // genericName: string;
  // specificEpithet: string;
  // taxonomicStatus: string;
  // decimalLatitude: number;
  // decimalLongitude: number;
  // coordinateUncertaintyInMeters: number;
  // continent: string;
  // stateProvince: string;
  year: number;
  month: number;
  day: number;
  // eventDate: string;
  // references: string;
  // license: string;
  gbifID: string;
  occurrenceID: string;
  // taxonID: string;
  isWild: any; //"http://unknown.org/captive_cultivated":で外部APIに保存
  // identificationID: string;
} //将来項目としてコメントアウトで保持

export interface GBIFResult {
  count: number;
  data: GBIFdetailInfo[];
}

//Scan処理結果の型
type Applicable = {
  status: "Applicable";
  data: GBIFOuterBox;
  message: string;
};
type NotApplicable = {
  status: "NotApplicable";
  message: string;
};
export type scanedData = Applicable | NotApplicable;

// 最終表示データ型
type FinalScanSuccess = {
  status: "success";
  data: GBIFOuterBox;
};
type FinalScanFailure = {
  status: "failure";
  message: string;
};
export type FinalScanResult = FinalScanSuccess | FinalScanFailure;
