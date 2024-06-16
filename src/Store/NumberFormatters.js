//1-18:  This function takes a string representing a number and formats it according to certain conditions.
export const NumberFormatter3 = (numberInString) => {
  const numberInInt = parseFloat(numberInString);
  let returnal, digits;

  if (numberInInt < 0) {
    // Format negative numbers to 3 significant digits.
    returnal = numberInInt.toPrecision(3); 
  } else {
    digits = Math.floor(Math.log10(Math.abs(numberInInt))) + 1;
    // Check if the number of digits is greater than 6.
    if (digits > 6) {
       // Call a function to abbreviate large numbers.
      returnal = abbreviateNumber(numberInInt, digits);
    } else {
      // Return the original number for digits <= 6.
      returnal = numberInInt;
    }
  }
  return returnal;
};
//Func 19-41: This is a function that takes a number and its amount of digits and abbreviates it with letters such as 4K,4M,4T
// It uses abbreviation characters such as T, M, B based on the number's scale.
function abbreviateNumber(number, digits) {
  let returnal;
  let numAbb;
  const num = digits % 15;

  // Determine the abbreviation character and the number of digits to keep.
  if (num === 0) {
    numAbb = 3;
    returnal = "T"; // Abbreviation for trillion.
  } else if (num < 10 && num !== 0) {
    numAbb = digits % 6;
    returnal = "M"; // Abbreviation for million.
  } else if (num < 13) {
    numAbb = digits % 9;
    returnal = "B"; // Abbreviation for billion.
  } else {
    numAbb = digits % 12;
    returnal = "T"; // Abbreviation for trillion.
  }

  const numberAbbreviated = number.toString().slice(0, numAbb); // Get the abbreviated portion of the number.
  return `${numberAbbreviated} ${returnal}`; // Combine abbreviation and number portion.
}

export const countZerosAfterDecimal = (number) => {
  const decimalString = number.toString();
  const decimalPart = decimalString.split('.')[1]; // Get the decimal part after the dot
  
  if (!decimalPart) {
    return 0; // No decimal part, no zeros
  }
  
  let zeroCount = 0;
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] === '0') {
      zeroCount++;
    } else {
      break; // Stop counting when a non-zero digit is encountered
    }
  }
  
  return zeroCount;
}


