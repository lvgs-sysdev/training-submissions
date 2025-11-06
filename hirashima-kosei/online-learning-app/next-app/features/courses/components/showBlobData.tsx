"use client";

import { useEffect, useState } from "react";

export default function ShowBlobData({
  bufferData,
  className = "w-full h-30",
}: {
  bufferData: Buffer | string | null;
  className: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bufferData) {
      // 文字列の場合（DataURLまたはBase64）
      if (typeof bufferData === "string") {
        // Base64文字列の場合はDataURLに変換
        if (!bufferData.startsWith("data:")) {
          setObjectUrl(`data:image/png;base64,${bufferData}`);
        } else {
          setObjectUrl(bufferData);
        }
        return;
      }

      if (
        typeof bufferData === "object" &&
        bufferData !== null &&
        (bufferData as { type?: string }).type === "Buffer"
      ) {
        const blobData = new Blob([new Uint8Array(bufferData)], {
          type: "image/*",
        });
        const url = window.URL.createObjectURL(blobData);
        setObjectUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }
    setObjectUrl(null);
  }, [bufferData]);

  return <img src={objectUrl!} alt="画像イメージ" className={className} />;
}
