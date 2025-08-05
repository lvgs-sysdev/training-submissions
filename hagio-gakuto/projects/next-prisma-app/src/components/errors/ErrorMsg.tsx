import ErrorIcon from "@mui/icons-material/Error";

type Props = {
  msg: string | undefined | null;
};
export const ErrorMsg = ({ msg }: Props) => {
  if (!msg) {
    return null;
  }

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative  flex "
      role="alert"
    >
      <ErrorIcon className="mr-2" />

      <strong className="font-bold">{msg}</strong>
    </div>
  );
};
