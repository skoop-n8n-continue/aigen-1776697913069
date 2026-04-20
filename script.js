class Calculator {
    constructor(prevElement, currElement) {
        this.prevElement = prevElement;
        this.currElement = currElement;
        this.clear();
    }

    clear() {
        this.currOperand = '0';
        this.prevOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currOperand === '0') return;
        this.currOperand = this.currOperand.toString().slice(0, -1);
        if (this.currOperand === '') this.currOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currOperand.includes('.')) return;
        if (this.currOperand === '0' && number !== '.') {
            this.currOperand = number.toString();
        } else {
            this.currOperand = this.currOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currOperand === '') return;
        if (this.prevOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.prevOperand = this.currOperand;
        this.currOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.prevOperand);
        const current = parseFloat(this.currOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currOperand = computation.toString();
        this.operation = undefined;
        this.prevOperand = '';
    }

    updateDisplay() {
        this.currElement.innerText = this.currOperand;
        if (this.operation != null) {
            const opSymbol = this.operation === '*' ? '×' : this.operation === '/' ? '÷' : this.operation;
            this.prevElement.innerText = `${this.prevOperand} ${opSymbol}`;
        } else {
            this.prevElement.innerText = '';
        }
    }
}

const prevDisplay = document.getElementById('prev-display');
const currDisplay = document.getElementById('curr-display');
const calculator = new Calculator(prevDisplay, currDisplay);

const buttons = document.querySelectorAll('.btn');

// Automatic Demo Logic
async function pressButton(key) {
    const btn = document.querySelector(`.btn[data-key="${key}"]`);
    if (btn) {
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 200);
    }

    if (key === 'AC') calculator.clear();
    else if (key === 'DEL') calculator.delete();
    else if (key === '=') calculator.compute();
    else if (['+', '-', '*', '/'].includes(key)) calculator.chooseOperation(key);
    else calculator.appendNumber(key);

    calculator.updateDisplay();
}

async function runAutoDemo() {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (true) {
        await pressButton('AC');
        await wait(1000);

        // Generate a random calculation
        const num1 = Math.floor(Math.random() * 90) + 10;
        const num2 = Math.floor(Math.random() * 90) + 10;
        const ops = ['+', '-', '*', '/'];
        const op = ops[Math.floor(Math.random() * ops.length)];

        // Type first number
        for (const char of num1.toString()) {
            await pressButton(char);
            await wait(400);
        }

        await wait(600);
        await pressButton(op);
        await wait(800);

        // Type second number
        for (const char of num2.toString()) {
            await pressButton(char);
            await wait(400);
        }

        await wait(1000);
        await pressButton('=');
        await wait(4000); // Show result for 4 seconds
    }
}

// Start the automation
runAutoDemo();
