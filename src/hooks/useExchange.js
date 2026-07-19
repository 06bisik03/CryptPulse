const useExchange = (type, amount, exchangeRate) => {
  const numericAmount = Number(amount);
  const numericRate = Number(exchangeRate);

  if (
    !Number.isFinite(numericAmount) ||
    !Number.isFinite(numericRate) ||
    numericRate <= 0
  ) {
    return 0;
  }

  return type === "coinToUsd"
    ? numericAmount * numericRate
    : numericAmount / numericRate;
};

export default useExchange;
