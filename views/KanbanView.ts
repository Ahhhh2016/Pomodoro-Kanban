import { ItemView, WorkspaceLeaf } from 'obsidian';
import { initialBoard } from '../constants';
import { TaskModal } from '../modals/TaskModal';

export const KANBAN_VIEW_TYPE = 'kanban-view';

export class KanbanView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return KANBAN_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Pomodoro Kanban';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl('h1', { text: 'Kanban Board' });

        // Render the initial board
        initialBoard.columns.forEach(column => {
            const columnEl = container.createDiv({ cls: 'kanban-column' });
            columnEl.createEl('h2', { text: column.title });

			column.tasks.forEach(task => {
                const taskEl = columnEl.createDiv({ cls: 'kanban-task' });
                taskEl.createEl('h3', { text: task.title });
                taskEl.createEl('p', { text: task.description });

				taskEl.setAttribute('draggable', 'true');
				taskEl.addEventListener('dragstart', (event) => {
					event.dataTransfer.setData('text/plain', JSON.stringify(task));
					event.dataTransfer.effectAllowed = 'move';
				});

                // Open task detail window to modify task
                taskEl.addEventListener('click', () => {
                    new TaskModal(this.app, task, (updatedTask) => {
                        // Update the task in the board
                        const column = initialBoard.columns.find(col => col.tasks.some(t => t.id === updatedTask.id));
                        if (column) {
                            const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
                            if (taskIndex !== -1) {
                                column.tasks[taskIndex] = updatedTask;
                            }
                        }
                
                        // Re-render the board
                        this.onOpen();
                    }).open();
                });
            });

			columnEl.addEventListener('dragover', (event) => {
				event.preventDefault();
				event.dataTransfer.dropEffect = 'move';
			});
			
			columnEl.addEventListener('drop', (event) => {
				event.preventDefault();
				const taskData = event.dataTransfer.getData('text/plain');
				const task = JSON.parse(taskData);
			
				// Remove the task from its original column
				initialBoard.columns.forEach(col => {
					col.tasks = col.tasks.filter(t => t.id !== task.id);
				});
			
				// Add the task to the new column
				column.tasks.push(task);
			
				// Re-render the board
				this.onOpen();
			});

        });
    }

    async onClose() {
        // Cleanup if necessary
    }
}