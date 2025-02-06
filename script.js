document.addEventListener('DOMContentLoaded', () => {
    const passwordEl = document.getElementById('password');
    const lengthEl = document.getElementById('length');
    const uppercaseEl = document.getElementById('uppercase');
    const lowercaseEl = document.getElementById('lowercase');
    const numbersEl = document.getElementById('numbers');
    const symbolsEl = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');

    const randomFunc = {
        lower: getRandomLower,
        upper: getRandomUpper,
        number: getRandomNumber,
        symbol: getRandomSymbol
    };

    // Prevent form submission on button clicks
    [decreaseBtn, increaseBtn].forEach(btn => {
        btn.type = 'button'; // Explicitly set button type
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default form submission
        });
    });

    // Length control buttons with improved handling
    decreaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let currentValue = parseInt(lengthEl.value);
        if (currentValue > parseInt(lengthEl.min)) {
            currentValue -= 1;
            lengthEl.value = currentValue;
            generateNewPassword();
        }
    });

    increaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let currentValue = parseInt(lengthEl.value);
        if (currentValue < parseInt(lengthEl.max)) {
            currentValue += 1;
            lengthEl.value = currentValue;
            generateNewPassword();
        }
    });

    // Length input validation
    lengthEl.addEventListener('input', () => {
        let value = parseInt(lengthEl.value);
        const min = parseInt(lengthEl.min);
        const max = parseInt(lengthEl.max);
        
        if (isNaN(value)) {
            lengthEl.value = min;
            value = min;
        } else {
            if (value < min) lengthEl.value = min;
            if (value > max) lengthEl.value = max;
        }
        
        generateNewPassword();
    });

    // Generate event listen
    generateBtn.addEventListener('click', generateNewPassword);

    // Function to generate new password
    function generateNewPassword() {
        const length = +lengthEl.value;
        const hasLower = lowercaseEl.checked;
        const hasUpper = uppercaseEl.checked;
        const hasNumber = numbersEl.checked;
        const hasSymbol = symbolsEl.checked;

        passwordEl.value = generatePassword(
            hasLower, 
            hasUpper, 
            hasNumber, 
            hasSymbol, 
            length
        );
    }

    // Copy password to clipboard
    copyBtn.addEventListener('click', () => {
        const password = passwordEl.value;
        if (!password) {
            return;
        }
        
        navigator.clipboard.writeText(password)
            .then(() => {
                // Create and show temporary notification
                const notification = document.createElement('div');
                notification.textContent = 'Password copied!';
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    z-index: 1000;
                `;
                document.body.appendChild(notification);
                
                // Remove notification after 2 seconds
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy password:', err);
            });
    });

    function generatePassword(lower, upper, number, symbol, length) {
        let generatedPassword = '';
        const typesCount = lower + upper + number + symbol;
        const typesArr = [{lower}, {upper}, {number}, {symbol}]
            .filter(item => Object.values(item)[0]);

        if (typesCount === 0) {
            return '';
        }

        for (let i = 0; i < length; i += typesCount) {
            typesArr.forEach(type => {
                const funcName = Object.keys(type)[0];
                generatedPassword += randomFunc[funcName]();
            });
        }

        const finalPassword = generatedPassword.slice(0, length);
        return shufflePassword(finalPassword);
    }

    function getRandomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    function getRandomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    function getRandomNumber() {
        return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }

    function getRandomSymbol() {
        const symbols = '!@#$%^&*(){}[]=<>/,.';
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function shufflePassword(password) {
        const array = password.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    // Generate initial password
    generateNewPassword();
});