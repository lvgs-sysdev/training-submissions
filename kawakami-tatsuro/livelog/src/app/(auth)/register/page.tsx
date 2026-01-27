import { PageHeading } from "@/components/PageHeading";
import { registerAccount } from "@/features/auth/register/actions";
import { AccountRegisterForm } from "@/features/auth/register/componetns/AccountRegisterForm";

export default async function RegisterPage () {
  return (
    <>
      <PageHeading heading="Register" />
      <AccountRegisterForm registerAccount={registerAccount} />
    </>
  )
}
