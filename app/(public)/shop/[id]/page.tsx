import ShopDetail from "@/components/main/ShopDetail/ShopDetail";

type TProps = { params: Promise<{ id: string }> };

export default async function ShopDetailPage({ params }: TProps) {
  const { id } = await params;
  return <ShopDetail id={id} />;
}
