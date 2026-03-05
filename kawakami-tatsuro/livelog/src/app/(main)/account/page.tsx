import { PageHeading } from "@/components/PageHeading";
import { updateAccountInfo } from "@/features/account/actions";
import { AccountInfoCard } from "@/features/account/component/AccountInfoCard";
import { fetchAccountInfo } from "@/features/account/service";
import { AccountInfo } from "@/features/account/types";
import { getVerifiedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountPage () {
  const user = await getVerifiedUser()
  if (!user) redirect('/')
  
  const account: AccountInfo | undefined = await fetchAccountInfo(user.id)
  if (!account) redirect('/')

  return (
    <>
      <PageHeading heading={'Account Info'} />
      <AccountInfoCard action={updateAccountInfo} account={account} />
    </>
  )
}
