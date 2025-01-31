import { globalState, startTimer, pauseTimer, stopTimer } from './constants';

export class FixedBar {
    private timerContainer: HTMLElement | null; // Allow null assignment

    private taskId: string | null = null;
    private intervalId: number | null = null; // Track the interval ID

    constructor() {
        // this.taskId = taskId;
        // this.createFixedTimerBar();
    }
    
    createFixedTimerBar(container: Element) {
        const timerBar = document.createElement('div');
        timerBar.id = 'fixed-timer-bar';
        timerBar.setAttribute('data-plugin', 'pomodoro-kanban');
        Object.assign(timerBar.style, {
            position: 'sticky', // Makes it stick at the top of the container
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
    
        // timerBar.innerHTML = `
        //     <div id="timer-title">Timer for Task: <span id="task-name"></span></div>
        //     <div id="timer-controls">
        //         <button id="pause-timer-btn">Pause</button>
        //         <button id="stop-timer-btn">Stop</button>
        //         <button id="close-timer-btn">Close</button>
        //     </div>
        // `;

        timerBar.innerHTML = `
            <div id="timer-title">Timer for Task: <span id="task-name"></span></div>
            <div id="elapsed-time">Elapsed Time: 0 seconds</div>
            <div id="timer-controls">
                <button id="start-timer-btn">Start</button>
                <button id="pause-timer-btn">Pause</button>
                <button id="close-timer-btn">Close</button>
            </div>
        `;

        container.appendChild(timerBar);

        this.timerContainer = timerBar; // Assign to `this.timerContainer`

        // Add event listener for the close button
        // timerBar.querySelector('#start-timer-btn')?.addEventListener('click', () => {
        //     if (this.taskId !== null) {
        //         startTimer(this.taskId);
        //     }
        // });
        // timerBar.querySelector('#pause-timer-btn')?.addEventListener('click', () => {
        //     if (this.taskId !== null) {
        //         pauseTimer(this.taskId);
        //     }
        // });
        timerBar.querySelector('#close-timer-btn')?.addEventListener('click', () => {
            timerBar.remove();
            this.timerContainer = null; // Clear reference
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        });
    }

    // updateFixedBar(taskId: string) {
    //     const fixedBar = document.getElementById('fixed-timer-bar');
    //     if (fixedBar) {
    //         const timer = globalState.timers[taskId];
    //         if (timer?.isRunning) {
    //             const taskNameElement = fixedBar.querySelector('#task-name');
    //             if (taskNameElement) {
    //                 taskNameElement.textContent = taskId; // Update task name
    //             }
    //         }
    //     }
    
    //     const timer = globalState.timers[taskId];
    //     if (this.intervalId === null && timer?.isRunning) {
    //         this.intervalId = window.setInterval(() => {
    //             timer.elapsedTime++; // Increment elapsed time
    //             if (this.timerContainer) {
    //                 const elapsedTimeElement = this.timerContainer.querySelector('#elapsed-time');
    //                 if (elapsedTimeElement) {
    //                     elapsedTimeElement.textContent = `Elapsed Time: ${timer.elapsedTime} seconds`;
    //                 }
    //             }
    //         }, 1000);
    //     }

    // }

    updateFixedBar(taskId: string) {
        this.taskId = taskId;

        const timer = globalState.timers[taskId];
        if (this.timerContainer) {
            const elapsedTimeElement = this.timerContainer.querySelector('#elapsed-time');
            const startBtn = this.timerContainer.querySelector('#start-timer-btn');
            const pauseBtn = this.timerContainer.querySelector('#pause-timer-btn');
            const stopBtn = this.timerContainer.querySelector('#stop-timer-btn');

            // Update elapsed time display
            if (elapsedTimeElement) {
                elapsedTimeElement.textContent = `Elapsed Time: ${timer?.elapsedTime || 0} seconds`;
            }

            // Attach event listeners
            startBtn?.addEventListener('click', () =>  {
                startTimer(taskId);
                const timer = globalState.timers[taskId];
            
                if (this.intervalId === null) {
                    this.intervalId = window.setInterval(() => {
                        timer.elapsedTime++;
                        if (this.timerContainer) {
                            const elapsedTimeElement = this.timerContainer.querySelector('#elapsed-time');
                            if (elapsedTimeElement) {
                                // elapsedTimeElement.textContent = timer.elapsedTime.toString();
                                elapsedTimeElement.textContent = `Elapsed Time: ${timer.elapsedTime} seconds`;
                            }
                        }
                    }, 1000);
                }
            });
            pauseBtn?.addEventListener('click', () => {
                pauseTimer(taskId);
                if (this.intervalId !== null) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
            });
            stopBtn?.addEventListener('click', () => {
                stopTimer(taskId);
                if (this.intervalId !== null) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
            });

            // Handle interval for updating elapsed time
            if (this.intervalId === null && timer?.isRunning) {
                this.intervalId = window.setInterval(() => {
                    timer.elapsedTime++;
                    if (elapsedTimeElement) {
                        elapsedTimeElement.textContent = `Elapsed Time: ${timer.elapsedTime} seconds`;
                    }
                }, 1000);
            }

            // Clean up the interval if the timer is stopped
            if (!timer?.isRunning && this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }

    
    // updateFixedBar(taskId: string) {
    //     const fixedBar = document.getElementById('fixed-timer-bar');
    //     if (fixedBar) {
    //         const timer = globalState.timers[taskId];
    //         if (timer?.isRunning) {
    //             fixedBar.innerHTML = `
    //                 <div>Task: ${taskId}</div>
    //                 <div>Elapsed Time: ${timer.elapsedTime} seconds</div>
    //                 <button id="restart-timer">Restart</button>
    //                 <button id="stop-timer">Stop</button>
    //             `;
    //             fixedBar.querySelector('#restart-timer')?.addEventListener('click', () => {
    //                 startTimer(taskId);
    //             });
    //             fixedBar.querySelector('#stop-timer')?.addEventListener('click', () => {
    //                 stopTimer(taskId);
    //                 fixedBar.innerHTML = '<div>No timer is running</div>';
    //             });
    //         } else {
    //             fixedBar.innerHTML = '<div>No timer is running</div>';
    //         }


    //     }

    //     const timer = globalState.timers[taskId];
    //     if (this.intervalId === null) {
    //         this.intervalId = window.setInterval(() => {
    //             timer.elapsedTime++;
    //             const elapsedTimeElement = this.timerContainer.querySelector('#elapsed-time');
    //             if (elapsedTimeElement) {
    //                 elapsedTimeElement.textContent = timer.elapsedTime.toString();
    //             }
    //         }, 1000);
    //     }
    // }
}