import { KanbanBoard } from './interfaces';

export const DEFAULT_SETTINGS = {
    mySetting: 'default',
};

export const initialBoard: KanbanBoard = {
    columns: [
        {
            id: 1,
            title: 'To Do',
            tasks: [
                { id: 1, title: 'Task 1', description: 'Description for Task 1' },
                { id: 2, title: 'Task 2', description: 'Description for Task 2' },
            ],
        },
        {
            id: 2,
            title: 'In Progress',
            tasks: [],
        },
        {
            id: 3,
            title: 'Done',
            tasks: [],
        },
    ],
};
