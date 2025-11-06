import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Content, LectureDetails } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import React from "react"; // 💡 React.Fragment の使用のため追記

export default function CreateContent({
  lectureDetails,
  setLectureDetails,
  currentSectionIndex,
  handleOnClickPlusContent,
  handleOnClickDeleteContent,
}: {
  lectureDetails: LectureDetails;
  setLectureDetails(newLectureDetails: LectureDetails): void;
  currentSectionIndex: number;
  handleOnClickPlusContent(currentSectionIndex: number): void;
  handleOnClickDeleteContent(contentIndex: number): void;
}) {
  const contents = lectureDetails[currentSectionIndex].contents;

  const optionRow = ["選択肢1", "選択肢2", "選択肢3", "選択肢4"];

  const handleContentSwitch = (
    content: Content,
    contentIdx: number,
    isChecked: boolean
  ) => {
    const newLectureDetails = [...lectureDetails];
    const currentContent =
      newLectureDetails[currentSectionIndex].contents[contentIdx];

    if (!isChecked) {
      newLectureDetails[currentSectionIndex].contents[contentIdx] = {
        ...currentContent,
        content_type: "text",
        choice_body: undefined,
        answer_idx: undefined,
        question_id: undefined,
      };
    } else {
      newLectureDetails[currentSectionIndex].contents[contentIdx] = {
        ...currentContent,
        content_name: "確認テスト",
        content_type: "quiz",
        question_id: currentContent.question_id ?? -1,
        choice_body: currentContent.choice_body ?? ["", "", "", ""],
        answer_idx: currentContent.answer_idx ?? 0,
      };
    }
    setLectureDetails(newLectureDetails);
  };
  const DeleteButton = (contentIdx: number) => (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => handleOnClickDeleteContent(Number(contentIdx))}
    >
      <Trash2 />
    </Button>
  );

  return (
    <>
      <FieldSet className="mb-5">
        <FieldLegend>
          <p className="text-xl">
            セクション番号：{String(currentSectionIndex + 1)}
          </p>
        </FieldLegend>
        <FieldDescription>以下の項目を入力してください。</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">セクションのタイトル</FieldLabel>
            <Input
              id="section-title"
              autoComplete="on"
              value={lectureDetails[currentSectionIndex].section_name}
              onChange={(e) => {
                const newLectureDetails = [...lectureDetails];
                newLectureDetails[currentSectionIndex].section_name =
                  e.target.value;
                setLectureDetails(newLectureDetails);
              }}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/10 text-center text-sm md:text-md">
              コンテンツ番号
            </TableHead>
            <TableHead className="w-9/10 text-center text-sm md:text-md">
              コンテンツの内容
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents?.map((content: Content, contentIdx: number) => {
            const CommonIndexCell = (
              <TableCell className="w-1/10 text-center font-medium align-top">
                {String(contentIdx + 1)}
                <div className="md:flex items-center justify-center space-x-2 mt-2">
                  <Switch
                    id={`exam_${contentIdx}`}
                    checked={content.content_type === "quiz"}
                    onCheckedChange={(isChecked) =>
                      handleContentSwitch(content, contentIdx, isChecked)
                    }
                  />
                  <Label htmlFor={`exam_${contentIdx}`}>確認テスト</Label>
                </div>
              </TableCell>
            );

            if (content.content_type === "text") {
              return (
                <TableRow key={contentIdx} className="h-100">
                  {CommonIndexCell}
                  <TableCell className="w-8/10 text-center font-medium">
                    <p className="text-left">コンテンツ名：</p>
                    <Input
                      id="content-name"
                      autoComplete="on"
                      value={content.content_name}
                      className="mb-3"
                      onChange={(e) => {
                        const newLectureDetails = [...lectureDetails];
                        newLectureDetails[currentSectionIndex].contents[
                          contentIdx
                        ].content_name = e.target.value;
                        setLectureDetails(newLectureDetails);
                      }}
                    />
                    <br />
                    <p className="text-left">コンテンツ：</p>
                    <Textarea
                      id="content"
                      autoComplete="on"
                      value={content.body}
                      className="h-96"
                      onChange={(e) => {
                        const newLectureDetails = [...lectureDetails];
                        newLectureDetails[currentSectionIndex].contents[
                          contentIdx
                        ].body = e.target.value;
                        setLectureDetails(newLectureDetails);
                      }}
                    />
                  </TableCell>
                  <TableCell className="w-1/10">
                    <div className="flex justify-center">
                      {DeleteButton(contentIdx)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            } else {
              return (
                <React.Fragment key={contentIdx}>
                  <TableRow>
                    {CommonIndexCell}
                    <TableCell colSpan={2} className="p-4">
                      <div className="flex justify-between">
                        <p className="text-left text-lg">
                          {content.content_name}
                        </p>
                        <div>{DeleteButton(contentIdx)}</div>
                      </div>
                      <p className="text-left mb-2">問題文：</p>
                      <Textarea
                        id="question-body"
                        autoComplete="on"
                        value={content?.body}
                        className="h-32 mb-4"
                        onChange={(e) => {
                          const newLectureDetails = [...lectureDetails];
                          newLectureDetails[currentSectionIndex].contents[
                            contentIdx
                          ].body = e.target.value;
                          setLectureDetails(newLectureDetails);
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {content.choice_body?.map(
                    (body: string, choiceIdx: number) => {
                      return (
                        <TableRow
                          key={`choice-${contentIdx}-${choiceIdx}`}
                          className="border-b-0"
                        >
                          <TableCell className="w-1/10 border-b-0"></TableCell>
                          <TableCell className="w-9/10 border-b" colSpan={2}>
                            <div className="flex items-start space-x-2">
                              <div className="text-sm md:text-md pt-2 w-1/10 text-left">
                                選択肢{String(choiceIdx + 1)}：
                              </div>
                              <Textarea
                                id={`choice-body-${choiceIdx}`}
                                autoComplete="on"
                                value={body}
                                className="h-16 w-9/10"
                                onChange={(e) => {
                                  const newLectureDetails = [...lectureDetails];
                                  newLectureDetails[
                                    currentSectionIndex
                                  ].contents[contentIdx].choice_body![
                                    choiceIdx
                                  ] = e.target.value;
                                  setLectureDetails(newLectureDetails);
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}

                  <TableRow>
                    <TableCell colSpan={3} className="pt-4 pb-4">
                      <Field>
                        <div className="flex justify-end items-center space-x-4">
                          <FieldLabel htmlFor="select-correct-option">
                            正解の選択肢：
                          </FieldLabel>
                          <Select
                            value={String(content.answer_idx)}
                            onValueChange={(value) => {
                              const newLectureDetails = [...lectureDetails];
                              newLectureDetails[currentSectionIndex].contents[
                                contentIdx
                              ].answer_idx = Number(value);
                              setLectureDetails(newLectureDetails);
                            }}
                          >
                            <SelectTrigger
                              id="select-correct-option"
                              className="w-[180px]"
                            >
                              {optionRow[Number(content.answer_idx)]}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">{optionRow[0]}</SelectItem>
                              <SelectItem value="1">{optionRow[1]}</SelectItem>
                              <SelectItem value="2">{optionRow[2]}</SelectItem>
                              <SelectItem value="3">{optionRow[3]}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </Field>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            }
          })}
        </TableBody>
      </Table>
      <div className="text-right mt-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => handleOnClickPlusContent(currentSectionIndex)}
        >
          <Plus />
        </Button>
      </div>
    </>
  );
}
