import { App, Modal } from 'obsidian';
import { Task } from '../interfaces';

export class TimerModal extends Modal {
    private task: Task;
    private timer: number = 0;
    private intervalId: number | null = null;
    private closed: boolean = true;

    constructor(app: App, task: Task) {
        super(app);
        this.task = task;
    }

    onOpen() {
        this.closed = false;
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('timer-modal');

        contentEl.createEl('h2', { text: `Timer for ${this.task.title}` });

        const timerDisplay = contentEl.createEl('div', { text: this.formatTime(this.timer) });

        const startButton = contentEl.createEl('button', { text: 'Start' });
        startButton.addEventListener('click', () => {
            if (this.intervalId === null) {
                this.intervalId = window.setInterval(() => {
                    this.timer++;
                    timerDisplay.setText(this.formatTime(this.timer));
                }, 1000);
            }
        });

        const pauseButton = contentEl.createEl('button', { text: 'Pause' });
        pauseButton.addEventListener('click', () => {
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        });

        const resetButton = contentEl.createEl('button', { text: 'Reset' });
        resetButton.addEventListener('click', () => {
            this.timer = 0;
            timerDisplay.setText(this.formatTime(this.timer));
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        });


        // Add a close button
        const closeButton = contentEl.createEl('button', { text: 'Close' });
        closeButton.addEventListener('click', () => {
            this.close();
        });
    }

    onClose() {
        this.closed = true;
        const { contentEl } = this;
        contentEl.empty();
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
    }

    isClosed() {
        return this.closed;
    }

    private formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}