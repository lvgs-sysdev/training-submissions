import { axiosClient } from "@/lib/api/api-client";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default async function TextContent({
  contentId,
}: {
  contentId: string;
}) {
  try {
    const response = await axiosClient.get("/content/text", {
      params: { contentId },
    });
    const textBody = response.data.textBody;

    return (
      <>
        <div className="m-5">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {textBody}
          </Markdown>
        </div>
      </>
    );
  } catch (err) {
    console.log(err);
  }
}
