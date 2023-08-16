import { useState } from "react";
const useExchange = (type,amount,exchangeRate) => {
    const [wantedAmount, setWantedAmount] = useState('');
    if(type === "coinToUsd") {
        const result = amount * exchangeRate;
        setWantedAmount(result);
    } else {
        const result = amount / exchangeRate;
        setWantedAmount(result);
    }
    return wantedAmount;
}
export default useExchange;