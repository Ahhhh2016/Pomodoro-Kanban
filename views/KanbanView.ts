import { ItemView, WorkspaceLeaf } from 'obsidian';
import { TaskDetailModal } from '../modals/TaskDetailModal';
import { AddTaskModal } from 'modals/AddTaskModal';
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

            // Add button to add tasks
            const addButton = columnEl.createEl('button', { text: 'Add Task' });

            addButton.addEventListener('click', () => {
                // Recursive function to handle adding tasks
                const handleAddTask = async () => {
                    new AddTaskModal(this.app, async (task, action) => {
                        // Save the current task
                        column.tasks.push(task);
                        await this.saveBoard();

                        if (action === 'addMore') {
                            // Reopen AddTaskModal for the next task
                            handleAddTask();
                        } else if (action === 'openDetails') {
                            // Open TaskDetailModal for the current task
                            new TaskDetailModal(this.app, task, async (updatedTask) => {
                                // Update the task in the column
                                const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
                                if (taskIndex !== -1) {
                                    column.tasks[taskIndex] = updatedTask;
                                }
                                await this.saveBoard();
                                this.onOpen(); // Re-render the board
                            }).open();
                        } else {
                            // Re-render the board if no further action is specified
                            this.onOpen();
                        }
                    }).open();
                };

                // Start the task-adding process
                handleAddTask();
            });

            // addButton.addEventListener('click', () => {
            //     new AddTaskModal(this.app, async (task, action) => {
            //         column.tasks.push(task);
            //         await this.saveBoard();

            //         if (action === 'addMore') {
            //             new AddTaskModal(this.app, async (newTask, newAction) => {
            //                 column.tasks.push(newTask);
            //                 await this.saveBoard();
            //                 if (newAction === 'openDetails') {
            //                     new TaskDetailModal(this.app, newTask, async (updatedTask) => {
            //                         const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
            //                         if (taskIndex !== -1) {
            //                             column.tasks[taskIndex] = updatedTask;
            //                         }
            //                         await this.saveBoard();
            //                         this.onOpen();
            //                     }).open();
            //                 } else {
            //                     this.onOpen();
            //                 }
            //             }).open();
            //         } else if (action === 'openDetails') {
            //             new TaskDetailModal(this.app, task, async (updatedTask) => {
            //                 const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
            //                 if (taskIndex !== -1) {
            //                     column.tasks[taskIndex] = updatedTask;
            //                 }
            //                 await this.saveBoard();
            //                 this.onOpen();
            //             }).open();
            //         } else {
            //             this.onOpen(); // Re-render the board
            //         }
            //     }).open();
            // });
            

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
                    new TaskDetailModal(this.app, task, async (updatedTask) => {
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