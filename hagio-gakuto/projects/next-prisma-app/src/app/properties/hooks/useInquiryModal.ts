"use client";

import { useState, useEffect, useMemo, useActionState, useRef } from "react";
import { useLoading } from "@/context/LoadingContext";
import { UnitDetail, UnitSummary } from "@/types/PropertyType";
import { InquiryCategory } from "@/types/PropertyMasterTypes";
import { getInquiryCategories } from "../actions/getInquiryCategories";
import { postInquiryAction } from "../actions/postInquiryAction";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";

/**
 * UnitDetail型またはUnitSummary型を受け取り、必ずUnitSummary型を返す変換関数
 * @param property - 変換対象の物件オブジェクト
 */
const convertToSummary = (property: UnitSummary | UnitDetail): UnitSummary => {
  if ("buildingName" in property && property.buildingName) {
    return property;
  }
  // 'buildingName' がなければUnitDetail型とみなし、UnitSummary型に変換する
  const detail = property as UnitDetail;
  const thumbnail = detail.allImages[0];

  return {
    id: detail.id,
    priceRent: detail.priceRent,
    areaSqm: detail.areaSqm,
    floor: detail.floor,
    buildingName: detail.building.name,
    address: detail.building.address,
    nearestStation: detail.building.nearestStation,
    walkToStation: detail.building.walkToStation,
    layout: detail.layout.name, // layoutオブジェクトから名称を抽出
    buildDate: detail.building.buildDate,
    thumbnailUrl: thumbnail ? thumbnail.imageUrl : null, // 見つかった画像のURL、なければnull
    isFavorite: detail.isFavorite,
    isInquiry: detail.isInquiry,
  };
};

interface UseInquiryModalProps {
  isOpen: boolean;
  properties: UnitSummary[] | UnitDetail;
  onSuccess: () => void;
}

export function useInquiryModal({
  isOpen,
  properties,
  onSuccess,
}: UseInquiryModalProps) {
  const { setIsLoading } = useLoading();
  const [categories, setCategories] = useState<InquiryCategory[]>([]);
  const successHandledRef = useRef(false);

  const [state, formAction] = useActionState(postInquiryAction, {
    message: null,
    errors: {},
    success: false,
  });

  const initialProperties = useMemo(() => {
    const propsAsArray = Array.isArray(properties) ? properties : [properties];
    const filtered = propsAsArray.filter((p) => !p.isInquiry);
    return filtered.map(convertToSummary);
  }, [properties]);

  const [displayProperties, setDisplayProperties] =
    useState<UnitSummary[]>(initialProperties);

  useEffect(() => {
    if (isOpen) {
      setDisplayProperties(initialProperties);
      const fetchCategories = async () => {
        setIsLoading(true);
        const data = await getInquiryCategories();
        setCategories(data);
        setIsLoading(false);
      };
      fetchCategories();
    }
  }, [isOpen, initialProperties, setIsLoading]);

  useEffect(() => {
    if (!isOpen) {
      successHandledRef.current = false;
      return;
    }
    if (state.success && !successHandledRef.current) {
      showSuccessToast(state.message || "お問い合わせを送信しました");
      onSuccess();
      successHandledRef.current = true;
    } else if (state.message && !state.success) {
      showErrorToast(state.message);
    }
  }, [state, onSuccess, isOpen]);

  const deletePropertyFromPreviewList = (id: number) => {
    if (displayProperties.length <= 1) {
      showErrorToast("１件以上の物件を選択してください。");
      return;
    }
    setDisplayProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories]
  );

  return {
    state,
    formAction,
    displayProperties,
    categoryOptions,
    deletePropertyFromPreviewList,
  };
}
