import { App, Plugin, Notice, Editor, MarkdownView } from 'obsidian';
import { DEFAULT_SETTINGS, initialBoard } from './constants';
import { KanbanView, KANBAN_VIEW_TYPE } from './views/KanbanView';
import { SampleModal } from './modals/SampleModal';
import { SampleSettingTab } from './settings/SettingTab';
import { KanbanBoard } from 'interfaces';


// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}


export default class MyPlugin extends Plugin {
	private board: KanbanBoard;

	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// Load the saved board state or use the initial state
		this.board = await this.loadData() || initialBoard;
		console.log('Loaded board:', this.board);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a Kanban board!');
		});
		

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

        // Register the Kanban view
        this.registerView(
            KANBAN_VIEW_TYPE,
            (leaf) => new KanbanView(leaf, this.board, this.saveBoard.bind(this))
        );

		this.addCommand({
			id: 'open-kanban-board',
			name: 'Open Kanban Board',
			callback: () => {
				this.activateKanbanView();
			}
		});
	}

    async saveBoard() {
        await this.saveData(this.board);
		console.log('Saved board:', this.board);
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

