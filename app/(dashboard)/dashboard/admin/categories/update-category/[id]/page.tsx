import UpdateCategory from "@/components/main/(Admin)/Categories/form/UpdateCategory";

export default async function UpdateCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UpdateCategory id={id} />;
}
