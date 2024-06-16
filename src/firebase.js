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
const db = getDatabase();

//////////////////

// Import necessary functions and modules
const dbRef = ref(getDatabase());

// Function to write user data to the database
export function writeUserData(
  userId,
  userFinance,
  name,
  email,
  password,
  dateOfBirth
) {
  // Set user data in the database under the "users" collection and the provided userId
  set(ref(db, "users/" + userId), {
    fullName: name,
    email: email,
    password: password,
    DateOfBirth: dateOfBirth,
    userFinanceDetails: userFinance,
  });
}

// Async function to read user data from the database
export const readUserData = async (user) => {
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
    // Throw any error that occurs during the process
    throw error;
  }
};

// Initialize authentication using the provided app
export const auth = getAuth(app);

// Async function to buy a coin and update user data accordingly
export const buyCoin = async (transactionDetail) => {
  const db = getDatabase();

  // Fetch the user's financial information from the database
  const userMoneyRef = ref(
    db,
    `users/${transactionDetail.userLogged}/userFinanceDetails/money`
  );
  const userInvestmentsRef = ref(
    db,
    `users/${transactionDetail.userLogged}/userFinanceDetails/investments`
  );
  const userFlowRef = ref(
    db,
    `users/${transactionDetail.userLogged}/userFinanceDetails/totalFlow`
  );

  // Get the current money value of the user
  const userMoneySnapshot = await get(userMoneyRef);
  const userMoney = userMoneySnapshot.val();

  // Calculate the total cost of the transaction
  const totalCost = parseFloat(transactionDetail.totalSum);

  // Check if the user has enough money for the transaction
  if (userMoney >= totalCost) {
    // Create a new coin object containing transaction details
    const newCoin = {
      coinId: transactionDetail.coinID,
      coinAmount: parseFloat(transactionDetail.coinAmount),
      coinBuyPrice: transactionDetail.coinBuyPrice,
      coinSymbol: transactionDetail.coinSymbol,
      coinImage: transactionDetail.coinImage,
      coinName: transactionDetail.coinName,
      totalSum: transactionDetail.totalSum,
      coinLastUpdate: transactionDetail.coinLastUpdate,
      timeOfBuy: transactionDetail.timeOfBuy,
    };

    // References to user's coins and transactions in the database
    const coinsRef = child(
      ref(db),
      `users/${transactionDetail.userLogged}/userFinanceDetails/coins`
    );
    const transactionsRef = child(
      ref(db),
      `users/${transactionDetail.userLogged}/userFinanceDetails/transactions`
    );

    // Fetch user's investments and update them
    const userInvestmentsSnapshot = await get(userInvestmentsRef);
    const userInvestments = userInvestmentsSnapshot.val();
    const updatedInvestments = userInvestments + totalCost;
    await set(userInvestmentsRef, updatedInvestments);

    // Fetch user's total flow and update it
    const userFlowSnapshot = await get(userFlowRef);
    const userFlow = userFlowSnapshot.val();
    const updatedFlow = userFlow + totalCost;
    await set(userFlowRef, updatedFlow);

    try {
      // Fetch the current coins array from the database
      const coinsSnapshot = await get(coinsRef);
      let currentCoins = coinsSnapshot.val();

      // If currentCoins is not an array or is undefined, initialize it as an empty array
      if (!Array.isArray(currentCoins)) {
        currentCoins = [];
      }

      // Check if the new coin already exists in the user's coins
      const existingCoinIndex = currentCoins.findIndex(
        (item) => item.coinId === newCoin.coinId
      );

      if (existingCoinIndex !== -1) {
        // Update the existing coin's information
        currentCoins[existingCoinIndex].coinAmount += newCoin.coinAmount;
        currentCoins[existingCoinIndex].totalSum =
          parseFloat(currentCoins[existingCoinIndex].totalSum) +
          newCoin.totalSum;
        console.log(
          "coin updated so ",
          currentCoins[existingCoinIndex].totalSum,
          newCoin.totalSum
        );
      } else {
        // Add the new coin to the user's coins array
        currentCoins.push(newCoin);
        console.log("Coin added:", newCoin);
      }

      // Write the updated coins array back to the database
      await set(coinsRef, currentCoins);

      // Similarly, update the transactions array
      const transactionsSnapshot = await get(transactionsRef);
      let currentTransactions = transactionsSnapshot.val();

      // If currentTransactions is not an array or is undefined, initialize it as an empty array
      if (!Array.isArray(currentTransactions)) {
        currentTransactions = [];
      }

      // Add the new transaction to the user's transactions array
      currentTransactions.push(newCoin);

      // Write the updated transactions array back to the database
      await set(transactionsRef, currentTransactions);

      // Deduct the transaction cost from the user's money
      const updatedMoney = userMoney - totalCost;
      await set(userMoneyRef, updatedMoney);

      console.log("Coin added successfully. Money deducted.");
    } catch (error) {
      console.error("Error adding coin:", error);
    }
    // Return true to indicate successful transaction
    return true;
  } else {
    // Return false if the user doesn't have enough money
    return false;
  }
};

// Async function to get the user's transaction array from the database
export const getTransactionArray = async (userLogged) => {
  const db = getDatabase();
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
  const db = getDatabase();
  const coinsRef = ref(db, `users/${userLogged}/userFinanceDetails/coins`);

  // Set up a listener using onValue to watch for changes in the 'coins' array
  onValue(coinsRef, (snapshot) => {
    const coinsArray = snapshot.val();
    // Check if the snapshot has a value
    if (coinsArray !== null) {
      // Call the provided callback with the updated 'coins' array
      onCoinsChange(coinsArray);
    } else {
      // Handle the case when the array is empty by passing an empty array
      onCoinsChange([]);
    }
  });
};

// Set up a listener for changes in the 'transactions' array
export const setupTransactionsListener = (userLogged, onTransactionsChange) => {
  const db = getDatabase();
  const transactionsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/transactions`
  );

  // Set up a listener using onValue to watch for changes in the 'transactions' array
  onValue(transactionsRef, (snapshot) => {
    const transactionsArray = snapshot.val();
    // Call the provided callback with the updated 'transactions' array
    onTransactionsChange(transactionsArray);
  });
};

// Async function to fetch the 'coins' array from Firebase
export const getCoinsArrayFromFirebase = async (userLogged) => {
  const db = getDatabase();
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
  const db = getDatabase();

  const walletRef = ref(db, `users/${userLogged}/userFinanceDetails/wallet`);
  const cardsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/wallet/cards`
  );

  try {
    // Check if the wallet folder exists
    const walletSnapshot = await get(walletRef);
    if (!walletSnapshot.exists()) {
      // Create the wallet folder if it doesn't exist
      await set(walletRef, true);
    }

    // Check if the cards folder exists
    const cardsSnapshot = await get(cardsRef);
    if (!cardsSnapshot.exists()) {
      // Create the cards folder if it doesn't exist
      await set(cardsRef, true);
    }

    // Fetch the existing card data and check if the card number already exists
    const cardsData = await get(cardsRef);
    const cardsArray = Object.values(cardsData.val() || {});
    const cardNumberExists = cardsArray.some((card) => {
      console.log(card, cardInfo);
      return card.cardNum === cardInfo.cardNum;
    });

    if (cardNumberExists) {
      console.log("Card number already exists in the 'cards' folder.");
      return;
    }

    // Push the new card information into the 'cards' folder
    const newCardRef = push(cardsRef);
    await set(newCardRef, cardInfo);

    console.log(
      "Wallet and cards folders created, card info added successfully."
    );
  } catch (error) {
    console.error("Error creating wallet and cards folders:", error);
  }
};

// Async function to fetch the 'cards' array from Firebase
export const getCardsArrayFromFirebase = async (userLogged) => {
  const db = getDatabase();
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
  const db = getDatabase();
  const cardsRef = ref(
    db,
    `users/${userLogged}/userFinanceDetails/wallet/cards`
  );

  // Set up a listener using onValue to watch for changes in the 'cards' array
  return onValue(cardsRef, (snapshot) => {
    const cardsArray = snapshot.val() || []; // If snapshot.val() is null, use an empty array
    // Call the provided callback with the updated 'cards' array
    callback(cardsArray);
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
  const db = getDatabase();
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
  const db = getDatabase();

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
  const db = getDatabase();

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
  onValue(userDepositsRef, (snapshot) => {
    const deposits = snapshot.val() || 0;
    onAccountFlowChange((prevState) => ({ ...prevState, deposits }));
  });

  onValue(userInvestmentsRef, (snapshot) => {
    const investments = snapshot.val() || 0;
    onAccountFlowChange((prevState) => ({ ...prevState, investments }));
  });

  onValue(userFlowRef, (snapshot) => {
    const totalFlow = snapshot.val() || 0;
    onAccountFlowChange((prevState) => ({ ...prevState, totalFlow }));
  });
};

// Set up a listener for changes in the user's money field
export const setupMoneyListener = (userLogged, onMoneyChange) => {
  const db = getDatabase();
  const userMoneyRef = ref(db, `users/${userLogged}/userFinanceDetails`);

  // Set up a listener using onValue to watch for changes in the user's money field
  onValue(userMoneyRef, (snapshot) => {
    const userFinanceDetails = snapshot.val() || {};
    const money = userFinanceDetails.money || 0;

    // Call the provided callback with the updated money value
    onMoneyChange(money);
  });
};

// Async function to sell a coin and update user's coin and transaction data
export const sellCoin = async (transactionDetail) => {
  const db = getDatabase();

  // References to user's coins and transactions in the database
  const coinsRef = child(
    ref(db),
    `users/${transactionDetail.userLogged}/userFinanceDetails/coins`
  );
  const transactionsRef = child(
    ref(db),
    `users/${transactionDetail.userLogged}/userFinanceDetails/transactions`
  );

  try {
    // Fetch the user's coins data
    const coinsSnapshot = await get(coinsRef);
    const currentCoins = coinsSnapshot.val();

    // Find the index of the existing coin based on coinName
    const existingCoinIndex = currentCoins.findIndex(
      (item) => item.coinName === transactionDetail.coinName
    );

    if (existingCoinIndex !== -1) {
      // Update coin data
      const updatedCoinAmount =
        currentCoins[existingCoinIndex].coinAmount -
        parseFloat(transactionDetail.coinAmount);
      const updatedCoinSum =
        currentCoins[existingCoinIndex].totalSum -
        parseFloat(transactionDetail.totalSum);

      // If the coin amount reaches zero, remove the coin from the array
      if (updatedCoinAmount <= 0) {
        currentCoins.splice(existingCoinIndex, 1);
        console.log("Coin removed:", transactionDetail.coinName);
      } else {
        // Update coin details in the coins array
        currentCoins[existingCoinIndex].coinAmount = updatedCoinAmount;
        currentCoins[existingCoinIndex].totalSum = updatedCoinSum;
        console.log("Coin updated:", currentCoins[existingCoinIndex].coinName);
      }

      // Update the coins array in the database
      await set(coinsRef, currentCoins);

      // Create a new transaction for the sale
      const newTransaction = {
        coinId: transactionDetail.coinID,
        coinAmount: parseFloat(transactionDetail.coinAmount),
        coinSymbol: transactionDetail.coinSymbol,
        coinImage: transactionDetail.coinImage,
        coinName: transactionDetail.coinName,
        totalSum: transactionDetail.totalSum,
        timeOfSell: transactionDetail.timeOfSell,
      };

      // Fetch the current transactions array from the database
      const transactionsSnapshot = await get(transactionsRef);
      let currentTransactions = transactionsSnapshot.val();

      // If currentTransactions is not an array or is undefined, initialize it as an empty array
      if (!Array.isArray(currentTransactions)) {
        currentTransactions = [];
      }

      // Push the new transaction to the transactions array
      currentTransactions.push(newTransaction);

      // Write the updated transactions array back to the database
      await set(transactionsRef, currentTransactions);

      console.log("Coin sold successfully.");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error selling coin:", error);
    return false;
  }
};
