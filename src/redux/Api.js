import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fallbackCoins,
  fallbackGlobal,
  fallbackTrending,
} from "../data/marketFallback";
import { normalizeCoins } from "../utils/market";

const GENERAL_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en";
const TRENDING_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h";
const GLOBAL_URL = "https://api.coingecko.com/api/v3/global";

const readCache = (key, fallback) => {
  try {
    const cached = JSON.parse(localStorage.getItem(key));
    return cached && typeof cached === "object" ? cached : fallback;
  } catch {
    return fallback;
  }
};

const writeCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage can be unavailable in privacy mode; live data still remains in Redux.
  }
};

const fetchJson = async (url, signal) => {
  const response = await fetch(url, { signal, headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Market service responded with ${response.status}`);
  }
  return response.json();
};

const getCoinPayload = async (url, cacheKey, fallback, signal) => {
  try {
    const response = await fetchJson(url, signal);
    if (!Array.isArray(response) || !response.length) {
      throw new Error("Market service returned no assets");
    }
    const data = normalizeCoins(response, fallback);
    writeCache(cacheKey, data);
    return { data, source: "live", fetchedAt: Date.now(), error: null };
  } catch (error) {
    const cached = readCache(cacheKey, null);
    const data = normalizeCoins(cached, fallback);
    return {
      data,
      source: Array.isArray(cached) && cached.length ? "cached" : "demo",
      fetchedAt: Date.now(),
      error: error?.message || "Live market data is temporarily unavailable",
    };
  }
};

export const fetcherGeneral = createAsyncThunk(
  "market/general",
  async (_, { signal }) => getCoinPayload(GENERAL_URL, "generalCoinsLastCall", fallbackCoins, signal)
);

export const fetcherTrending = createAsyncThunk(
  "market/trending",
  async (_, { signal }) =>
    getCoinPayload(TRENDING_URL, "trendingCoinsLastCall", fallbackTrending, signal)
);

export const fetcherGlobal = createAsyncThunk(
  "market/global",
  async (_, { signal }) => {
    try {
      const response = await fetchJson(GLOBAL_URL, signal);
      if (!response?.data?.total_market_cap?.usd) {
        throw new Error("Global market response was incomplete");
      }
      writeCache("globalCoinsLastCall", response);
      return { data: response, source: "live", fetchedAt: Date.now(), error: null };
    } catch (error) {
      const cached = readCache("globalCoinsLastCall", null);
      const data = cached?.data ? cached : { data: fallbackGlobal };
      return {
        data,
        source: cached?.data ? "cached" : "demo",
        fetchedAt: Date.now(),
        error: error?.message || "Global market data is temporarily unavailable",
      };
    }
  }
);

const initialState = {
  generalCoins: fallbackCoins,
  globalData: { data: fallbackGlobal },
  trendingCoins: fallbackTrending,
  graphData: [],
  status: "idle",
  source: "demo",
  lastUpdated: null,
  error: null,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetcherGeneral.pending, (state) => {
        state.status = state.generalCoins.length ? "refreshing" : "loading";
      })
      .addCase(fetcherGeneral.fulfilled, (state, action) => {
        state.generalCoins = action.payload.data;
        state.status = "ready";
        state.source = action.payload.source;
        state.lastUpdated = action.payload.fetchedAt;
        state.error = action.payload.error;
      })
      .addCase(fetcherGeneral.rejected, (state, action) => {
        state.status = "ready";
        state.error = action.error?.message || "Unable to refresh market data";
      })
      .addCase(fetcherTrending.fulfilled, (state, action) => {
        state.trendingCoins = action.payload.data;
      })
      .addCase(fetcherGlobal.fulfilled, (state, action) => {
        state.globalData = action.payload.data;
      });
  },
});

export const apiActions = apiSlice.actions;
export default apiSlice.reducer;
