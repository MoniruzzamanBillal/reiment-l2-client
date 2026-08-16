import UpdateCoupon from "@/components/main/(Admin)/Coupon/form/UpdateCoupon";

export default async function UpdateCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UpdateCoupon id={id} />;
}
