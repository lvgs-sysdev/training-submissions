import { Metadata } from "next";
import React from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeIcon from "@mui/icons-material/Home";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";

export const metadata: Metadata = {
  title: "引越しやることリスト",
};

// --- データ定義 ---
const preMoveTasks = [
  { text: "賃貸物件の解約手続き", completed: true },
  { text: "引越し業者への連絡・確定", completed: true },
  { text: "転出届の提出（2週間前から）", completed: false },
  { text: "電気・ガス・水道のライフライン手続き", completed: false },
  { text: "インターネット回線の移転手続き", completed: false },
  { text: "郵便物の転送届を提出", completed: false },
  { text: "不用品の処分・整理", completed: false },
];

const movingDayTasks = [
  { text: "荷物の最終確認と搬出の立ち会い", completed: false },
  { text: "旧居の掃除と鍵の返却", completed: false },
  { text: "新居の鍵の受け取り", completed: false },
  { text: "荷物の搬入の立ち会いと確認", completed: false },
  { text: "ライフラインの開通確認（電気・ガス・水道）", completed: false },
];

const postMoveTasks = [
  { text: "転入届・転居届の提出（14日以内）", completed: false },
  { text: "マイナンバーカードの住所変更", completed: false },
  { text: "運転免許証の住所変更", completed: false },
  { text: "銀行・クレジットカードなどの住所変更", completed: false },
  { text: "荷解きと整理", completed: false },
];

// --- タスクリストのUIコンポーネント ---
const TaskList = ({
  tasks,
  title,
  icon,
}: {
  tasks: { text: string; completed: boolean }[];
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
    <div className="flex items-center border-b pb-4 mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-gray-900 ml-3">{title}</h2>
    </div>
    <ul className="space-y-4">
      {tasks.map((task, index) => (
        <li
          key={index}
          className={`flex items-center p-3 rounded-lg transition-colors ${
            task.completed
              ? "bg-green-50 text-gray-500 line-through"
              : "hover:bg-gray-50"
          }`}
        >
          {task.completed ? (
            <CheckBoxIcon className="text-green-500 mr-3 flex-shrink-0" />
          ) : (
            <CheckBoxOutlineBlankIcon className="text-gray-400 mr-3 flex-shrink-0" />
          )}
          <span>{task.text}</span>
        </li>
      ))}
    </ul>
  </div>
);

const TodoListPage: React.FC = () => {
  return (
    <div className="bg-sky-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-sky-800 md:text-4xl">
            引越しやることリスト
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            新生活に向けて、タスクを一つずつ完了させましょう。
          </p>
        </div>

        <TaskList
          title="引越し前"
          tasks={preMoveTasks}
          icon={<PublishedWithChangesIcon className="text-sky-600" />}
        />
        <TaskList
          title="引越し当日"
          tasks={movingDayTasks}
          icon={<EventAvailableIcon className="text-sky-600" />}
        />
        <TaskList
          title="引越し後"
          tasks={postMoveTasks}
          icon={<HomeIcon className="text-sky-600" />}
        />
      </div>
    </div>
  );
};

export default TodoListPage;
