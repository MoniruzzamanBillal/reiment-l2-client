import UpdateProduct from "@/components/main/(Vendor)/Products/form/UpdateProduct";

export default async function UpdateProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UpdateProduct id={id} />;
}
