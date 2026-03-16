"use client";

import { useState } from "react";

export default function useSelectableTab(selectedTypeList?: string[]) {
  if (!selectedTypeList || selectedTypeList.length === 0) {
    const typeList = ["all", "favorite"];

    const [selectedType, setSelectedType] = useState<string>(typeList[0]);

    return { selectedType, setSelectedType };
  }

  const [selectedType, setSelectedType] = useState<string>(selectedTypeList[0]);

  return { selectedType, setSelectedType };
}
