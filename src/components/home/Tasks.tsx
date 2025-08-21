import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Tasks() {
  const userTasks = [
    {
      title: "「パークアクシス渋谷」内見予約",
      status: "日程調整中",
      href: "#",
    },
    { title: "引越し業者の相見積もり", status: "3社から返信あり", href: "#" },
    {
      title: "契約書類の提出",
      status: "対応が必要です",
      statusColor: "text-red-500",
    },
  ];

  return (
    <section className="bg-sky-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          進行中のタスク
        </h2>
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {userTasks.map((task) => (
            <a
              href={task.href}
              key={task.title}
              className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <TaskAltIcon className="w-6 h-6 text-gray-400 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p
                    className={`text-sm ${task.statusColor || "text-gray-500"}`}
                  >
                    {task.status}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
