
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

export interface GlobalState {
    runningTaskId: string | null; // 当前正在运行的任务 ID
    timers: {
        [taskId: string]: {
            elapsedTime: number; // 当前计时时间（秒）
            isRunning: boolean;  // Timer 是否正在运行
        };
    };
}



