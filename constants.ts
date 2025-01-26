import { KanbanBoard, GlobalState } from './interfaces';
import { FixedBar } from 'FixedBar';

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

export const globalState: GlobalState = {
    runningTaskId: null,
    timers: {},
};

export const fixedBar = new FixedBar();

export function startTimer(taskId: string) {
    // 如果有正在运行的 Timer，先暂停它
    if (globalState.runningTaskId && globalState.runningTaskId !== taskId) {
        pauseTimer(globalState.runningTaskId);
    }
    // 设置当前运行的任务
    globalState.runningTaskId = taskId;

    // 初始化或继续计时
    if (!globalState.timers[taskId]) {
        globalState.timers[taskId] = { elapsedTime: 0, isRunning: true };
    } else {
        globalState.timers[taskId].isRunning = true;
    }
}

export function pauseTimer(taskId: string) {
    console.log("pause");
    if (globalState.timers[taskId]) {
        globalState.timers[taskId].isRunning = false;
    }
    if (globalState.runningTaskId === taskId) {
        globalState.runningTaskId = null;
    }
}

export function stopTimer(taskId: string) {
    delete globalState.timers[taskId];
    if (globalState.runningTaskId === taskId) {
        globalState.runningTaskId = null;
    }
}


