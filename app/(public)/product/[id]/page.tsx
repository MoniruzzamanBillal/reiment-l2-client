import ProductDetailPage from "@/components/main/ProductDetail/ProductDetailPage";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailRoute({ params }: TProps) {
  const { id } = await params;
  return <ProductDetailPage id={id} />;
}
