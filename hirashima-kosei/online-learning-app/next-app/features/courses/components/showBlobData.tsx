"use client";

import { useEffect, useState } from "react";

interface ArrayBuffer {
  type: "Buffer";
  data: number[];
}

export default function ShowBlobData({
  bufferData,
  className = "w-full aspect-[5/2] object-cover",
}: {
  bufferData: Buffer | string | null;
  className: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bufferData) {
      if (typeof bufferData === "string") {
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
        const blobData = new Blob(
          [new Uint8Array((bufferData as unknown as ArrayBuffer).data)],
          {
            type: "image/*",
          }
        );
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
