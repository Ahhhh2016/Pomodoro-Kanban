import { globalState, startTimer, pauseTimer, stopTimer } from './constants';

export class FloatingTimer {
    private timerContainer: HTMLElement;
    private taskId: string;
    private intervalId: number | null = null; // Track the interval ID

    constructor(taskId: string) {
        this.taskId = taskId;
        this.createFloatingWindow();
    }

    createFloatingWindow() {
        this.timerContainer = document.createElement('div');
        this.timerContainer.classList.add('floating-timer');
        Object.assign(this.timerContainer.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: '1000',
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
        });

        this.timerContainer.innerHTML = `
            <div>Task: ${this.taskId}</div>
            <div>Elapsed Time: <span id="elapsed-time">0</span> seconds</div>
            <button id="start-timer">Start</button>
            <button id="pause-timer">Pause</button>
            <button id="close-timer">Close</button>
        `;

        document.body.appendChild(this.timerContainer);

        // Add event listeners
        this.timerContainer.querySelector('#start-timer')?.addEventListener('click', () => {
            startTimer(this.taskId);
            const timer = globalState.timers[this.taskId];
            
            if (this.intervalId === null) {
                this.intervalId = window.setInterval(() => {
                    timer.elapsedTime++;
                    const elapsedTimeElement = this.timerContainer.querySelector('#elapsed-time');
                    if (elapsedTimeElement) {
                        elapsedTimeElement.textContent = timer.elapsedTime.toString();
                    }
                }, 1000);
            }
        });
        this.timerContainer.querySelector('#pause-timer')?.addEventListener('click', () => {
            pauseTimer(this.taskId);
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            // this.clearInterval();
        });

        this.timerContainer.querySelector('#close-timer')?.addEventListener('click', () => {
            this.closeFloatingWindow();
        });

        // this.updateElapsedTime();
    }

    // updateElapsedTime() {
    //     this.clearInterval(); // Ensure no duplicate intervals are running

    //     this.intervalId = window.setInterval(() => {
    //         const timer = globalState.timers[this.taskId];
    //         if (timer?.isRunning) {
    //             timer.elapsedTime++;
    //             console.log(timer.elapsedTime);
    //             const elapsedTimeElement = this.timerContainer.querySelector('#elapsed-time');
    //             if (elapsedTimeElement) {
    //                 elapsedTimeElement.textContent = timer.elapsedTime.toString();
    //             }
    //         } else {
    //             this.clearInterval(); // Stop updating if the timer is not running
    //         }
    //     }, 1000);
    // }

    createFixedTimerBar() {
        const timerBar = document.createElement('div');
        timerBar.id = 'fixed-timer-bar';
        Object.assign(timerBar.style, {
            position: 'fixed',
            top: '0',
            width: '100%',
            background: '#222',
            color: 'white',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: '100',
        });

        timerBar.innerHTML = `
            <div id="timer-title">Timer for Task: <span id="task-name"></span></div>
            <div id="timer-controls">
                <button id="pause-timer-btn">Pause</button>
                <button id="stop-timer-btn">Stop</button>
            </div>
        `;

        document.body.appendChild(timerBar);
    }

    closeFloatingWindow() {
        this.timerContainer.remove();
        this.clearInterval(); // Stop the interval when the floating window is closed

        // this.timer = 0;
        // timerDisplay.setText(this.formatTime(this.timer));
        // if (this.intervalId !== null) {
        //     clearInterval(this.intervalId);
        //     this.intervalId = null;
        // }

        // Update or create the Fixed Bar
        const fixedBar = document.getElementById('fixed-timer-bar');
        if (fixedBar) {
            this.updateFixedBar(this.taskId);
        } else {
            this.createFixedTimerBar();
            this.updateFixedBar(this.taskId);
        }
    }

    updateFixedBar(taskId: string) {
        const fixedBar = document.getElementById('fixed-timer-bar');
        if (fixedBar) {
            const timer = globalState.timers[taskId];
            if (timer?.isRunning) {
                fixedBar.innerHTML = `
                    <div>Task: ${taskId}</div>
                    <div>Elapsed Time: ${timer.elapsedTime} seconds</div>
                    <button id="restart-timer">Restart</button>
                    <button id="stop-timer">Stop</button>
                `;
                fixedBar.querySelector('#restart-timer')?.addEventListener('click', () => {
                    startTimer(taskId);
                });
                fixedBar.querySelector('#stop-timer')?.addEventListener('click', () => {
                    stopTimer(taskId);
                    fixedBar.innerHTML = '<div>No timer is running</div>';
                });
            } else {
                fixedBar.innerHTML = '<div>No timer is running</div>';
            }
        }
    }

    private clearInterval() {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
