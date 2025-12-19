import { PageHeading } from "@/components/PageHeading";
import { updateAccountInfo } from "@/features/account/actions";
import { AccountInfoCard } from "@/features/account/component/AccountInfoCard";
import { fetchAccountInfo } from "@/features/account/service";
import { AccountInfo } from "@/features/account/types";
import { redirect } from "next/navigation";

const CURRENT_USER_ID = 1

export default async function AccountPage () {
  const account: AccountInfo | undefined = await fetchAccountInfo(CURRENT_USER_ID)
  if (account === undefined) redirect('/')

  const updateAccountInfoWithId = updateAccountInfo.bind(null, CURRENT_USER_ID)

  return (
    <>
      <PageHeading heading={'Account Info'} />
      <AccountInfoCard action={updateAccountInfoWithId} account={account} />
    </>
  )
}
