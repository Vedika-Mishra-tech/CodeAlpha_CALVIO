const currentDisplay = document.getElementById("currentNumber");
const previousDisplay = document.getElementById("previousNumber");
const buttons = document.querySelectorAll(".buttons button");

let currentNumber = "0";
let previousNumber = "";
let selectedOperator = null;
let shouldStartNewNumber = false;

function updateDisplay() {
    currentDisplay.textContent = currentNumber;
    if (previousNumber !== "" && selectedOperator) {
        previousDisplay.textContent = `${previousNumber} ${selectedOperator}`;
    } else {
        previousDisplay.textContent = "";
    }
}

function addNumber(number) {
    if (currentNumber === "Error" || shouldStartNewNumber) {
        currentNumber = number;
        shouldStartNewNumber = false;
    } else if (currentNumber === "0") {
        currentNumber = number;
    } else if (currentNumber.length < 14) {
        currentNumber += number;
    }
    updateDisplay();
}

function addDecimal() {
    if (currentNumber === "Error" || shouldStartNewNumber) {
        currentNumber = "0";
        shouldStartNewNumber = false;
    }
    if (!currentNumber.includes(".")) {
        currentNumber += ".";
    }
    updateDisplay();
}

function chooseOperator(operator) {
    if (currentNumber === "Error") {
        return;
    }
    if (selectedOperator && !shouldStartNewNumber) {
        calculate();
    }
    previousNumber = currentNumber;
    selectedOperator = operator;
    shouldStartNewNumber = true;
    updateDisplay();
}

function calculate() {
    if (!selectedOperator || previousNumber === "") {
        return;
    }

    const firstNumber = Number(previousNumber);
    const secondNumber = Number(currentNumber);
    let answer;

    switch (selectedOperator) {
        case "+":
            answer = firstNumber + secondNumber;
            break;
        case "-":
            answer = firstNumber - secondNumber;
            break;
        case "*":
            answer = firstNumber * secondNumber;
            break;
        case "/":
            if (secondNumber === 0) {
                currentNumber = "Error";
                previousNumber = "";
                selectedOperator = null;
                shouldStartNewNumber = true;
                updateDisplay();
                return;
            }
            answer = firstNumber / secondNumber;
            break;
        default:
            return;
    }

    currentNumber = String(Number(answer.toPrecision(10)));
    previousNumber = "";
    selectedOperator = null;
    shouldStartNewNumber = true;
    updateDisplay();
}

function clearCalculator() {
    currentNumber = "0";
    previousNumber = "";
    selectedOperator = null;
    shouldStartNewNumber = false;
    updateDisplay();
}

function deleteLastDigit() {
    if (currentNumber === "Error" || shouldStartNewNumber) {
        currentNumber = "0";
        shouldStartNewNumber = false;
    } else if (currentNumber.length > 1) {
        currentNumber = currentNumber.slice(0, -1);
    } else {
        currentNumber = "0";
    }
    updateDisplay();
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.dataset.number !== undefined) {
            addNumber(button.dataset.number);
        } else if (button.dataset.operator !== undefined) {
            chooseOperator(button.dataset.operator);
        } else if (button.dataset.action === "decimal") {
            addDecimal();
        } else if (button.dataset.action === "calculate") {
            calculate();
        } else if (button.dataset.action === "clear") {
            clearCalculator();
        } else if (button.dataset.action === "backspace") {
            deleteLastDigit();
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key >= "0" && event.key <= "9") {
        addNumber(event.key);
    } else if (event.key === ".") {
        addDecimal();
    } else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteLastDigit();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();
