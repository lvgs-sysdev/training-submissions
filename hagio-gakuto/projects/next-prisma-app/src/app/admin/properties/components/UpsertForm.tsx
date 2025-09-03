"use client";

import { TextInput } from "@/components/inputs/TextInput";
import { useAddress } from "../hooks/useAddress";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Form } from "@/components/form/Form";
import { useActionState, useEffect, useState } from "react";
import { propertyRegisterAction } from "../register/actions/propertyRegisterAction";
import type { PropertyType, Layout } from "@prisma/client";
import { DateInput } from "@/components/inputs/DateInput";

interface Props {
  propertyTypes: PropertyType[];
  layouts: Layout[];
}
export default function PropertyUpsertForm({
  propertyTypes,
  layouts,
}: Readonly<Props>) {
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
  const [propertyType, setPropertyType] = useState(state.fields?.type || "");
  useEffect(() => {
    // state.fields.typeに値があれば（エラーで戻ってきた場合など）、
    // ローカルのstate(propertyType)を更新する
    if (state.fields?.type) {
      setPropertyType(state.fields.type);
    }
  }, [state.fields?.type]); // state.fields.typeが変更されたときだけ実行

  const propertyTypeOptions = propertyTypes.map((pt) => ({
    value: String(pt.id), // valueは文字列が一般的
    label: pt.name,
  }));

  const layoutOptions = layouts.map((l) => ({
    value: String(l.id),
    label: l.name,
  }));
  console.log(state?.fields);

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
                (v) =>
                  v.length > 100 ? "100文字以下で入力してください" : undefined,
              ]}
              defaultValue={state.fields?.name || ""}
              errorMsg={state.errors?.name}
            />

            <SelectInput
              name="type"
              label="物件種別"
              options={propertyTypeOptions}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              errorMsg={state.errors?.type}
            />
            <div className="flex gap-2 items-center">
              <TextInput
                name="priceRent"
                label="家賃"
                placeholder="100000"
                rules={[
                  (v) => (!v ? "家賃は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 9 ? "9桁以下で入力してください" : undefined,
                ]}
                defaultValue={state.fields?.priceRent?.toString() || ""}
                errorMsg={state.errors?.priceRent}
              />
              <span>円</span>
            </div>

            <TextInput
              name="zipcode"
              label="郵便番号 (ハイフンなし7桁)"
              placeholder="1506190"
              rules={[
                (v) => (!v ? "郵便番号は必須です" : undefined),
                (v) => (v.length !== 7 ? "7文字で入力してください" : undefined),
              ]}
              value={zipcode}
              onChange={handleZipcodeChange}
              errorMsg={state.errors?.zipcode}
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
              errorMsg={state.errors?.prefecture}
            />
            <TextInput
              name="city"
              label="市区"
              placeholder="渋谷区"
              rules={[
                (v) => (!v ? "市区は必須です" : undefined),
                (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
                (v) =>
                  v.length > 20 ? "20文字以下で入力してください" : undefined,
              ]}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              errorMsg={state.errors?.city}
            />

            <TextInput
              name="town"
              label="町名"
              placeholder="渋谷"
              rules={[
                (v) => (!v ? "町名は必須です" : undefined),
                (v) =>
                  v.length > 50 ? "50文字以下で入力してください" : undefined,
              ]}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              errorMsg={state.errors?.town}
            />

            <div className="flex gap-2 items-center">
              <TextInput
                name="chome"
                label="丁目"
                placeholder="2"
                rules={[
                  (v) =>
                    v.length > 50 ? "50文字以下で入力してください" : undefined,
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                ]}
                errorMsg={state.errors?.chome}
                defaultValue={state.fields?.chome?.toString() || ""}
              />
              <span>丁目</span>
            </div>
            <TextInput
              name="block"
              label="番地以降"
              placeholder="24-12"
              rules={[
                (v) => (!v ? "番地以降は必須です" : undefined),
                (v) =>
                  v.length > 100 ? "100文字以下で入力してください" : undefined,
              ]}
              errorMsg={state.errors?.block}
              defaultValue={state.fields?.block?.toString() || ""}
            />
            <TextInput
              name="building"
              label="建物・ビル名"
              placeholder="渋谷スクランブルスクエア"
              rules={[
                (v) =>
                  v.length > 100 ? "100文字以下で入力してください" : undefined,
              ]}
              errorMsg={state.errors?.building}
              defaultValue={state.fields?.building || ""}
            />
            <TextInput
              name="roomNumber"
              label="号室"
              placeholder="24F・25F"
              rules={[
                (v) =>
                  v.length > 20 ? "20文字以下で入力してください" : undefined,
              ]}
              errorMsg={state.errors?.roomNumber}
              defaultValue={state.fields?.roomNumber || ""}
            />
            <TextInput
              name="nearestStation"
              label="最寄り駅"
              placeholder="渋谷駅"
              rules={[
                (v) => (!v ? "最寄り駅は必須です" : undefined),
                (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
                (v) =>
                  v.length > 50 ? "50文字以下で入力してください" : undefined,
              ]}
              errorMsg={state.errors?.nearestStation}
              defaultValue={state.fields?.nearestStation || ""}
            />
            <div className="flex gap-2 items-center">
              <TextInput
                name="walkToStation"
                label="最寄り駅までの所要時間(分)"
                placeholder="5"
                rules={[
                  (v) => (!v ? "最寄り駅までの所要時間は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 3 ? "3桁以下で入力してください" : undefined,
                ]}
                errorMsg={state.errors?.walkToStation}
                defaultValue={state.fields?.walkToStation?.toString() || ""}
              />
              <span className="font-medium">分</span>
            </div>
            <div className="flex gap-2 items-center">
              <TextInput
                name="areaSqm"
                label="面積(平方メートル)"
                placeholder="30.0"
                rules={[
                  (v) => (!v ? "面積は必須です" : undefined),
                  (v) =>
                    !/^\d+(\.\d+)?$/.test(v)
                      ? "半角数字か小数で入力してください"
                      : undefined,
                  (v) =>
                    v.length > 10 ? "10文字以下で入力してください" : undefined,
                ]}
                errorMsg={state.errors?.areaSqm}
                defaultValue={state.fields?.areaSqm?.toString() || ""}
              />
              <span className="">㎡</span>
            </div>

            <SelectInput
              name="layout"
              label="間取り"
              options={layoutOptions}
              // rules={[(v) => (!v ? "間取りは必須です" : undefined)]}
              errorMsg={state.errors?.layout}
              //   defaultValue={state.fields?.layout || ""}
            />

            <DateInput
              name="buildDate"
              label="建築日"
              rules={[(v) => (!v ? "建築日は必須です" : undefined)]}
              errorMsg={state.errors?.buildDate}
              defaultValue={state.fields?.buildDate?.toString() || ""}
            />

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
                errorMsg={state.errors?.floor}
                defaultValue={state.fields?.floor?.toString() || ""}
              />
              <span>/</span>
              <TextInput
                name="totalFloors"
                label="総階数"
                placeholder="10"
                rules={[
                  (v) => (!v ? "総階数は必須です" : undefined),
                  (v) =>
                    !/^\d+$/.test(v) ? "半角数字で入力してください" : undefined,
                  (v) =>
                    v.length > 3 ? "3桁以下で入力してください" : undefined,
                ]}
                errorMsg={state.errors?.totalFloors}
                defaultValue={state.fields?.totalFloors?.toString() || ""}
              />
            </div>
            <SelectInput
              name="isEmpty"
              label="空き状況"
              options={[
                { value: "true", label: "入居可能" },
                { value: "false", label: "入居不可" },
              ]}
              // rules={[(v) => (!v ? "間取りは必須です" : undefined)]}
              errorMsg={state.errors?.isEmpty}
              //   defaultValue={state.fields?.isEmpty?.valueOf || ""}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}
