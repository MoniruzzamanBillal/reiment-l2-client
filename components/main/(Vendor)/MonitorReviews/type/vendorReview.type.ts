export type TVendorReview = {
  id: string;
  comment: string;
  rating: number;
  updatedAt: string;
  product: { id: string; name: string; productImg: string };
  user: { id: string; username: string };
};
