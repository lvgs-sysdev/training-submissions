export const homeConfig = (userId?: string) => [
  { title: "マイラーニング", href: `/myLearning/${userId}` },
  { title: "マイレクチャー", href: `/myLecture/${userId}` },
  { title: "ログイン", href: "/login" },
  { title: "登録", href: "/register" },
];
