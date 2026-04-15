import {
  GBIFdetailInfo,
  GBIFOuterBox,
} from "../../sharedObject/typeDeffinition.ts";

export function modifyGBIFData(rawGBIFData: GBIFOuterBox): GBIFOuterBox {
  const GBIFResult: GBIFdetailInfo[] = rawGBIFData.results.map(
    (n: any): GBIFdetailInfo => ({
      key: n.key,
      kingdom: n.kingdom,
      species: n.species,
      year: n.year,
      month: n.month,
      day: n.day,
      gbifID: n.gbifID,
      isWild: n["http://unknown.org/captive_cultivated"],
      occurrenceID: n.occurrenceID,
    }),
  );

  const modifiedGBIFData = {
    ...rawGBIFData,
    results: GBIFResult,
  };
  return modifiedGBIFData;
}
