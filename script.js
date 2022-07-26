class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
    }
  
    clear() {
      this.currentOperand = ''
      this.previousOperand = ''
      this.operation = undefined
    }
  
    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
    }
  
    chooseOperation(operation) {
      if (this.currentOperand === '') return
      if (this.previousOperand !== '') {
        this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
  
    compute() {
      let computation
      const prev = parseFloat(this.previousOperand)
      const current = parseFloat(this.currentOperand)
      if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break
        case '÷':
          computation = prev / current
          break
        default:
          return
      }
      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand = ''
    }
  
    getDisplayNumber(number) {
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
  }
  
  
  const numberButtons = document.querySelectorAll('[data-number]')
  const operationButtons = document.querySelectorAll('[data-operation]')
  const equalsButton = document.querySelector('[data-equals]')
  const deleteButton = document.querySelector('[data-delete]')
  const allClearButton = document.querySelector('[data-all-clear]')
  const previousOperandTextElement = document.querySelector('[data-previous-operand]')
  const currentOperandTextElement = document.querySelector('[data-current-operand]')
  
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
  })
  
  allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
  })
  
  deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
  })
  
  document.addEventListener('keydown', function (event) {
    let patternForNumbers = /[0-9]/g;
    let patternForOperators = /[+\-*\/]/g
    if (event.key.match(patternForNumbers)) {
      event.preventDefault();
      calculator.appendNumber(event.key)
      calculator.updateDisplay()
    }
    if (event.key === '.') {
      event.preventDefault();
      calculator.appendNumber(event.key)
      calculator.updateDisplay()
    }
    if (event.key.match(patternForOperators)) {
      event.preventDefault();
      calculator.chooseOperation(event.key)
      calculator.updateDisplay()
    }
    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      calculator.compute()
      calculator.updateDisplay()
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      calculator.delete()
      calculator.updateDisplay()
    }
    if (event.key == 'Delete') {
      event.preventDefault();
      calculator.clear()
      calculator.updateDisplay()
    }
  
  });

 /* class Calculator{
    constructor(input,output,[]) {
        this.inputDisplay = input;
        this.outputDisplay = output;
        this.inputHistory = [];
    }
    clearAll() {
        this.inputDisplay = [];
        this.updateInputDisplay();
        this.updateOutputDisplay("0");
    }
    backspace() {
        switch (this.getLastInputType()){
            case "number":
                if (this.getLastInputValue().length > 1){
                    this.editLastInput(this.getLastInputValue().slice(0,-1),"number");
                } else {
                    this.deleteLastInput();
                }
                break;
            case "operator":
                this.deleteLastInput();
                break;
            default:        
            return;
        }
    }
    insertNumber(value) {
        if (this.getLastInputType() === "numbers"){
            this.appendToLastInput(value);
        } else if (this.getLastInputType() === "operators" || this.getLastInputType() === null){
            this.addNewInput(value,"number");
        }
    }
    insertOperation(value) {
        switch (this.getLastInputType()){
            case "number":
                this.addNewInput(value,"operator");
                break;
            case "operator":
                this.editLastInput(value,"operator");
                break;
            case "equals":
                let output =this.getOutputValue();
                this.clearsAllHistory
                this.addNewInput(output,"number");
                break;
            default:
                return;
        }
    }
    insertDecimalPoint() {
        if (this.getLastInputType() === "number" && !this.getLastInputValue().included(".")){
            this.appendToLastInput(".");
            } else if (this.getLastInputType() === "operator" || this.getLastInputType() === null){
                this.addNewInput("0.", "number");
            }

        }

    generateResult() {
        if (this.getLastInputType() === "number"){
            const self = this;
            const simplifyExpression = function(currentExpression , operator){
                if(currentExpression.indexOf(operator) === -1){
                    return currentExpression;
                } else {
                    let operatorIdx = currentExpression.indexOf(operator);
                    let leftOperandIdx = operatorIdx - 1;
                    let rightOperandIdx = operatorIdx + 1;
                    let partialSolution = self.performOperation(...currentExpression.slice(leftOperandIdx,rightOperandIdx+1));
                    currentExpression.splice(leftOperandIdx, 3, partialSolution.toString());
                    return simplifyExpression(currentExpression, operator);
                }
            }
        let result =["×","+","-","÷"].reduce(simplifyExpression,this.getAllInputValues());
        this.addNewInput("=","equals");
        this.updateOutputDisplay(result.toString());
        }
    }
};
   getAllInputValues(){
       return this.inputHistory.map(entry => entry.value);
   }
   getLastInputType(){
       return (this.inputHistory.length === 0) ? null: this.inputHistory[this.inputHistory.length-1].type;
   }
   getLastInputValue(){
       return (this.inputHistory.length === 0) ? null: this.inputHistory[this.inputHistory.length-1].value;
   }
   getOutputValue(){
       return this.outputDisplay.value.replace(/ /g, ' ');
   }
   addNewInput(value,type){
       this.inputHistory.push({"type": type, "value": value.toString()});
       this.updateInputDisplay();
   }
   appendToLastInput(value){
       this.inputHistory[this.inputHistory.length - 1].value += value.toString();
       this.updateInputDisplay();
   }
   editLastInput(value,type){
       this.inputHistory.pop();
       this.addNewInput(value, type);
   }
   deleteLastInput(){
       this.inputHistory.pop();
       this.updateInputDisplay();
   }
   updateInputDisplay(){
       this.inputDisplay.value = this.getAllInputValues().join(" ");
   }
   updateOutputDisplay(value){
       this.outputDisplay.value = Number(value).toLocaleString();
   }
   performOperation(leftOperand, operation, rightOperand){
       leftOperand = parseFloat(leftOperand);
       rightOperand = parseFloat(rightOperand);
   if(Number.isNaN(leftOperand) || Number.isNaN(rightOperand)){
           return;
       }
        switch (operation){
            case "×":
                return leftOperand*rightOperand;
            case "+":
                return leftOperand+rightOperand;
            case "-":
                return leftOperand-rightOperand;
            case "÷":
                return leftOperand/rightOperand;
            default:
                return;
        }
    }
   


const inputDisplay = document.querySelector("input");
const outputDisplay = document.querySelector("output");
const allClear = document.querySelector("clear");
const backspace = document.querySelector("erase");
const numbers = document.querySelector("numbers");
const decimalP = document.querySelector("decimals");
const operators = document.querySelector("operators");
const equalto = document.querySelector("equal");

const calculator = new Calculator(inputDisplay, outputDisplay);

backspace.addEventListener("click", () => {
    calculator.backspace();
});
allClear.addEventListener("click", () => {
    calculator.clearAll();
});
operators.forEach(button => {
    button.addEventListener("click", (event) => {
        let (target) = event;
        calculator.insertOperation(target.dataset.operators);
    })
});
numbers.forEach(button => {
    button.addEventListener("click", (event) => {
        let (target) = event;
        calculator.insertNumber(target.dataset.numbers);
    })
});
decimalP.addEventListener("click", () => {
    calculator.insertDecimalPoint();
});
equalto.addEventListener("click", () => {
    calculator.generateResult();
});
*/
