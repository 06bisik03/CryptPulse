import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  getDatabase,
  set,
  ref,
  get,
  child,
  onValue,
  update,
  push,
  runTransaction,
} from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCn2O0Ps8PfRkVMWxzOtPPTJTzf4BivWOM",
  authDomain: "cryptpulse-95d1e.firebaseapp.com",
  databaseURL:
    "https://cryptpulse-95d1e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cryptpulse-95d1e",
  storageBucket: "cryptpulse-95d1e.appspot.com",
  messagingSenderId: "443218641075",
  appId: "1:443218641075:web:a744a44245510b863170c6",
  measurementId: "G-5KVYGK25FG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const emptyFn = () => {};
const defaultAccountFlow = {
  deposits: 0,
  investments: 0,
  totalFlow: 0,
};
export const createDefaultUserFinanceDetails = () => ({
  coins: [],
  transactions: [],
  money: 0,
  wallet: {
    cards: {},
  },
  totalFlow: 0,
  deposits: 0,
  investments: 0,
});
const hasValidUserId = (userId) =>
  typeof userId === "string" &&
  userId.trim() !== "" &&
  userId !== "null" &&
  userId !== "undefined";
const normalizeWallet = (wallet) => {
  if (wallet && typeof wallet === "object" && !Array.isArray(wallet)) {
    return {
      ...wallet,
      cards:
        wallet.cards && typeof wallet.cards === "object" && !Array.isArray(wallet.cards)
          ? wallet.cards
          : {},
    };
  }

  return {
    cards: {},
  };
};
const normalizeUserFinanceDetails = (userFinanceDetails) => {
  const defaultFinanceDetails = createDefaultUserFinanceDetails();

  if (
    !userFinanceDetails ||
    typeof userFinanceDetails !== "object" ||
    Array.isArray(userFinanceDetails)
  ) {
    return defaultFinanceDetails;
  }

  return {
    ...defaultFinanceDetails,
    ...userFinanceDetails,
    coins: Array.isArray(userFinanceDetails.coins)
      ? userFinanceDetails.coins
      : defaultFinanceDetails.coins,
    transactions: Array.isArray(userFinanceDetails.transactions)
      ? userFinanceDetails.transactions
      : defaultFinanceDetails.transactions,
    wallet: normalizeWallet(userFinanceDetails.wallet),
  };
};
const getFallbackFullName = (authUser) => {
  if (authUser?.displayName?.trim()) {
    return authUser.displayName.trim();
  }

  if (authUser?.email?.includes("@")) {
    return authUser.email.split("@")[0];
  }

  return "User";
};

//////////////////

// Import necessary functions and modules
const dbRef = ref(db);

// Function to write user data to the database
export async function writeUserData(
  userId,
  userFinance,
  name,
  email,
  dateOfBirth
) {
  if (!hasValidUserId(userId)) {
    throw new Error("Cannot write user data without a valid user id.");
  }

  // Set user data in the database under the "users" collection and the provided userId
  return set(ref(db, "users/" + userId), {
    fullName: name,
    email: email,
    DateOfBirth: dateOfBirth,
    userFinanceDetails: normalizeUserFinanceDetails(userFinance),
  });
}

export const ensureUserRecord = async (authUser, profileOverrides = {}) => {
  if (!authUser?.uid) {
    throw new Error("Cannot ensure user data without an authenticated user.");
  }

  const userRef = ref(db, `users/${authUser.uid}`);
  const snapshot = await get(userRef);
  const existingData = snapshot.exists() ? snapshot.val() : null;
  const fallbackData = {
    fullName: profileOverrides.fullName || getFallbackFullName(authUser),
    email: profileOverrides.email || authUser.email || "",
    DateOfBirth: profileOverrides.dateOfBirth || "",
    userFinanceDetails: normalizeUserFinanceDetails(
      profileOverrides.userFinanceDetails
    ),
  };

  if (!existingData) {
    await set(userRef, fallbackData);
    return fallbackData;
  }

  const normalizedData = {
    fullName: existingData.fullName || fallbackData.fullName,
    email: existingData.email || fallbackData.email,
    DateOfBirth: existingData.DateOfBirth || fallbackData.DateOfBirth,
    userFinanceDetails: normalizeUserFinanceDetails(
      existingData.userFinanceDetails
    ),
  };

  await set(userRef, normalizedData);
  return normalizedData;
};

// Async function to read user data from the database
export const readUserData = async (user) => {
  if (!hasValidUserId(user)) {
    return null;
  }

  try {
    // Get a snapshot of the user's data from the provided user path
    const snapshot = await get(child(dbRef, `users/${user}`));
    // Check if the snapshot exists
    if (snapshot.exists()) {
      // Return the user data from the snapshot
      return snapshot.val();
    } else {
      // Return null if the snapshot doesn't exist
      return null;
    }
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
};

// Initialize authentication using the provided app
export const auth = getAuth(app);

// Async function to buy a coin and update user data accordingly
export const buyCoin = async (transactionDetail) => {
  const userId = transactionDetail?.userLogged;
  const totalCost = Number(transactionDetail?.totalSum);
  const coinAmount = Number(transactionDetail?.coinAmount);

  if (
    !hasValidUserId(userId) ||
    !Number.isFinite(totalCost) ||
    totalCost <= 0 ||
    !Number.isFinite(coinAmount) ||
    coinAmount <= 0
  ) {
    return false;
  }

  const financeRef = ref(
    getDatabase(app),
    `users/${userId}/userFinanceDetails`
  );
  const newCoin = {
    coinId: transactionDetail.coinID,
    coinAmount,
    coinBuyPrice: Number(transactionDetail.coinBuyPrice) || 0,
    coinSymbol: transactionDetail.coinSymbol || "",
    coinImage: transactionDetail.coinImage || "",
    coinName: transactionDetail.coinName || "Unknown asset",
    totalSum: totalCost,
    coinLastUpdate: transactionDetail.coinLastUpdate || "",
    timeOfBuy: transactionDetail.timeOfBuy || Date.now(),
  };

  try {
    const result = await runTransaction(financeRef, (currentValue) => {
      const finance = normalizeUserFinanceDetails(currentValue);
      const money = Number(finance.money) || 0;
      if (money < totalCost) return;

      const coins = [...finance.coins];
      const existingIndex = coins.findIndex(
        (item) => item.coinId === newCoin.coinId
      );

      if (existingIndex >= 0) {
        coins[existingIndex] = {
          ...coins[existingIndex],
          coinAmount: (Number(coins[existingIndex].coinAmount) || 0) + coinAmount,
          totalSum: (Number(coins[existingIndex].totalSum) || 0) + totalCost,
          coinBuyPrice: newCoin.coinBuyPrice,
          coinLastUpdate: newCoin.coinLastUpdate,
        };
      } else {
        coins.push(newCoin);
      }

      return {
        ...finance,
        coins,
        transactions: [...finance.transactions, newCoin],
        money: money - totalCost,
        investments: (Number(finance.investments) || 0) + totalCost,
        totalFlow: (Number(finance.totalFlow) || 0) + totalCost,
      };
    });

    return result.committed;
  } catch (error) {
    console.error("Error completing coin purchase:", error);
    return false;
  }
};

// Async function to get the user's transaction array from the database
export const getTransactionArray = async (userLogged) => {
  if (!hasValidUserId(userLogged)) {
    return [];
  }

  const db = getDatabase(app);
  const transactionsRef = child(
    ref(db),
    `users/${userLogged}/userFinanceDetails/transactions`
  );

  try {
    // Get the snapshot of the user's transactions
    const transactionsSnapshot = await get(transactionsRef);

    // Check if transactions exist for the user
    if (transactionsSnapshot.exists()) {
      // Convert the transactions object into an array and return it
      const transactionsArray = Object.values(transactionsSnapshot.val());
      return transactionsArray;
    } else {
      // Return an empty array if no transactions are found
      return [];
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};
// Set up a listener for changes in the 'coins' array
export const setupCoinsListener = (userLogged, onCoinsChange) => {
  if (!hasValidUserId(userLogged)) {
    onCoinsChange([]);
    return emptyFn;
  }

  const db = getDatabase(app);
  const coinsRef = ref(db, `users/${userLogged}/userFinanceDetails/coins`);

  // Set up a listener using onValue to watch for changes in the 'coins' array
  return onValue(
    coinsRef,
    (snapshot) => {
      const coinsArray = snapshot.val();
      // Check if the snapshot has a value
      if (coinsArray !== null) {
        // Call the provided callback with the updated 'coins' array
        onCoinsChange(coinsArray);
      } else {
        // Handle the case when the array is empty by passing an empty array
        onCoinsChange([]);
      }
    },
    (error) => {
      console.error("Error listening for coins:", error);
      onCoinsChange([]);
    }
  );
};

// Set up a listener for changes in the 'transactions' array
export const setupTransactionsListener = (userLogged, onTransactionsChange) => {
  if (!hasValidUserId(userLogged)) {
    onTransactionsChange([]);
    return emptyFn;
  }

  const db = getDatabase(app);
  const transactionsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/transactions`
  );

  // Set up a listener using onValue to watch for changes in the 'transactions' array
  return onValue(
    transactionsRef,
    (snapshot) => {
      const transactionsArray = snapshot.val();
      // Call the provided callback with the updated 'transactions' array
      onTransactionsChange(transactionsArray || []);
    },
    (error) => {
      console.error("Error listening for transactions:", error);
      onTransactionsChange([]);
    }
  );
};

// Async function to fetch the 'coins' array from Firebase
export const getCoinsArrayFromFirebase = async (userLogged) => {
  if (!hasValidUserId(userLogged)) {
    return [];
  }

  const db = getDatabase(app);
  const coinsRef = child(
    ref(db),
    `users/${userLogged}/userFinanceDetails/coins`
  );

  try {
    const coinsSnapshot = await get(coinsRef);
    if (coinsSnapshot.exists()) {
      // Return the 'coins' array as an array of values
      return Object.values(coinsSnapshot.val());
    } else {
      console.log("No coins found for the user.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching coins:", error);
    return [];
  }
};

// Async function to create wallet and cards folders and add card information
export const createWalletAndCardsFolders = async (userLogged, cardInfo) => {
  if (!hasValidUserId(userLogged) || !cardInfo?.cardNum) {
    throw new Error("A valid user and card are required.");
  }

  const db = getDatabase(app);
  const cardsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/wallet/cards`
  );

  try {
    const cardsData = await get(cardsRef);
    const cardsArray = Object.values(cardsData.val() || {});
    const cardNumberExists = cardsArray.some(
      (card) => card?.cardNum === cardInfo.cardNum
    );

    if (cardNumberExists) {
      throw new Error("This card is already connected.");
    }

    const newCardRef = push(cardsRef);
    await set(newCardRef, cardInfo);
    return true;
  } catch (error) {
    console.error("Error creating wallet and cards folders:", error);
    throw error;
  }
};

export const fundWallet = async (userLogged, amount, cardNumber) => {
  const numericAmount = Number(amount);
  if (
    !hasValidUserId(userLogged) ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0 ||
    !cardNumber
  ) {
    return false;
  }

  const financeRef = ref(
    getDatabase(app),
    `users/${userLogged}/userFinanceDetails`
  );

  try {
    const result = await runTransaction(financeRef, (currentValue) => {
      const finance = normalizeUserFinanceDetails(currentValue);
      const cards = { ...(finance.wallet?.cards || {}) };
      const selectedKey = Object.keys(cards).find(
        (key) => cards[key]?.cardNum === cardNumber
      );
      if (!selectedKey) return;

      cards[selectedKey] = {
        ...cards[selectedKey],
        totalSum: (Number(cards[selectedKey].totalSum) || 0) + numericAmount,
      };

      return {
        ...finance,
        wallet: { ...finance.wallet, cards },
        money: (Number(finance.money) || 0) + numericAmount,
        deposits: (Number(finance.deposits) || 0) + numericAmount,
        totalFlow: (Number(finance.totalFlow) || 0) + numericAmount,
      };
    });

    return result.committed;
  } catch (error) {
    console.error("Error funding wallet:", error);
    return false;
  }
};

// Async function to fetch the 'cards' array from Firebase
export const getCardsArrayFromFirebase = async (userLogged) => {
  if (!hasValidUserId(userLogged)) {
    return [];
  }

  const db = getDatabase(app);
  const cardsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/wallet/cards`
  );

  try {
    const cardsSnapshot = await get(cardsRef);
    if (cardsSnapshot.exists()) {
      // Return the 'cards' array as an array of values
      return Object.values(cardsSnapshot.val());
    } else {
      console.log("No cards found for the user.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
};
// Set up a listener for changes in the 'cards' array
export const setupCardsListener = (userLogged, callback) => {
  if (!hasValidUserId(userLogged)) {
    callback([]);
    return emptyFn;
  }

  const db = getDatabase(app);
  const cardsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/wallet/cards`
  );

  // Set up a listener using onValue to watch for changes in the 'cards' array
  return onValue(cardsRef, (snapshot) => {
    const cardsArray = snapshot.val() || []; // If snapshot.val() is null, use an empty array
    // Call the provided callback with the updated 'cards' array
    callback(cardsArray);
  }, (error) => {
    console.error("Error listening for cards:", error);
    callback([]);
  });
};

// Async function to charge an amount on a specific card
export const ChargeOnCard = async (userLogged, amount, cardNumber) => {
  const db = getDatabase();
  const cardsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/wallet/cards`
  );

  try {
    // Fetch the existing card data
    const cardsSnapshot = await get(cardsRef);
    const cardsData = cardsSnapshot.val() || {};

    // Find the key of the selected card using its cardNumber
    const selectedCardKey = Object.keys(cardsData).find(
      (key) => cardsData[key].cardNum === cardNumber
    );

    console.log(Object.keys(cardsData));

    if (selectedCardKey) {
      // Update the totalSum of the selected card
      const selectedCardRef = child(cardsRef, selectedCardKey);
      const selectedCardSnapshot = await get(selectedCardRef);
      const selectedCardData = selectedCardSnapshot.val();

      // Calculate the updated totalSum
      const updatedTotalSum =
        selectedCardData.totalSum !== undefined
          ? selectedCardData.totalSum + amount
          : amount;

      // Update the 'totalSum' field of the selected card
      await update(selectedCardRef, { totalSum: updatedTotalSum });

      console.log("Charge on card successful.");
    } else {
      console.log("Card not found.");
    }
  } catch (error) {
    console.error("Error charging on card:", error);
  }
};

// Async function to update the user's money, deposits, and total flow
export const updateMoney = async (userLogged, operation, amount) => {
  const db = getDatabase();

  // References to user's money, deposits, and total flow in the database
  const userMoneyRef = ref(db, `users/${userLogged}/userFinanceDetails/money`);
  const userDepositRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/deposits`
  );
  const userFlowRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/totalFlow`
  );

  try {
    // Get the current money value
    const moneySnapshot = await get(userMoneyRef);
    const currentMoney = moneySnapshot.val() || 0; // Default to 0 if money doesn't exist

    let updatedMoney;

    if (operation === "minus") {
      updatedMoney = currentMoney - amount;
    } else if (operation === "plus") {
      updatedMoney = currentMoney + amount;
    }

    if (typeof updatedMoney === "number") {
      // Update the money value
      await set(userMoneyRef, updatedMoney);
      console.log("Money updated successfully.");

      // Update the deposits value
      const userDepositSnapshot = await get(userDepositRef);
      const currentDeposits = userDepositSnapshot.val() || 0;
      const updatedDeposits = currentDeposits + amount;

      // Update the total flow value
      const userFlowSnapshot = await get(userFlowRef);
      const currentFlow = userFlowSnapshot.val() || 0;
      const updatedFlow = currentFlow + amount;

      // Update the deposits and total flow values in the database
      await set(userDepositRef, updatedDeposits);
      await set(userFlowRef, updatedFlow);

      console.log("Deposits and total flow updated successfully.");
      return true;
    } else {
      console.error("Updated money value is not a number.");
    }
  } catch (error) {
    console.error("Error updating money:", error);
    return false;
  }
};
// Async function to read user finance details from Firebase
export const readUserFinanceDetails = async (userId) => {
  if (!hasValidUserId(userId)) {
    return null;
  }

  const db = getDatabase(app);
  const financeDetailsRef = ref(db, `users/${userId}/userFinanceDetails`);

  try {
    const snapshot = await get(financeDetailsRef);
    if (snapshot.exists()) {
      // Return user's finance details
      return snapshot.val();
    } else {
      console.log("User finance details not found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading user finance details:", error);
    return null;
  }
};

// Async function to access account flow details for a user
export const accessAccountFlow = async (userLogged) => {
  if (!hasValidUserId(userLogged)) {
    return defaultAccountFlow;
  }

  const db = getDatabase(app);

  // References to user's deposits, investments, and total flow in the database
  const userDepositsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/deposits`
  );
  const userFlowRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/totalFlow`
  );
  const userInvestmentsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/investments`
  );

  try {
    // Fetch values from the references
    const userDepositsSnapshot = await get(userDepositsRef);
    const userFlowSnapshot = await get(userFlowRef);
    const userInvestmentsSnapshot = await get(userInvestmentsRef);

    const userDeposits = userDepositsSnapshot.val() || 0;
    const userFlow = userFlowSnapshot.val() || 0;
    const userInvestments = userInvestmentsSnapshot.val() || 0;

    // Return an object containing the account flow details
    return {
      deposits: userDeposits,
      totalFlow: userFlow,
      investments: userInvestments,
    };
  } catch (error) {
    console.error("Error fetching account flow:", error);
    return null;
  }
};

// Set up listeners for changes in account flow details
export const setupAccountFlowListener = (userLogged, onAccountFlowChange) => {
  if (!hasValidUserId(userLogged)) {
    onAccountFlowChange(defaultAccountFlow);
    return emptyFn;
  }

  const db = getDatabase(app);

  // References to user's deposits, investments, and total flow in the database
  const userDepositsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/deposits`
  );
  const userInvestmentsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/investments`
  );
  const userFlowRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/totalFlow`
  );

  // Set up listeners for userDeposits, userInvestments, and userFlow using onValue
  const unsubscribeDeposits = onValue(
    userDepositsRef,
    (snapshot) => {
      const deposits = snapshot.val() || 0;
      onAccountFlowChange((prevState) => ({ ...prevState, deposits }));
    },
    (error) => {
      console.error("Error listening for deposits:", error);
      onAccountFlowChange((prevState) => ({ ...prevState, deposits: 0 }));
    }
  );

  const unsubscribeInvestments = onValue(
    userInvestmentsRef,
    (snapshot) => {
      const investments = snapshot.val() || 0;
      onAccountFlowChange((prevState) => ({ ...prevState, investments }));
    },
    (error) => {
      console.error("Error listening for investments:", error);
      onAccountFlowChange((prevState) => ({ ...prevState, investments: 0 }));
    }
  );

  const unsubscribeFlow = onValue(
    userFlowRef,
    (snapshot) => {
      const totalFlow = snapshot.val() || 0;
      onAccountFlowChange((prevState) => ({ ...prevState, totalFlow }));
    },
    (error) => {
      console.error("Error listening for total flow:", error);
      onAccountFlowChange((prevState) => ({ ...prevState, totalFlow: 0 }));
    }
  );

  return () => {
    unsubscribeDeposits();
    unsubscribeInvestments();
    unsubscribeFlow();
  };
};

// Set up a listener for changes in the user's money field
export const setupMoneyListener = (userLogged, onMoneyChange) => {
  if (!hasValidUserId(userLogged)) {
    onMoneyChange(0);
    return emptyFn;
  }

  const db = getDatabase(app);
  const userMoneyRef = ref(db, `users/${userLogged}/userFinanceDetails`);

  // Set up a listener using onValue to watch for changes in the user's money field
  return onValue(
    userMoneyRef,
    (snapshot) => {
      const userFinanceDetails = snapshot.val() || {};
      const money = userFinanceDetails.money || 0;

      // Call the provided callback with the updated money value
      onMoneyChange(money);
    },
    (error) => {
      console.error("Error listening for money:", error);
      onMoneyChange(0);
    }
  );
};

// Async function to sell a coin and update user's coin and transaction data
export const sellCoin = async (transactionDetail) => {
  const userId = transactionDetail?.userLogged;
  const sellAmount = Number(transactionDetail?.coinAmount);
  const proceeds = Number(transactionDetail?.totalSum);

  if (
    !hasValidUserId(userId) ||
    !Number.isFinite(sellAmount) ||
    sellAmount <= 0 ||
    !Number.isFinite(proceeds) ||
    proceeds < 0
  ) {
    return false;
  }

  const financeRef = ref(
    getDatabase(app),
    `users/${userId}/userFinanceDetails`
  );

  try {
    const result = await runTransaction(financeRef, (currentValue) => {
      const finance = normalizeUserFinanceDetails(currentValue);
      const coins = [...finance.coins];
      const existingIndex = coins.findIndex(
        (item) =>
          item.coinId === transactionDetail.coinID ||
          item.coinName === transactionDetail.coinName
      );
      if (existingIndex < 0) return;

      const currentCoin = coins[existingIndex];
      const ownedAmount = Number(currentCoin.coinAmount) || 0;
      if (sellAmount > ownedAmount) return;

      const remainingAmount = ownedAmount - sellAmount;
      if (remainingAmount <= 0) {
        coins.splice(existingIndex, 1);
      } else {
        coins[existingIndex] = {
          ...currentCoin,
          coinAmount: remainingAmount,
          totalSum:
            (Number(currentCoin.totalSum) || 0) *
            (remainingAmount / ownedAmount),
        };
      }

      const newTransaction = {
        coinId: transactionDetail.coinID,
        coinAmount: sellAmount,
        coinSymbol: transactionDetail.coinSymbol || currentCoin.coinSymbol || "",
        coinImage: transactionDetail.coinImage || currentCoin.coinImage || "",
        coinName: transactionDetail.coinName || currentCoin.coinName,
        totalSum: proceeds,
        timeOfSell: transactionDetail.timeOfSell || Date.now(),
      };

      return {
        ...finance,
        coins,
        transactions: [...finance.transactions, newTransaction],
        money: (Number(finance.money) || 0) + proceeds,
        totalFlow: (Number(finance.totalFlow) || 0) + proceeds,
      };
    });

    return result.committed;
  } catch (error) {
    console.error("Error selling coin:", error);
    return false;
  }
};
