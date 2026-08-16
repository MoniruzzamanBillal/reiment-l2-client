import EmailResetConfirmation from "@/components/main/(Auth)/EmailResetConfirmation/EmailResetConfirmation";

type TProps = {
  params: Promise<{ email: string }>;
};

export default async function EmailResetConfirmationPage({ params }: TProps) {
  const { email } = await params;

  return <EmailResetConfirmation email={email} />;
}
