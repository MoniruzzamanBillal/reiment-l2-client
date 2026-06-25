const FormSubmitLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-12 h-12 border-4 border-t-rose-500 border-gray-200 rounded-full animate-spin" />
    </div>
  );
};

export default FormSubmitLoading;
