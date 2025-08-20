import { useLoading } from "@/context/LoadingContext";
import { Property } from "@/types/PropertyType";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

interface Props {
  properties: Property[] | Property;
}

export default function InquiryButton({ properties }: Readonly<Props>) {
  const { setIsLoading } = useLoading();
  const isArray = Array.isArray(properties);

  const handleApply = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // ボタンのデフォルト動作を防ぐ（もしあれば）
    let userConfirm;
    let ids;
    if (Array.isArray(properties)) {
      // 配列の場合の処理
      userConfirm = window.confirm(
        `${properties.length}件の物件を問い合わせますか？`
      );
      ids = properties.map((p) => p.id);
    } else {
      // 単一オブジェクトの場合の処理
      userConfirm = window.confirm("この物件を問い合わせますか？");
      ids = [properties.id];
    }
    if (userConfirm) {
      console.log(ids);
      setIsLoading(true);
      const response = await fetch("/api/properties/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyIds: ids }),
      });
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to fetch");
      }
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      className="fixed bottom-8 right-8 w-auto px-4 h-16 bg-sky-600 text-white rounded-full shadow-lg flex gap-1 items-center justify-center hover:bg-sky-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 cursor-pointer"
    >
      <AttachEmailIcon fontSize="medium" />
      {isArray ? "一括お問い合わせ" : "お問い合わせ"}
    </button>
  );
}
