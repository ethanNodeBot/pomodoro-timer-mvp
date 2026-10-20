const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const statusMessage = document.getElementById('status');

// Time configurations in seconds
const TIMES = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

let timeLeft = TIMES.work;
let intervalId = null;
let isRunning = false;
let currentMode = 'work';

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

function setControls(running) {
    isRunning = running;
    startBtn.disabled = running;
    pauseBtn.disabled = !running;
    // Reset button is always enabled, but functionally it resets the state
    resetBtn.disabled = false;
}

function startTimer() {
    if (isRunning) return;

    if (timeLeft <= 0) {
        // Should only happen on reset, but as a safeguard
        loadMode(currentMode);
    }

    intervalId = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
            statusMessage.textContent = "Time's up! Switch modes.";
            setControls(false);
            // Logic to switch mode automatically could go here
            return;
        }
        timeLeft--;
        updateDisplay();
    }, 1000);

    setControls(true);
    statusMessage.textContent = `Focusing on ${currentMode} session...`;
}

function pauseTimer() {
    if (!isRunning) return;
    clearInterval(intervalId);
    intervalId = null;
    setControls(false);
    statusMessage.textContent = "Paused. Ready when you are.";
}

function resetTimer() {
    clearInterval(intervalId);
    intervalId = null;
    setControls(false);
    loadMode(currentMode); // Reloads time for the current mode
    statusMessage.textContent = "Ready to focus!";
}

function loadMode(mode) {
    currentMode = mode;
    timeLeft = TIMES[mode];
    updateDisplay();
    setControls(false); // Ensure it's stopped when mode changes
    
    // Update button active states
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    statusMessage.textContent = `Set to ${mode} mode. Click Start to begin.`;
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        loadMode(mode);
    });
});

// Initial setup on load
document.addEventListener('DOMContentLoaded', () => {
    loadMode('work');
});