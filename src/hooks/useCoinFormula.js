
const useCoinFormula = (Coin, currentCoin) => {
  console.log(Coin, currentCoin);
  const currentPrice = currentCoin[0].current_price;
  //   const time = new Date(Coin.coinLastUpdate);
  //   const hour = time.getHours().toString().padStart(2, "0");
  //   const minutes = time.getMinutes().toString().padStart(2, "0");
  //   const seconds = time.getSeconds().toString().padStart(2, "0");
  //   const formattedTime = `${hour}:${minutes}:${seconds}`;

  const coinAmount = Coin.coinAmount;
  const coinImage = Coin.coinImage;
  const totalSumBought = Coin.totalSum;
  const currentSum = Coin.coinAmount * currentPrice;
  const coinName = Coin.coinName;
  const coinBoughtWorth = Coin.coinBuyPrice;

  const differenceOldVSNew = `${(
    (currentSum / totalSumBought) * 100 -
    100
  ).toFixed(6)}`;

  const coinSum = {

    coinImage,
    currentSum,
    totalSumBought,
    coinAmount,
    coinBoughtWorth,
    coinName,
    currentPrice,
    differenceOldVSNew,
  };

  return coinSum;
};
export default useCoinFormula;
