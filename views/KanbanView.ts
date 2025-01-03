import { ItemView, WorkspaceLeaf } from 'obsidian';
import { TaskModal } from '../modals/TaskModal';
import { KanbanBoard } from 'interfaces';

export const KANBAN_VIEW_TYPE = 'kanban-view';

export class KanbanView extends ItemView {
    private board: KanbanBoard;
    private saveBoard: () => Promise<void>;

    constructor(leaf: WorkspaceLeaf, board: KanbanBoard, saveBoard: () => Promise<void>) {
        super(leaf);
        this.board = board;
        this.saveBoard = saveBoard;
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
        container.createEl('h1', { text: 'Pomodoro Kanban Board' });

        // Render the board
        this.board.columns.forEach(column => {
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
                    new TaskModal(this.app, task, async (updatedTask) => {
                        // Update the task in the board
                        const column = this.board.columns.find(col => col.tasks.some(t => t.id === updatedTask.id));
                        if (column) {
                            const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
                            if (taskIndex !== -1) {
                                column.tasks[taskIndex] = updatedTask;
                            }
                        }

                        // Save the updated board
                        console.log('Saving board:', this.board);
                        await this.saveBoard();

                        // Re-render the board
                        this.onOpen();
                    }).open();
                });
            });

			columnEl.addEventListener('dragover', (event) => {
				event.preventDefault();
				event.dataTransfer.dropEffect = 'move';
			});
			
			// columnEl.addEventListener('drop', (event) => {
			// 	event.preventDefault();
			// 	const taskData = event.dataTransfer.getData('text/plain');
			// 	const task = JSON.parse(taskData);
			
			// 	// Remove the task from its original column
			// 	initialBoard.columns.forEach(col => {
			// 		col.tasks = col.tasks.filter(t => t.id !== task.id);
			// 	});
			
			// 	// Add the task to the new column
			// 	column.tasks.push(task);
			
			// 	// Re-render the board
			// 	this.onOpen();
			// });

            columnEl.addEventListener('drop', async (event) => {
                event.preventDefault();
                const taskData = event.dataTransfer.getData('text/plain');
                const task = JSON.parse(taskData);
            
                // Remove the task from its original column
                this.board.columns.forEach(col => {
                    col.tasks = col.tasks.filter(t => t.id !== task.id);
                });

                // // Add the task to the new column
                // const targetColumn = this.board.columns.find(col => col.id === column.id);
                // if (targetColumn) {
                //     targetColumn.tasks.push(task);
                // }
			
				// Add the task to the new column
				column.tasks.push(task);
            
                // Save the updated board
                await this.saveBoard();
            
                // Re-render the board
                this.onOpen();
            });

        });
    }

    async onClose() {
        // Cleanup if necessary
    }
}