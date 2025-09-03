"use client";

import { UnitDetail, UnitSummary } from "@/types/PropertyType";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Form } from "@/components/form/Form";
import InquiryPreviewPropertyList from "./InquiryPreviewPropertyList";
import { useInquiryModal } from "../hooks/useInquiryModal";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: UnitSummary[] | UnitDetail;
  onSuccess: () => void;
}

export default function InquiryModal({
  isOpen,
  onClose,
  properties,
  onSuccess,
}: Readonly<InquiryModalProps>) {
  const {
    state,
    formAction,
    displayProperties,
    categoryOptions,
    deletePropertyFromPreviewList,
  } = useInquiryModal({ isOpen, properties, onSuccess });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Form
          action={formAction}
          buttonText="お問い合わせ"
          formTitle="お問い合わせ"
        >
          <SelectInput
            name="inquiryCategoryId"
            label="お問い合わせ内容"
            options={categoryOptions}
            errorMsg={state.errors?.inquiryCategoryId}
          />

          <div className="flex-grow overflow-y-auto pr-2 max-h-72 space-y-2">
            {displayProperties.map((p) => (
              <InquiryPreviewPropertyList
                key={p.id}
                property={p}
                onDelete={deletePropertyFromPreviewList}
              />
            ))}
          </div>

          {displayProperties.map((p) => (
            <input key={p.id} type="hidden" name="unitIds" value={p.id} />
          ))}
        </Form>
      </div>
    </div>
  );
}
