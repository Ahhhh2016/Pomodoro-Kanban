import { App, Modal, Setting } from 'obsidian';
import { Task } from 'interfaces';

export class TaskModal extends Modal {
    task: Task;
    onSave: (task: Task) => void;

    constructor(app: App, task: Task, onSave: (task: Task) => void) {
        super(app);
        this.task = task;
        this.onSave = onSave;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

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
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}