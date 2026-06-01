// 削除ボタンを押した時の通信処理とトースト表示を行うフック
import toast from "react-hot-toast";

export const useRestaurantDelete = (refresh?: () => void) => {
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return;
    const toastId = toast.loading("削除しています...");

    try {
      const res = await fetch("/api/restaurants/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        if (refresh) refresh();
        toast.success("削除しました", { id: toastId });
      } else {
        toast.error("削除に失敗しました", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("エラーが発生しました", { id: toastId });
    }
  };

  return { handleDelete };
};
