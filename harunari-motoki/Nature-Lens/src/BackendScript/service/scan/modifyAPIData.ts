import {
  GBIFdetailInfo,
  GBIFOuterBox,
} from "../../../library/scan/typeDeffinition";

export function modifyGBIFData(rawGBIFData: GBIFOuterBox): GBIFOuterBox {
  const alloedlicense = [
    "CC0_1_0",
    "CC_BY_4_0",
    "http://creativecommons.org/publicdomain/zero/1.0/legalcode",
    "http://creativecommons.org/licenses/by/4.0/legalcode",
  ];

  const filteredResults = rawGBIFData.results.filter((n: any) => {
    const hasMedia = n.media && n.media.length > 0;

    if (!hasMedia) {
      return true;
    } else {
      return alloedlicense.includes(n.license);
    }
  });
  const shuffledResults = [...filteredResults].sort(() => Math.random() - 0.5);

  const GBIFResult: GBIFdetailInfo[] = shuffledResults.map(
    (n: any): GBIFdetailInfo => ({
      key: n.key,
      scientificName: n.scientificName,
      kingdom: n.kingdom,
      phylum: n.phylum,
      order: n.order,
      family: n.family,
      genus: n.genus,
      species: n.species,
      year: n.year,
      month: n.month,
      day: n.day,
      gbifID: n.gbifID,
      isWild: n["http://unknown.org/captive_cultivated"] || "不明",
      media: n.media,
      license: n.license,
      rightsHolder: n.rightsHolder || "Unknown Holder",
      occurrenceID: n.occurrenceID,
    }),
  );

  const modifiedGBIFData = {
    ...rawGBIFData,
    results: GBIFResult,
  };
  return modifiedGBIFData;
}
