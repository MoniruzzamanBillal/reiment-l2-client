export type TUserCommentReview = {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; username: string; profileImg: string };
};
