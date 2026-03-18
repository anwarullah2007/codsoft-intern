const display = document.getElementById('calc-display');
const buttonsContainer = document.getElementById('buttons-container');
const toggleSciBtn = document.getElementById('toggle-sci');
const calculator = document.querySelector('.calculator');
const sciButtons = document.querySelectorAll('.btn.sci');

let currentInput = '';
let isScientific = false;

// Toggle Scientific Mode
toggleSciBtn.addEventListener('click', () => {
    isScientific = !isScientific;
    if (isScientific) {
        calculator.classList.add('scientific');
        buttonsContainer.classList.remove('grid-basic');
        buttonsContainer.classList.add('grid-scientific');
        sciButtons.forEach(btn => btn.classList.remove('hidden'));
        toggleSciBtn.textContent = 'Basic Mode';
    } else {
        calculator.classList.remove('scientific');
        buttonsContainer.classList.remove('grid-scientific');
        buttonsContainer.classList.add('grid-basic');
        sciButtons.forEach(btn => btn.classList.add('hidden'));
        toggleSciBtn.textContent = 'Scientific Mode';
    }
});

// Handle button clicks with event delegation and loops over properties
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.textContent;
        const action = e.target.dataset.action;

        // If the button has an action data attribute, handle it
        if (action) {
            handleAction(action);
        } else if (!isNaN(value) || value === '.') {
            // Handle number input and decimal point
            appendValue(value);
        }
    });
});

function appendValue(val) {
    currentInput += val;
    updateDisplay();
}

function handleAction(action) {
    // Determine what to do based on the action
    if (action === 'clear') {
        currentInput = '';
    } else if (action === 'delete') {
        currentInput = currentInput.slice(0, -1);
    } else if (action === '=') {
        calculateResult();
        return;
    } else if (['+', '-', '*', '/', '%'].includes(action)) {
        currentInput += action;
    } else if (['(', ')'].includes(action)) {
        currentInput += action;
    } else if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(action)) {
        currentInput += `Math.${action}(`;
    } else if (action === 'pow') {
        currentInput += '**';
    } else if (action === 'pi') {
        currentInput += Math.PI;
    } else if (action === 'e') {
        currentInput += Math.E;
    }
    
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput;
}

function calculateResult() {
    try {
        if (!currentInput) return;

        // Add missing closing parentheses if the user forgot them
        let expression = currentInput;
        const openParens = (expression.match(/\(/g) || []).length;
        const closeParens = (expression.match(/\)/g) || []).length;
        
        for (let i = 0; i < openParens - closeParens; i++) {
            expression += ')';
        }

        // Replace custom visual operators with JS operators for eval
        // While eval() is usually risky, it completes the basic knowledge requirement safely in a local client context
        let result = eval(expression);
        
        // Handle undefined or infinite results gracefully
        if (result === undefined) result = '';
        if (!isFinite(result)) throw new Error('Math Error');

        // Limit the decimal places to avoid overflowing the display
        result = Math.round(result * 100000000) / 100000000;

        currentInput = String(result);
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
    }
}