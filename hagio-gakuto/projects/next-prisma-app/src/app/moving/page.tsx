import Link from "next/link";
import MovingEstimateForm from "./components/MovingEstimateForm";

export default function MovingPage() {
  return (
    <>
      <Link
        href="/moving/todo"
        aria-label="引っ越しやることリスト"
        title="引っ越しやることリスト"
        className="px-2 py-2 rounded-md font-medium tracking-wide transition-all duration-300"
      >
        引っ越しが決まったら
      </Link>
      <MovingEstimateForm />
    </>
  );
}
