import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ItemView, WorkspaceLeaf } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

interface Task {
    id: number;
    title: string;
    description: string;
}

interface Column {
    id: number;
    title: string;
    tasks: Task[];
}

interface KanbanBoard {
    columns: Column[];
}

const initialBoard: KanbanBoard = {
    columns: [
        {
            id: 1,
            title: 'To Do',
            tasks: [
                { id: 1, title: 'Task 1', description: 'Description for Task 1' },
                { id: 2, title: 'Task 2', description: 'Description for Task 2' }
            ]
        },
        {
            id: 2,
            title: 'In Progress',
            tasks: []
        },
        {
            id: 3,
            title: 'Done',
            tasks: []
        }
    ]
};

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

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	private board: KanbanBoard;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a Kanban board!');
		});
		
		// this.addRibbonIcon('dice', 'Greet', () => {
		// 	new Notice('Hello, world!');
		//   });

		  // Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');


		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		await this.loadSettings();

		this.registerView(
			KANBAN_VIEW_TYPE,
			(leaf) => new KanbanView(leaf)
		);

		this.addCommand({
			id: 'open-kanban-board',
			name: 'Open Kanban Board',
			callback: () => {
				this.activateKanbanView();
			}
		});
	}

    async activateKanbanView() {
        const leaf = this.app.workspace.getLeaf(true);
        await leaf.setViewState({ type: KANBAN_VIEW_TYPE });
        this.app.workspace.revealLeaf(leaf);
    }

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
