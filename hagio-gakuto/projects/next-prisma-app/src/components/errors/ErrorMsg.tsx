type Props = {
  msg: string | undefined | null;
};
export const ErrorMsg = ({ msg }: Props) => {
  if (!msg) {
    return null;
  }

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">{msg}</strong>
    </div>
  );
};
