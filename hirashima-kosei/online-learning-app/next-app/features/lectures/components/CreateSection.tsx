import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import { LectureDetail, LectureDetails } from "@/types";

export default function CreateSection({
  lectureDetails,
  handleOnClickRow,
  handleOnClickPlusSection,
  handleOnClickDeleteSection,
}: {
  lectureDetails: LectureDetails;
  handleOnClickRow(sectionIndex: number): void;
  handleOnClickPlusSection(): void;
  handleOnClickDeleteSection(sectionIndex: number): void;
}) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5 text-center">セクション番号</TableHead>
            <TableHead className="w-4/5 text-center">セクション名</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectureDetails?.map((detail: LectureDetail, idx: number) => {
            return (
              <TableRow
                key={idx}
                onClick={() => {
                  handleOnClickRow(idx);
                }}
              >
                <TableCell className="w-1/5 text-center font-medium">
                  {String(idx + 1)}
                </TableCell>
                <TableCell className="w-4/5 text-center font-medium">
                  {detail.section_name}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOnClickDeleteSection(Number(idx));
                    }}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="text-right">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => handleOnClickPlusSection()}
        >
          <Plus />
        </Button>
      </div>
    </>
  );
}
