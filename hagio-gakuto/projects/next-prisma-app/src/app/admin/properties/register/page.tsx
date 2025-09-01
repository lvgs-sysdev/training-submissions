"use client";

import { TextInput } from "@/components/inputs/TextInput";
import { useAddress } from "../hooks/useAddress";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Form } from "@/components/form/Form";
import { useActionState } from "react";
import { propertyRegisterAction } from "./actions/propertyRegisterAction";

export default function PropertyUpsertPage() {
  const {
    zipcode,
    handleZipcodeChange,
    prefecture,
    city,
    setCity,
    street,
    setStreet,
    error,
    setPrefecture,
  } = useAddress();
  const [state, formAction] = useActionState(propertyRegisterAction, {
    message: null,
    errors: {},
    success: false,
  });

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="space-y-6">
          <Form action={formAction} buttonText="物件登録" formTitle="物件登録">
            <TextInput
              name="name"
              label="物件名"
              placeholder="スクランブルスクエア"
              rules={[
                (v) => (!v ? "物件名は必須です" : undefined),
                (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
                (v) =>
                  v.length > 50 ? "50文字以下で入力してください" : undefined,
              ]}
            />

            <SelectInput
              name="type"
              label="物件種別"
              options={[{ value: "a", label: "a" }]}
              // rules={[(v) => (!v ? "物件種別は必須です" : undefined)]}
            />
            <div className="flex gap-2 items-center">
              <TextInput
                name="price_rent"
                label="家賃"
                placeholder="100000"
                rules={[
                  (v) => (!v ? "家賃は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 9 ? "9桁以下で入力してください" : undefined,
                ]}
              />
              <span className="font-bold">円</span>
            </div>

            <TextInput
              name="zipcode"
              label="郵便番号 (ハイフンなし7桁)"
              placeholder="0123456"
              rules={[
                (v) => (!v ? "郵便番号は必須です" : undefined),
                (v) => (v.length !== 7 ? "7文字で入力してください" : undefined),
              ]}
              value={zipcode}
              onChange={handleZipcodeChange}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

            <TextInput
              name="prefecture"
              label="都道府県"
              placeholder="東京都"
              rules={[
                (v) => (!v ? "都道府県は必須です" : undefined),
                (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
                (v) =>
                  v.length > 50 ? "50文字以下で入力してください" : undefined,
              ]}
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
            />
            <TextInput
              name="city"
              label="市区町村"
              placeholder="市区町村"
              rules={[
                (v) => (!v ? "市区町村は必須です" : undefined),
                (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
                (v) =>
                  v.length > 50 ? "50文字以下で入力してください" : undefined,
              ]}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <TextInput
              name="street"
              label="町域・番地"
              placeholder="町域・番地"
              rules={[
                (v) => (!v ? "町域・番地は必須です" : undefined),
                (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
                (v) =>
                  v.length > 50 ? "50文字以下で入力してください" : undefined,
              ]}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <TextInput
              name="nearest_station"
              label="最寄り駅"
              placeholder="渋谷駅"
              rules={[
                (v) => (!v ? "最寄り駅は必須です" : undefined),
                (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
                (v) =>
                  v.length > 50 ? "50文字以下で入力してください" : undefined,
              ]}
            />
            <div className="flex gap-2 items-center">
              <TextInput
                name="walk_to_station"
                label="最寄り駅までの所要時間(分)"
                placeholder="5"
                rules={[
                  (v) => (!v ? "最寄り駅までの所要時間は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 3 ? "3桁以下で入力してください" : undefined,
                ]}
              />
              <span className="font-medium">分</span>
            </div>
            <div className="flex gap-2 items-center">
              <TextInput
                name="area_sqm"
                label="面積(平方メートル)"
                placeholder="30.0"
                rules={[
                  (v) => (!v ? "面積は必須です" : undefined),
                  (v) =>
                    !/^[0-9]+(\.[0-9]+)?$/.test(v)
                      ? "半角数字か小数で入力してください"
                      : undefined,
                  (v) =>
                    v.length > 10 ? "10文字以下で入力してください" : undefined,
                ]}
              />
              <span className="">㎡</span>
            </div>

            <SelectInput
              name="layout"
              label="間取り"
              options={[{ value: "1R", label: "1R" }]}
              // rules={[(v) => (!v ? "間取りは必須です" : undefined)]}
            />
            <div className="flex gap-2 items-center">
              <TextInput
                name="age_years"
                label="築年数"
                placeholder="30"
                rules={[
                  (v) => (!v ? "築年数は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 3 ? "3桁以下で入力してください" : undefined,
                ]}
              />
              <span className="font-bold">年</span>
            </div>
            <div className="flex gap-2 items-center">
              <TextInput
                name="floor"
                label="階数"
                placeholder="3"
                rules={[
                  (v) => (!v ? "階数は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 3 ? "3桁以下で入力してください" : undefined,
                ]}
              />
              <span className="font-bold">/</span>
              <TextInput
                name="total_floors"
                label="総階数"
                placeholder="10"
                rules={[
                  (v) => (!v ? "総階数は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 3 ? "3桁以下で入力してください" : undefined,
                ]}
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
