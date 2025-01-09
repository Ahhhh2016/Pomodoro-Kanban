import { globalState, startTimer, pauseTimer, stopTimer } from './constants';

export class FixedBar {
    private timerContainer: HTMLElement;
    private taskId: string | null = null;
    private intervalId: number | null = null; // Track the interval ID

    constructor() {
        // this.taskId = taskId;
        // this.createFixedTimerBar();
    }
    
    createFixedTimerBar(container) {
       const timerBar = document.createElement('div');
        timerBar.id = 'fixed-timer-bar';
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
    
        timerBar.innerHTML = `
            <div id="timer-title">Timer for Task: <span id="task-name"></span></div>
            <div id="timer-controls">
                <button id="pause-timer-btn">Pause</button>
                <button id="stop-timer-btn">Stop</button>
                <button id="close-timer-btn">Close</button>
            </div>
        `;
    
        // document.body.appendChild(timerBar);
        container.appendChild(timerBar);
    
        // Add event listener for the close button
        timerBar.querySelector('#close-timer-btn')?.addEventListener('click', () => {
            timerBar.remove();
        });
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
}