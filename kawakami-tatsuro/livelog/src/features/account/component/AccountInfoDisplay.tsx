import { AccountInfo } from "../types"

interface Props {
  account: AccountInfo
}

export const AccountInfoDisplay = ({ account }: Props) => {
  return (
    <dl className="flex flex-col gap-10">
      <div className="flex gap-2 flex-wrap py-1.5">
        <dt className="wrap-anywhere">User Name:</dt>
        <dd className="wrap-anywhere px-3">{account?.user_name}</dd>
      </div>
      <div className="flex gap-2 flex-wrap py-1.5">
        <dt className="wrap-anywhere">Email:</dt>
        <dd className="wrap-anywhere px-3">{account?.email}</dd>
      </div>
    </dl>
  )
}
