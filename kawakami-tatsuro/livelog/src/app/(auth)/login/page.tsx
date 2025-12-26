import { PageHeading } from "@/components/PageHeading";
import { Card } from "@/components/ui/card";
import { login } from "@/features/auth/login/action";
import { LoginForm } from "@/features/auth/login/components/LoginForm";

export default async function LoginPage () {
  return (
    <>
      <PageHeading heading="Login" />
      <Card className="shadow-none px-4 py-9">
        <LoginForm login={login} />  
      </Card>
    </>
    
  )
}
