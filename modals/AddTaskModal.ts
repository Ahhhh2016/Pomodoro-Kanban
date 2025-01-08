import { App, Modal, Setting } from 'obsidian';
import { Task } from '../interfaces';

export class AddTaskModal extends Modal {
    private onSave: (task: Task, action: string) => void;
    private task: Task;

    constructor(app: App, onSave: (task: Task, action: string) => void) {
        super(app);
        this.onSave = onSave;
        this.task = { id: Date.now(), title: '', description: '' }; // Generate a unique ID
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('add-task-modal');

        contentEl.createEl('h2', { text: 'Add Task' });
        console.log("here");
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
                .setButtonText('Save & Add More')
                .setCta()
                .onClick(() => {
                    this.onSave(this.task, 'addMore');
                    this.close();
                }));

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Save & Open Details')
                .onClick(() => {
                    this.onSave(this.task, 'openDetails');
                    this.close();
                }));

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Save & Close')
                .onClick(() => {
                    this.onSave(this.task, 'close');
                    this.close();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}