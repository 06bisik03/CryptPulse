import axios from "axios";
import { create } from "zustand";
const GraphDetail = create((set) => ({
  graphData: [],
  fetchData: async (id) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`
    );
      //extract time and price values from the array and map them for graph
    const graphData = response.data.prices.map((price) => {
      const [time, value] = price;
      const formatTime = convertUnixTimestampToTime(time);
      const formatPrice = parseFloat(value).toFixed(3);
      return {
        time: formatTime,
        price: formatPrice,
      };
    });
    set({ graphData });
  },
}));
export default GraphDetail;
export function convertUnixTimestampToTime(unixTimestamp) {
  const date = new Date(unixTimestamp);
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
//this component is responsible for putting out a graph by using axios and zustand. It is more detailed and also interactive. 