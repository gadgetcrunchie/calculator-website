// ==================== HEADER & MENU FUNCTIONALITY ====================
let currentDisplay = '0';
let previousAnswer = null;
let memoryValue = 0;
const display = document.getElementById('display');

function updateDisplay() {
    if (display) display.textContent = currentDisplay;
}

// Load header
fetch("header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // Menu toggle functionality
    const toggleBtn = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav-links");
    if (toggleBtn && nav) {
      toggleBtn.addEventListener("click", () => {
        nav.classList.toggle("show");
      });
    }
  });

const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-links");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// Submenu toggle for mobile
document.querySelectorAll(".has-submenu > a").forEach(link => {
  link.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      link.parentElement.classList.toggle("show-submenu");
    }
  });
});

// ==================== BASIC CALCULATOR FUNCTIONS ====================
function addToDisplay(value) {
    if (currentDisplay === '0' && value !== '.') {
        currentDisplay = value;
    } else {
        currentDisplay += value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentDisplay = '0';
    updateDisplay();
}

function backspace() {
    if (currentDisplay.length === 1) {
        currentDisplay = '0';
    } else {
        currentDisplay = currentDisplay.slice(0, -1);
    }
    updateDisplay();
}

function calculate() {
    try {
        // Replace special symbols for evaluation
        let expression = currentDisplay
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/∛/g, 'Math.cbrt(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/asin\(/g, 'Math.asin(')
            .replace(/acos\(/g, 'Math.acos(')
            .replace(/atan\(/g, 'Math.atan(');
        
        // Handle degrees if Deg is selected
        if (currentDisplay.includes('Rad')) {
            expression = expression.replace(/Rad/g, '');
            // Convert trig functions to use radians (default in Math)
        } else {
            // Convert trig functions to use degrees
            expression = expression.replace(/Math\.sin\(([^)]*)\)/g, 'Math.sin($1 * Math.PI / 180)');
            expression = expression.replace(/Math\.cos\(([^)]*)\)/g, 'Math.cos($1 * Math.PI / 180)');
            expression = expression.replace(/Math\.tan\(([^)]*)\)/g, 'Math.tan($1 * Math.PI / 180)');
        }
        
        previousAnswer = eval(expression);
        currentDisplay = previousAnswer.toString();
        updateDisplay();
    } catch (error) {
        currentDisplay = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function useAns() {
    if (previousAnswer !== null) {
        addToDisplay(previousAnswer.toString());
    }
}

function toggleSign() {
    if (currentDisplay.startsWith('-')) {
        currentDisplay = currentDisplay.substring(1);
    } else if (currentDisplay !== '0') {
        currentDisplay = '-' + currentDisplay;
    }
    updateDisplay();
}

function factorial() {
    let num = parseFloat(currentDisplay);
    if (num < 0) {
        currentDisplay = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
        return;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    previousAnswer = result;
    currentDisplay = result.toString();
    updateDisplay();
}

function randomNumber() {
    const randomNum = Math.random();
    previousAnswer = randomNum;
    currentDisplay = randomNum.toString();
    updateDisplay();
}

function memoryAdd() {
    memoryValue += parseFloat(currentDisplay) || 0;
    clearDisplay();
}

function memorySubtract() {
    memoryValue -= parseFloat(currentDisplay) || 0;
    clearDisplay();
}

function memoryRecall() {
    currentDisplay = memoryValue.toString();
    updateDisplay();
}

// Initialize display
updateDisplay();

// ==================== BMI CALCULATOR ====================
document.addEventListener('DOMContentLoaded', function() {
    // Unit system toggle
    const unitBtns = document.querySelectorAll('.unit-btn');
    const metricUnits = document.querySelectorAll('.metric-unit');
    const imperialUnits = document.querySelectorAll('.imperial-unit');
    
    if (unitBtns.length > 0) {
        unitBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                unitBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (btn.dataset.unit === 'metric') {
                    metricUnits.forEach(el => el.style.display = 'block');
                    imperialUnits.forEach(el => el.style.display = 'none');
                } else {
                    metricUnits.forEach(el => el.style.display = 'none');
                    imperialUnits.forEach(el => el.style.display = 'block');
                }
            });
        });

        // Initialize with metric units
        document.querySelector('.unit-btn[data-unit="metric"]').click();
    }

    // BMI Calculation
    const bmiCalculateBtn = document.getElementById('bmi-calculate-btn');
    if (bmiCalculateBtn) {
        bmiCalculateBtn.addEventListener('click', calculateBMI);
    }

    function calculateBMI() {
        const heightCmInput = document.getElementById('height-cm');
        const weightKgInput = document.getElementById('weight-kg');
        const heightFtInput = document.getElementById('height-ft');
        const heightInInput = document.getElementById('height-in');
        const weightLbsInput = document.getElementById('weight-lbs');
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        
        const activeUnit = document.querySelector('.unit-btn.active')?.dataset.unit;
        let bmi;
        
        if (activeUnit === 'metric') {
            // Metric calculation (kg and cm)
            const height = parseFloat(heightCmInput.value) / 100; // Convert cm to m
            const weight = parseFloat(weightKgInput.value);
            
            if (isNaN(height) || height <= 0) {
                alert('Please enter a valid height in centimeters');
                return;
            }
            
            if (isNaN(weight) || weight <= 0) {
                alert('Please enter a valid weight in kilograms');
                return;
            }
            
            bmi = weight / (height * height);
        } else {
            // Imperial calculation (lbs and ft-in)
            const feet = parseFloat(heightFtInput.value);
            const inches = parseFloat(heightInInput.value);
            const weight = parseFloat(weightLbsInput.value);
            
            if (isNaN(feet) || feet < 0) {
                alert('Please enter a valid feet value');
                return;
            }
            
            if (isNaN(inches) || inches < 0 || inches >= 12) {
                alert('Please enter a valid inches value (0-11)');
                return;
            }
            
            if (isNaN(weight) || weight <= 0) {
                alert('Please enter a valid weight in pounds');
                return;
            }
            
            // Convert feet and inches to total inches, then to meters
            const totalInches = (feet * 12) + inches;
            const heightM = totalInches * 0.0254;
            
            // Convert pounds to kg
            const weightKg = weight * 0.453592;
            
            bmi = weightKg / (heightM * heightM);
        }
        
        if (bmiValue) bmiValue.textContent = bmi.toFixed(1);
        
        if (bmiCategory) {
            if (bmi < 18.5) {
                bmiCategory.textContent = 'Underweight';
                bmiCategory.className = 'underweight';
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                bmiCategory.textContent = 'Normal weight';
                bmiCategory.className = 'normal';
            } else if (bmi >= 25 && bmi <= 29.9) {
                bmiCategory.textContent = 'Overweight';
                bmiCategory.className = 'overweight';
            } else {
                bmiCategory.textContent = 'Obese';
                bmiCategory.className = 'obese';
            }
        }
        
        const bmiResult = document.getElementById('bmi-result');
        if (bmiResult) {
            bmiResult.style.display = 'block';
            bmiResult.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ==================== MORTGAGE CALCULATOR ====================
    const mortgageCalculateBtn = document.getElementById('mortgage-calculate-btn');
    const mortgageResultDiv = document.getElementById('mortgage-result');
    
    if (mortgageCalculateBtn) {
        mortgageCalculateBtn.addEventListener('click', calculateMortgage);
        
        // Also calculate when pressing Enter in any input
        document.querySelectorAll('.mortgage-form input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateMortgage();
                }
            });
        });
    }

    function calculateMortgage() {
        // Get input values
        const loanAmount = parseFloat(document.getElementById('loan-amount').value) || 0;
        const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
        const loanTerm = parseInt(document.getElementById('loan-term').value) || 30;
        
        // Calculate principal (loan amount minus down payment)
        const principal = loanAmount - downPayment;
        
        if (principal <= 0) {
            alert('Loan amount must be greater than down payment');
            return;
        }
        
        // Monthly interest rate
        const monthlyRate = interestRate / 100 / 12;
        
        // Number of payments
        const numPayments = loanTerm * 12;
        
        // Monthly payment calculation
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
            (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        // Total cost calculations
        const totalInterest = (monthlyPayment * numPayments) - principal;
        const totalCost = monthlyPayment * numPayments;
        
        // Display results
        if (document.getElementById('monthly-payment')) {
            document.getElementById('monthly-payment').textContent = formatCurrency(monthlyPayment);
        }
        if (document.getElementById('principal-interest')) {
            document.getElementById('principal-interest').textContent = formatCurrency(monthlyPayment);
        }
        if (document.getElementById('total-interest')) {
            document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
        }
        if (document.getElementById('total-cost')) {
            document.getElementById('total-cost').textContent = formatCurrency(totalCost);
        }
        if (document.getElementById('total-payments')) {
            document.getElementById('total-payments').textContent = `${numPayments} payments of ${formatCurrency(monthlyPayment)}`;
        }
        
        // Show result section
        if (mortgageResultDiv) {
            mortgageResultDiv.style.display = 'block';
            mortgageResultDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // ==================== LOAN CALCULATORS ====================
    // Amortized Loan
    const amortizedForm = document.getElementById('amortizedForm');
    if (amortizedForm) {
        amortizedForm.addEventListener('submit', function(e){
            e.preventDefault();
            const P = parseFloat(document.getElementById('amLoanAmount').value);
            const years = parseFloat(document.getElementById('amLoanTerm').value);
            const r = parseFloat(document.getElementById('amInterestRate').value) / 100 / 12;
            const n = years * 12;
            const monthly = P * r / (1 - Math.pow(1 + r, -n));
            document.getElementById('amResults').textContent = `Monthly Payment: $${monthly.toFixed(2)} | Total Payment: $${(monthly*n).toFixed(2)} | Total Interest: $${(monthly*n-P).toFixed(2)}`;
        });
    }

    // Deferred Payment Loan
    const deferredForm = document.getElementById('deferredForm');
    if (deferredForm) {
        deferredForm.addEventListener('submit', function(e){
            e.preventDefault();
            const P = parseFloat(document.getElementById('deLoanAmount').value);
            const years = parseFloat(document.getElementById('deLoanTerm').value);
            const r = parseFloat(document.getElementById('deInterestRate').value) / 100;
            const total = P * Math.pow(1 + r, years);
            document.getElementById('deResults').textContent = `Amount Due at Maturity: $${total.toFixed(2)} | Total Interest: $${(total-P).toFixed(2)}`;
        });
    }

    // Bond
    const bondForm = document.getElementById('bondForm');
    if (bondForm) {
        bondForm.addEventListener('submit', function(e){
            e.preventDefault();
            const F = parseFloat(document.getElementById('bondFuture').value);
            const years = parseFloat(document.getElementById('bondTerm').value);
            const r = parseFloat(document.getElementById('bondRate').value) / 100;
            const present = F / Math.pow(1 + r, years);
            document.getElementById('bondResults').textContent = `Initial Investment Needed: $${present.toFixed(2)} | Total Interest: $${(F-present).toFixed(2)}`;
        });
    }

    // ==================== FAQ FUNCTIONALITY ====================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked FAQ if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ==================== SCIENTIFIC CALCULATOR ====================
    const sciDisplay = document.getElementById('calc-display');
    const sciButtons = document.querySelectorAll('.calc-btn');
    
    if (sciDisplay && sciButtons.length > 0) {
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let resetScreen = false;
        
        function updateSciDisplay() {
            sciDisplay.textContent = currentInput;
        }
        
        function inputNumber(number) {
            if (currentInput === '0' || resetScreen) {
                currentInput = number;
                resetScreen = false;
            } else {
                currentInput += number;
            }
        }
        
        function inputDecimal() {
            if (resetScreen) {
                currentInput = '0.';
                resetScreen = false;
                return;
            }
            
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        }
        
        function handleOperator(op) {
            if (operation !== null) calculateSci();
            previousInput = currentInput;
            operation = op;
            resetScreen = true;
        }
        
        function calculateSci() {
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    result = prev / current;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
            
            currentInput = result.toString();
            operation = null;
        }
        
        function handleSpecialFunction(func) {
            const num = parseFloat(currentInput);
            
            switch (func) {
                case 'sin':
                    currentInput = Math.sin(num * Math.PI / 180).toString();
                    break;
                case 'cos':
                    currentInput = Math.cos(num * Math.PI / 180).toString();
                    break;
                case 'tan':
                    currentInput = Math.tan(num * Math.PI / 180).toString();
                    break;
                case '√':
                    currentInput = Math.sqrt(num).toString();
                    break;
                case 'log':
                    currentInput = Math.log10(num).toString();
                    break;
                case 'ln':
                    currentInput = Math.log(num).toString();
                    break;
                case '!':
                    currentInput = factorialSci(num).toString();
                    break;
                case 'π':
                    currentInput = Math.PI.toString();
                    break;
                case 'e':
                    currentInput = Math.E.toString();
                    break;
                case '%':
                    currentInput = (num / 100).toString();
                    break;
                case 'clear':
                    currentInput = '0';
                    previousInput = '';
                    operation = null;
                    break;
                default:
                    return;
            }
        }
        
        function factorialSci(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }
        
        sciButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                
                if (button.classList.contains('number')) {
                    inputNumber(value);
                } else if (button.classList.contains('operator')) {
                    handleOperator(value);
                } else if (value === '=') {
                    calculateSci();
                    resetScreen = true;
                } else if (value === '.') {
                    inputDecimal();
                } else if (button.classList.contains('function')) {
                    handleSpecialFunction(value);
                }
                
                updateSciDisplay();
            });
        });
        
        updateSciDisplay();
    }
});