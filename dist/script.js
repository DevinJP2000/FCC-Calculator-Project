import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import { useState } from 'https://esm.sh/react@18.2.0';

//This is a constant array determining the order of operations of the calculator.
const orderOfOperations = ['/', '*', '-', '+'];

function App() {

  //This app edits currentvalue as numbers and decimals are put in, and sends the value to a formula array when an operator is pressed. When equals is pressed, the formula is broken down into simple operations for the math to work out.
  const [currentValue, setCurrentValue] = useState('0');
  const [formula, setFormula] = useState([]);

  //Resultflag is the value so that the program knows whether currentValue is the result of a formula or not. If it is, the formula and value are cleared when a number is pressed or the formula is started again with the result if an operator is pressed.
  const [resultFlag, setResultFlag] = useState(false);

  //This function is called whenever a number, decimal, or sign is pressed. The input is added to currentValue.
  function updateValue(value) {

    //This occurs when the currentValue is a result. It will clear the formula and start anew with the given number.
    if (resultFlag) {
      console.log(resultFlag);
      setFormula([]);
      setCurrentValue(value);
      setResultFlag(false);
    }

    //This function is to make sure there are no other decimals in the formula, as a number can only have one.
    else if (value == '.') {
        if (currentValue.indexOf('.') == -1) {
          setCurrentValue(currentValue + value);
        }
      }

      //This function tells if the number is currently zero. If it is, the zero is replaced with the given number.
      else if (currentValue == '0') {
          setCurrentValue(value);
        }

        //This function is similar to the last one, but if the zero has a minus sign, then the new number will have a minus sign as well.
        else if (currentValue == '-0') {
            setCurrentValue('-' + value);
          }

          //If none of the prior conditions are met, the input is concattenated into the current value.
          else {
              setCurrentValue(currentValue + value);
            }
  }

  //This function occurs when the Clear button is pressed. It wipes the current value to 0 and empties the formula.
  function clear() {
    setCurrentValue('0');
    setFormula([]);
    setResultFlag(false);
  }

  //This function is called whenever the *, /, +, or - signs are pressed.
  function addOperator(sign) {

    //These are local copies of currentValue and formula so that they can be altered throughout the function.
    let tempValue = currentValue.slice();
    let tempFormula = formula.slice();



    if (tempValue == 'NaN') {
      tempValue = 0;
    }

    //If the result flag is true, it wipes the current formula clean and sends the current value into it, then adds the operator given.
    if (resultFlag) {
      setFormula([tempValue, sign]);
      setResultFlag(false);
      setCurrentValue('0');
      return;
    }

    //This function makes sure the last entry in the formula is an operator, and if it is, it removes that operator and adds the given one, changing it in the formula.
    if (/[*\/+-]/.test(tempFormula[tempFormula.length - 1]) && (currentValue == '0' || currentValue == '-0') && sign != '-') {
      setCurrentValue('0');
      tempFormula.pop();
      setFormula([...tempFormula, sign]);
      return;
    }

    //The subtraction button can also be used to make a number negative. If the value is zero and the button pressed was subtract, it turns the zero into a minus sign instead of any operator handling.
    if (currentValue == '0' && sign == '-') {
      setCurrentValue('-0');
      return;
    }

    //This turns the string into a number, removing any unnessessary decimals. Any chance of it being anything other than a number is negated by the previous functions.
    tempValue = tempValue / 1;

    //This sets the formula to the current formula + the current value + the sign. It also resets the current value.
    setFormula([...tempFormula, tempValue, sign]);
    setCurrentValue('0');
  }

  //This function reverses the sign of the current value.
  function reverseSign() {
    if (currentValue.charAt(0) != '-') {
      setCurrentValue('-' + currentValue);
    } else
    {
      setCurrentValue(currentValue.slice(1));
    }
  }

  //This function calculates the formula down to a single number.
  function equalsResult() {

    //This calls the calculate function to reduce the function down to a single value.
    let result = calculate([...formula, currentValue]);

    //This completes the formula for a full showing on the screen.
    setFormula([...formula, currentValue, '=', result]);
    setCurrentValue(result);
    setResultFlag(true);
  }

  //This function compiles the string functions into equations to perform calculations on.
  function calculate(incFormula) {

    //This is a local copy of the received formula  to do calculations on.
    let resultInProgress = [...incFormula];

    //This loop cycles through the order of operations. 
    for (let j = 0; j < orderOfOperations.length; j++) {
      //This loop scans through the formula.
      for (let i = 0; i < resultInProgress.length; i++) {
        //If loop is currently on the operator provided by the order of operations loop, it enters the calculation ladder.
        if (resultInProgress[i] == orderOfOperations[j]) {

          //numBefore is the number before the operator, and numAfter is the number after the operator. Operator being the found operator it is currently on.  
          let numBefore = parseFloat(resultInProgress[i - 1]);
          let numAfter = parseFloat(resultInProgress[i + 1]);

          //tempNum is the result of the number before and the number after the operator calculated with the operator.
          let tempNum = 0;

          //The following 4 if statements take the operator the first loop is currently on and uses the appropriate math associated with it.
          if (orderOfOperations[j] == '*') {
            tempNum = numBefore * numAfter;
          }

          if (orderOfOperations[j] == '/') {
            tempNum = numBefore / numAfter;
          }

          if (orderOfOperations[j] == '+') {
            tempNum = numBefore + numAfter;
          }

          if (orderOfOperations[j] == '-') {
            tempNum = numBefore - numAfter;
          }
          //arrayStart and arrayEnd are the pieces of the array before and after the 3 positions involved with the calculations.
          let arrayStart = resultInProgress.slice(0, i - 1);
          let arrayEnd = resultInProgress.slice(i + 2);
          //If there are no numbers before or after the calculation, the resulting array will only be the result from the calculations.
          if (arrayStart.length == 0 && arrayEnd.length == 0) {
            resultInProgress = [tempNum];
          }

          //If the former half of the array is empty, the resulting array will be the result and the latter array.
          else if (arrayStart.length == 0) {
              resultInProgress = [tempNum, ...arrayEnd];
            }

            //If the latter half of the array is empty, the resulting array will be the former array and the result.
            else if (arrayEnd.length == 0) {
                resultInProgress = [...arrayStart, tempNum];
              }
              //If both the former and latter arrays are not empty, the resulting array will be the former array, the result, then the latter array.
              else {
                  resultInProgress = [...arrayStart, tempNum, ...arrayEnd];
                }

          //Since the array being scanned is modified in this process, the array's counter is subtracted by 2 to bring it back to the next number it must scan.
          i = i - 2;
        }
      }
    }
    //Once the entire formula has been calculated through, it is returned to the function that called it.
    return resultInProgress;

  }

  return /*#__PURE__*/(
    React.createElement("div", { id: "calculator" }, /*#__PURE__*/
    React.createElement("div", { id: "display-box" }, /*#__PURE__*/
    React.createElement("div", { id: "formula" }, formula), /*#__PURE__*/
    React.createElement("div", { id: "display" }, currentValue)), /*#__PURE__*/

    React.createElement("div", { id: "keys" }, /*#__PURE__*/
    React.createElement("button", { onClick: () => {
        clear();
      }, id: "clear" }, "Clear"), /*#__PURE__*/
    React.createElement("button", { onClick: () => {
        addOperator('/');
      }, id: "divide" }, "/"), /*#__PURE__*/
    React.createElement("button", { onClick: () => {
        addOperator('*');
      }, id: "multiply" }, "X"), /*#__PURE__*/
    React.createElement("button", { id: "seven", onClick: () => {
        updateValue('7');
      } }, "7"), /*#__PURE__*/
    React.createElement("button", { id: "eight", onClick: () => {
        updateValue('8');
      } }, "8"), /*#__PURE__*/
    React.createElement("button", { id: "nine", onClick: () => {
        updateValue('9');
      } }, "9"), /*#__PURE__*/
    React.createElement("button", { onClick: () => {
        addOperator('-');
      }, id: "subtract" }, "-"), /*#__PURE__*/
    React.createElement("button", { id: "four", onClick: () => {
        updateValue('4');
      } }, "4"), /*#__PURE__*/
    React.createElement("button", { id: "five", onClick: () => {
        updateValue('5');
      } }, "5"), /*#__PURE__*/
    React.createElement("button", { id: "six", onClick: () => {
        updateValue('6');
      } }, "6"), /*#__PURE__*/
    React.createElement("button", { onClick: () => {
        addOperator('+');
      }, id: "add" }, "+"), /*#__PURE__*/
    React.createElement("button", { id: "one", onClick: () => {
        updateValue('1');
      } }, "1"), /*#__PURE__*/
    React.createElement("button", { id: "two", onClick: () => {
        updateValue('2');
      } }, "2"), /*#__PURE__*/
    React.createElement("button", { id: "three", onClick: () => {
        updateValue('3');
      } }, "3"), /*#__PURE__*/
    React.createElement("button", { onClick: () => {
        equalsResult();
      }, id: "equals" }, "="), /*#__PURE__*/
    React.createElement("button", { id: "decimal", onClick: () => {
        updateValue('.');
      } }, "."), /*#__PURE__*/
    React.createElement("button", { id: "zero", onClick: () => {
        updateValue('0');
      } }, "0"), /*#__PURE__*/
    React.createElement("button", { id: "sign", onClick: () => {
        reverseSign();
      } }, "+/-"))));



}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('main'));
// !! IMPORTANT README:

// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. 

/***********
INSTRUCTIONS:
  - Select the project you would 
    like to complete from the dropdown 
    menu.
  - Click the "RUN TESTS" button to
    run the tests against the blank 
    pen.
  - Click the "TESTS" button to see 
    the individual test cases. 
    (should all be failing at first)
  - Start coding! As you fulfill each
    test case, you will see them go   
    from red to green.
  - As you start to build out your 
    project, when tests are failing, 
    you should get helpful errors 
    along the way!
    ************/

// PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

// Once you have read the above messages, you can delete all comments.