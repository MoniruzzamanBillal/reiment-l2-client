/* eslint-disable @typescript-eslint/no-explicit-any */

export const calculateCartPrice = (item: any) => {
  //   console.log(item);

  const totalPrice = item?.reduce((sum: any, cartItem: any) => {
    sum += cartItem?.price * cartItem?.quantity;
    return sum;
  }, 0);

  //   console.log(totalPrice);

  return totalPrice;
};
