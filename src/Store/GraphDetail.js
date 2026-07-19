import axios from "axios";
import { create } from "zustand";

const GraphDetail = create((set) => ({
  graphData: [],
  status: "idle",
  error: null,
  fetchData: async (id) => {
    if (!id) {
      set({ graphData: [], status: "ready", error: "No asset was selected." });
      return;
    }

    set({ status: "loading", error: null });
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=1`,
        { timeout: 10000 }
      );
      const prices = Array.isArray(response.data?.prices) ? response.data.prices : [];
      const graphData = prices
        .map(([time, value]) => ({
          time: convertUnixTimestampToTime(time),
          price: Number(value),
        }))
        .filter((point) => Number.isFinite(point.price));
      set({ graphData, status: "ready", error: null });
    } catch {
      set({ graphData: [], status: "ready", error: "Intraday chart data is unavailable." });
    }
  },
}));

export default GraphDetail;

export function convertUnixTimestampToTime(unixTimestamp) {
  const date = new Date(unixTimestamp);
  if (Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
