"use client";

import Image from "next/image";
import { useState } from "react";
import { ErrorMsg } from "../errors/ErrorMsg";

interface Props {
  name: string;
  defaultImage: string;
}

const MAX_FILE_SIZE_MB = 1;

export function AvatarInput({ name, defaultImage }: Readonly<Props>) {
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setValidationError(
          `ファイルサイズは${MAX_FILE_SIZE_MB}MB以下にしてください。`
        );
        e.target.value = ""; // 選択をリセット
        setPreview(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative w-24 h-24 mb-4">
        <Image
          src={preview || defaultImage}
          alt="Avatar Preview"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="rounded-full object-cover"
        />
      </div>
      <label
        htmlFor="avatar-upload"
        className="cursor-pointer text-sm text-sky-600 hover:underline"
      >
        アバターを変更
      </label>
      <input
        id="avatar-upload"
        name={name}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden" // input自体は隠す
      />
      {validationError && <ErrorMsg msg={validationError} />}
    </div>
  );
}
