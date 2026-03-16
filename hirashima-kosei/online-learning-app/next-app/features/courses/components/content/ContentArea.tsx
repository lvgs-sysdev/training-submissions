import { axiosClient } from "@/lib/api/api-client";
import TextContent from "./TextContent";
import QuizContent from "./QuizContent";

export default async function ContentArea({
  contentId,
}: {
  contentId: string;
}) {
  try {
    const response = await axiosClient.get("/content", {
      params: { contentId },
    });
    const content = response.data.content;

    if (content.content_type === "text")
      return <TextContent contentId={contentId} />;
    else if (content.content_type === "quiz")
      return <QuizContent contentId={contentId} />;
  } catch (err) {
    console.log(err);
  }
}
