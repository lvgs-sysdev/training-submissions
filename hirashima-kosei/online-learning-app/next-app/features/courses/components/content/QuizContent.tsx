"use client";

import { useState, useEffect } from "react";
import { axiosClient } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Choice = {
  body_choice: string;
  is_answer: 0 | 1;
};

type QuizData = {
  questionBody: string;
  choiceRow: Choice[];
};

async function fetchQuizData(contentId: string): Promise<QuizData> {
  const response = await axiosClient.get("/content/quiz", {
    params: { contentId },
  });
  return {
    questionBody: response.data.questionBody,
    choiceRow: response.data.choiceRow as Choice[],
  };
}

export default function QuizContent({ contentId }: { contentId: string }) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchQuizData(contentId)
      .then((data) => {
        setQuizData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Quiz fetching error:", err);
        setError("クイズデータを読み込めませんでした。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [contentId]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setIsAnswered(true);
    } else {
      console.warn("選択肢を選んでください。");
    }
  };

  const getResultDisplay = (choice: Choice, idx: number) => {
    if (!isAnswered) return null;

    const isCorrect = choice.is_answer === 1;
    const isSelected = selectedAnswer === String(idx);

    if (isCorrect) {
      return <span className="text-green-600 font-bold ml-4"> (◯ 正解)</span>;
    }

    if (isSelected && !isCorrect) {
      return <span className="text-red-600 font-bold ml-4"> (× 不正解)</span>;
    }

    return null;
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">ロード中...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 font-medium">{error}</div>
    );
  }

  if (!quizData || quizData.choiceRow?.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        利用可能なクイズがありません。
      </div>
    );
  }

  return (
    <div className="w-full m-5">
      <p className="text-xl font-semibold mb-4 border-b pb-2">確認テスト</p>
      <p className="text-lg mb-6 whitespace-pre-wrap">
        {quizData.questionBody}
      </p>

      <RadioGroup
        onValueChange={setSelectedAnswer}
        value={selectedAnswer || undefined}
        disabled={isAnswered}
        className="space-y-3"
      >
        {quizData.choiceRow?.map((choice, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-lg
                                  ${!isAnswered ? "hover:bg-gray-50" : ""} 
                                  border border-transparent`}
          >
            <RadioGroupItem
              value={String(idx)}
              id={`choice-${idx}`}
              className="mt-1"
            />

            <div className="flex flex-col">
              <Label
                htmlFor={`choice-${idx}`}
                className={`text-base font-normal cursor-pointer ${
                  isAnswered ? "cursor-default" : ""
                }`}
              >
                {choice.body_choice}
              </Label>
              {getResultDisplay(choice, idx)}
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-8">
        <Button
          onClick={handleSubmitAnswer}
          disabled={isAnswered || selectedAnswer === null}
          className="w-40 transition-all duration-200 
                               bg-blue-600 hover:bg-blue-700 text-white
                               disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isAnswered ? "解答済み" : "回答する"}
        </Button>
      </div>

      {isAnswered && (
        <div className="mt-6 p-4 border-t border-gray-200 text-sm text-gray-600">
          <p className="font-medium">
            解答を確認しました。正解の選択肢（◯）と、あなたが選択した選択肢（×）が表示されています。
          </p>
        </div>
      )}
    </div>
  );
}
