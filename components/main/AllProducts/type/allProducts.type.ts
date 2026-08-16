export type TCategory = { id: string; name: string };
export type TCategoryOption = { name: string; value: string };

export type TProps = {
  priceRange: number | null;
  category: string;
  setPriceRange: (range: number) => void;
  setCategory: (category: string) => void;
  handleAddReset: () => void;
  followedOnly: boolean;
  setFollowedOnly: (v: boolean) => void;
  canFilterFollowed: boolean;
  hasFollowedShops: boolean;
};
