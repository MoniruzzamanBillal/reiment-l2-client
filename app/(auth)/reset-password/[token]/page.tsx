import ResetPasswordForm from "@/components/main/Auth/ResetPasswordForm";

type TProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: TProps) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
