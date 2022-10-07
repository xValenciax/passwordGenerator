// GLOBAL VARIABLES
const clipboardIcon = document.querySelector("#clipboard");
// password generator
const Lowercase = [..."abcdefghijklmnopqrstuvwxyz"];
const Uppercase = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const Digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const Symbols = [..."!-$^+"];
const space = " ";

const lengthIndicator = document.querySelector("#pass__length");
const lengthOutput = document.querySelector(".length__text>span");
const options = Array.from(document.querySelectorAll("input[type='checkbox']"));
const settings = document.querySelector(".options");
const strength = document.querySelector(".strength");
const passField = document.querySelector("#pass");
const generateBtn = document.querySelector("button");

// percentage for the slider
let precentage;
// pool size for pass entropy
let availablePoolSize = 26;
// tracked options
let opts = ["Lowercase"];

// FUNCTIONS
const setStrengthColor = (ele, entropy) => {
  if (entropy < 25) {
    if (ele) ele.style.backgroundColor = "#E64A4A";
  } else if (entropy >= 25 && entropy < 50) {
    if (ele) ele.style.backgroundColor = "#f1c80b";
  } else if (entropy >= 50 && entropy < 75) {
    if (ele) ele.style.backgroundColor = "#4285F4";
  } else {
    if (ele) ele.style.backgroundColor = "#42f450";
  }
};

const calcAndSetEntropy = (poolSize, length, ele) => {
  let Entropy = Math.log2(poolSize ** Number(length));
  Entropy = Entropy > 100 ? 100 : Entropy;
  ele.style.width = `${Entropy}%`;
  return Entropy;
};

const findDuplicate = (str, let) => {
  return str.search(let) === -1;
};

const copyToClipboard = (input) => {
  navigator.clipboard.writeText(input.value).then(() => {
    clipboardIcon.innerText = "done";
    clipboardIcon.style.color = "#4285F4";
    setTimeout(() => {
      clipboardIcon.innerText = "copy_all";
      clipboardIcon.style.color = "#707070";
    }, 1500);
  });
};

const passGen = (field, opts = ["Lowercase"]) => {
  let generatorSeed = [Lowercase, Uppercase, Digits, Symbols, space];
  field.value = "";

  if (typeof opts[1] !== "string") {
    // generatorSeed.splice(1, 1);
    generatorSeed.splice(generatorSeed.indexOf(Uppercase), 1);
  }
  if (typeof opts[2] !== "string") {
    // generatorSeed.splice(2, 1);
    generatorSeed.splice(generatorSeed.indexOf(Digits), 1);
  }
  if (typeof opts[3] !== "string") {
    // generatorSeed.splice(3, 1);
    generatorSeed.splice(generatorSeed.indexOf(Symbols), 1);
  }
  if (typeof opts[4] !== "string") {
    // generatorSeed.splice(3, 1);
    generatorSeed.splice(generatorSeed.indexOf(space), 1);
  }
  for (let i = 0; i < lengthIndicator.value; i++) {
    const randInd = Math.floor(Math.random() * generatorSeed.length);
    const randLetter = Math.floor(
      Math.random() * generatorSeed[randInd].length
    );

    const isNoDup =
      typeof opts[5] === "string"
        ? findDuplicate(field.value, generatorSeed[randInd][randLetter])
        : true;

    if (isNoDup) field.value += generatorSeed[randInd][randLetter];
    else i--;
  }
  field.value = field.value.trim();
};

clipboardIcon.addEventListener("click", (e) => {
  copyToClipboard(passField);
});

// generate initial password
passGen(passField);

// set inital password strength
let passEntropy = calcAndSetEntropy(
  availablePoolSize,
  lengthIndicator.value,
  strength
);
// fill initial strength bar
setStrengthColor(strength, passEntropy);

// set initial length output
lengthOutput.innerText = lengthIndicator.value;

// set initial percentage of the length
precentage = (lengthIndicator.value / 30) * 100;

// fill initial background percentage
lengthIndicator.style.background = `linear-gradient(to right,
    rgb(66, 133, 244) ${String(precentage)}%,
    #DFDFDF ${String(precentage)}%)`;

/* length indicator */
lengthIndicator.addEventListener("input", (e) => {
  lengthOutput.innerText = e.target.value;
  // calcualte percentage of the value relative to the wigth of the slider
  precentage = (e.target.value / 30) * 100;
  lengthIndicator.style.background = `linear-gradient(to right,
            rgb(66, 133, 244) ${String(precentage)}%,
            #DFDFDF ${String(precentage)}%)`;

  // calculate password strength
  let passEntropy = calcAndSetEntropy(
    availablePoolSize,
    e.target.value,
    strength
  );
  // generate new password
  passGen(passField, opts);
  // calculate the strength bar
  setStrengthColor(strength, passEntropy);
});

/* passwrod strength checker */

settings.addEventListener("change", (e) => {
  // initial poolSize
  availablePoolSize = 26;
  for (const option of options) {
    if (option.checked && option.name !== "Lowercase") {
      // increment pool size with the value of each checkbox's range
      availablePoolSize += option.value;

      //keep track of which checkboxes are checked in order to generate a correct password
      if (option.name === "Uppercase") opts[1] = option.name;
      else if (option.name === "Digits") opts[2] = option.name;
      else if (option.name === "Symbols") opts[3] = option.name;
      else if (option.name === "Spaces") opts[4] = option.name;
      else if (option.name === "Dupilcates") opts[5] = option.name;
    } else if (!option.checked) {
      // if an option is unchecked but is still tracked remove it
      if (option.name === "Uppercase" && typeof opts[1] === "string")
        opts.splice(1, 1);
      else if (option.name === "Digits" && typeof opts[2] === "string")
        opts.splice(2, 1);
      else if (option.name === "Symbols" && typeof opts[3] === "string")
        opts.splice(3, 1);
      else if (option.name === "Spaces" && typeof opts[4] === "string")
        opts.splice(4, 1);
      else if (option.name === "Dupilcates" && typeof opts[5] === "string")
        opts.splice(5, 1);
    }
  }
  // calc entropy for the new password
  let passEntropy = calcAndSetEntropy(
    availablePoolSize,
    lengthIndicator.value,
    strength
  );
  // generate password
  passGen(passField, opts);
  // set strength bar
  setStrengthColor(strength, passEntropy);
});

// button click event
generateBtn.addEventListener("click", () => {
  // calc entropy for the new password
  let passEntropy = calcAndSetEntropy(
    availablePoolSize,
    lengthIndicator.value,
    strength
  );
  // generate password
  passGen(passField, opts);
  // set strength bar
  setStrengthColor(strength, passEntropy);
});
