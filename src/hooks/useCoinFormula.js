const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const useCoinFormula = (coin = {}, currentCoin = []) => {
  const market = Array.isArray(currentCoin) ? currentCoin[0] : currentCoin;
  const currentPrice = toNumber(market?.current_price || coin.coinBuyPrice);
  const coinAmount = toNumber(coin.coinAmount);
  const totalSumBought = toNumber(coin.totalSum);
  const currentSum = coinAmount * currentPrice;
  const differenceOldVSNew = totalSumBought > 0
    ? ((currentSum / totalSumBought) * 100 - 100).toFixed(6)
    : "0.000000";

  return {
    coinImage: coin.coinImage || market?.image || "",
    currentSum,
    totalSumBought,
    coinAmount,
    coinBoughtWorth: toNumber(coin.coinBuyPrice),
    coinName: coin.coinName || market?.name || "Unknown asset",
    currentPrice,
    differenceOldVSNew,
  };
};

export default useCoinFormula;
