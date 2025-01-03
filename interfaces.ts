
export interface Task {
    id: number;
    title: string;
    description: string;
}

export interface Column {
    id: number;
    title: string;
    tasks: Task[];
}

export interface KanbanBoard {
    columns: Column[];
}
