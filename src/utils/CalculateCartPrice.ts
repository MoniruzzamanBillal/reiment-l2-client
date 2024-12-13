export const calculateCartPrice = (item) => {
  //   console.log(item);

  const totalPrice = item.reduce((sum, cartItem) => {
    sum += cartItem?.price * cartItem?.quantity;
    return sum;
  }, 0);

  //   console.log(totalPrice);

  return totalPrice;
};
