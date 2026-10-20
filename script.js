const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const statusMessage = document.getElementById('status');

// Time configurations in seconds
const TIMES = {
    work: 25 * 60,          // 25 minutes
    shortBreak: 5 * 60,     // 5 minutes
    longBreak: 15 * 60      // 15 minutes
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
    // Add visual pulse effect when 1 minute or less remains
    if (timeLeft <= 60 && timeLeft > 59) {
        timerDisplay.style.animation = 'pulse 1s infinite';
    } else {
        timerDisplay.style.animation = '';
    }
}

function setControls(running) {
    isRunning = running;
    startBtn.disabled = running;
    pauseBtn.disabled = !running;
    resetBtn.disabled = false;
}

function startTimer() {
    if (isRunning) return;

    intervalId = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
            statusMessage.textContent = "⏰ Time's up! Switch modes.";
            setControls(false);
            // Switch to next mode automatically
            switchMode(getNextMode());
            return;
        }
        timeLeft--;
        updateDisplay();
    }, 1000);

    setControls(true);
    statusMessage.textContent = `🎯 Focusing on ${currentMode} session...`;
}

function pauseTimer() {
    if (!isRunning) return;
    clearInterval(intervalId);
    intervalId = null;
    setControls(false);
    statusMessage.textContent = "⏸ Paused. Ready when you are.";
}

function resetTimer() {
    clearInterval(intervalId);
    intervalId = null;
    setControls(false);
    loadMode(currentMode);
    statusMessage.textContent = "🔄 Timer reset. Ready to focus!";
}

function loadMode(mode) {
    currentMode = mode;
    timeLeft = TIMES[mode];
    updateDisplay();
    setControls(false);
    
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    statusMessage.textContent = `⚙️ Set to ${mode} mode. Click Start to begin.`;
}

function getNextMode() {
    const modes = ['work', 'shortBreak', 'longBreak'];
    const currentIndex = modes.indexOf(currentMode);
    return modes[(currentIndex + 1) % modes.length];
}

function switchMode(mode) {
    // Optional: Add notification sound or visual cue
    loadMode(mode);
    startTimer(); // Auto-start next mode
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

// Keyboard shortcuts
function handleKeyPress(event) {
    switch(event.key) {
        case ' ':
            event.preventDefault();
            if (document.activeElement.tagName !== 'BUTTON') {
                startTimer();
            }
            break;
        case 'p':
        case 'P':
            pauseTimer();
            break;
        case 'r':
        case 'R':
            resetTimer();
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMode('work');
    document.addEventListener('keydown', handleKeyPress);
});
