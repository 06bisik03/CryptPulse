import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Cached data arrays for general coins, trending coins, and global data
let cachedGeneralCoins = [];
let cachedTrendingCoins = [];
let cachedGlobalData = [];

// Async thunk to fetch general coin data
export const fetcherGeneral = createAsyncThunk("generalCoin", async () => {
  try {
    // Fetch general coin data from API
    const priceUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en";
    const response = await fetch(priceUrl);
    const data = await response.json();

    // Store fetched data in the cache and local storage
    cachedGeneralCoins = data;
    localStorage.setItem("generalCoinsLastCall", JSON.stringify(data));
    console.log(cachedGeneralCoins, data);
    return data;
  } catch (error) {
    // If fetching fails, try to use cached data from local storage
    const cachedData = localStorage.getItem("generalCoinsLastCall");
    if (cachedData) {
      cachedGeneralCoins = JSON.parse(cachedData);
      return cachedGeneralCoins;
    }
    console.log(error);
    return [];
  }
});

// Async thunk to fetch trending coin data
export const fetcherTrending = createAsyncThunk("trendingCoin", async () => {
  try {
    // Fetch trending coin data from API
    const TrendingCoins =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h";
    const response = await fetch(TrendingCoins);
    const data = await response.json();

    // Store fetched data in the cache and local storage
    cachedTrendingCoins = data;
    localStorage.setItem("trendingCoinsLastCall", JSON.stringify(data));

    return data;
  } catch (error) {
    // If fetching fails, try to use cached data from local storage
    const cachedData = localStorage.getItem("trendingCoinsLastCall");
    if (cachedData) {
      cachedTrendingCoins = JSON.parse(cachedData);
      return cachedTrendingCoins;
    }
    return [];
  }
});

// Async thunk to fetch global data
export const fetcherGlobal = createAsyncThunk("global", async () => {
  try {
    // Fetch global data from API
    const globalData = "https://api.coingecko.com/api/v3/global";
    const response = await fetch(globalData);
    const data = await response.json();

    // Store fetched data in local storage
    localStorage.setItem("globalCoinsLastCall", JSON.stringify(data));

    return data;
  } catch (error) {
    // If fetching fails, try to use cached data from local storage
    const cachedData = localStorage.getItem("globalCoinsLastCall");
    if (cachedData) {
      cachedGlobalData = JSON.parse(cachedData);
      return cachedGlobalData;
    }
    return [];
  }
});

// Create a slice for API-related state management
const apiSlice = createSlice({
  name: "api",
  initialState: {
    generalCoins: [],
    globalData: [],
    trendingCoins: [],
    graphData: [],
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetcherGeneral.fulfilled, (state, action) => {
        console.log("xxx");
        // Update state with fetched general coin data on success
        state.generalCoins = action.payload;
      })
      .addCase(fetcherGeneral.rejected, (state, action) => {
        console.log("xxx");
        // Update state with cached or empty data on failure
        state.generalCoins = action.payload;
      })
      .addCase(fetcherTrending.fulfilled, (state, action) => {
        console.log("xxx");
        // Update state with fetched trending coin data on success
        state.trendingCoins = action.payload;
      })
      .addCase(fetcherTrending.rejected, (state, action) => {
        console.log("xxx");
        state.trendingCoins = action.payload;
      })
      .addCase(fetcherGlobal.fulfilled, (state, action) => {
        console.log("xxx");
        // Update state with fetched global data on success
        state.globalData = action.payload;
      })
      .addCase(fetcherGlobal.rejected, (state, action) => {
        console.log("xxx");
        state.globalData = action.payload;
      });
  },
});

// Export actions and reducer from the API slice
export const apiActions = apiSlice.actions;
export default apiSlice.reducer;
//This redux file is responsible for mainly providing the coins that are fetched from the api. However, the limit is very low, so when the limit is passed, it uses cached data for the next 10 minutes, until the IP address is unblocked once again. This way, the user can even do a inferior offline trading in a way.
