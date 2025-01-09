import { App, Modal, Setting } from 'obsidian';
import { Task } from 'interfaces';
import { FloatingTimer } from 'FloatingTimer'; 


export class TaskDetailModal extends Modal {
    task: Task;
    onSave: (task: Task) => void;

    // private timerModal: TimerModal | null = null;
    private floatingTimer: FloatingTimer | null = null;

    constructor(app: App, task: Task, onSave: (task: Task) => void) {
        super(app);
        this.task = task;
        this.onSave = onSave;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('task-detail-modal');

        contentEl.createEl('h2', { text: 'Edit Task' });

        new Setting(contentEl)
            .setName('Title')
            .addText(text => text
                .setValue(this.task.title)
                .onChange(value => this.task.title = value));

        new Setting(contentEl)
            .setName('Description')
            .addTextArea(text => text
                .setValue(this.task.description)
                .onChange(value => this.task.description = value));

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Save')
                .setCta()
                .onClick(() => {
                    this.onSave(this.task);
                    this.close();
                }));

         // Add a close button
        const closeButton = contentEl.createEl('button', { cls: 'close-button', text: '×' });
        closeButton.addEventListener('click', () => {
            this.close();
        });


        // Start Floating Timer button
        new Setting(contentEl)
        .addButton(button => 
            button.setButtonText('Start Timer')
                .onClick(() => {
                    this.openFloatingTimer();
                })
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        // if (this.timerModal) {
        //     this.timerModal.close();
        //     this.timerModal = null;
        // }
    }


    private openFloatingTimer() {
        // Check if a floating timer already exists for this task
        if (!this.floatingTimer) {
            this.floatingTimer = new FloatingTimer(this.task.id.toString()); // Pass the task ID to the floating timer
        }
    }
}