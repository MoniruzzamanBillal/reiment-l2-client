type TProps = {
  params: Promise<{ email: string }>;
};

export default async function EmailResetConfirmationPage({ params }: TProps) {
  const { email } = await params;

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[95%] sm:w-[75%] md:w-[55%] mx-auto p-6 sm:p-10 rounded-md shadow-xl bg-white border border-gray-200 text-center">
        <p className="text-xl sm:text-2xl font-medium text-gray-700">
          A password reset link has been sent to{" "}
          <span className="text-rose-500 font-bold">{decodeURIComponent(email)}</span>
        </p>
        <p className="mt-5 text-red-600 font-medium">
          Link will expire within 5 minutes
        </p>
      </div>
    </div>
  );
}
