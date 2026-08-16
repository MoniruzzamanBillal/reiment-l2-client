export type TAdminReview = {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  product: { name: string; productImg: string };
  user: { username: string };
};
