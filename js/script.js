let currentDisplay = '0';
let previousAnswer = null;
let memoryValue = 0;
const display = document.getElementById('display');

function updateDisplay() {
    display.textContent = currentDisplay;
}

      // Load header
      fetch("header.html")
        .then(response => response.text())
        .then(data => {
          document.getElementById("header").innerHTML = data;

          // Yahan menu toggle ka JS phir se run karna hoga
          const toggleBtn = document.getElementById("menu-toggle");
          const nav = document.getElementById("nav-links");
          toggleBtn.addEventListener("click", () => {
            nav.classList.toggle("show");
          });
        });
 
       const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Submenu toggle for mobile
document.querySelectorAll(".has-submenu > a").forEach(link => {
  link.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      link.parentElement.classList.toggle("show-submenu");
    }
  });
});


        
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

