// ============================================
// Code Editor Logic
// ============================================

class CodeEditor {
    constructor() {
        this.htmlEditor = null;
        this.cssEditor = null;
        this.currentTab = 'html';
        this.init();
    }

    init() {
        // Initialize CodeMirror for HTML
        this.htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
            mode: 'xml',
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            tabSize: 2,
            indentWithTabs: false
        });

        // Initialize CodeMirror for CSS
        this.cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
            mode: 'css',
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            tabSize: 2,
            indentWithTabs: false
        });

        // Setup tabs
        this.setupTabs();

        // Setup auto-update
        this.setupAutoUpdate();

        // Setup manual update button
        this.setupUpdateButton();
    }

    setupTabs() {
        const tabHtml = document.getElementById('tabHtml');
        const tabCss = document.getElementById('tabCss');
        const htmlEditorWrapper = this.htmlEditor.getWrapperElement();
        const cssEditorWrapper = this.cssEditor.getWrapperElement();

        // Initially hide CSS editor
        cssEditorWrapper.style.display = 'none';

        tabHtml.addEventListener('click', () => {
            this.currentTab = 'html';
            tabHtml.classList.add('active');
            tabCss.classList.remove('active');
            htmlEditorWrapper.style.display = 'block';
            cssEditorWrapper.style.display = 'none';
            this.htmlEditor.refresh();
        });

        tabCss.addEventListener('click', () => {
            this.currentTab = 'css';
            tabCss.classList.add('active');
            tabHtml.classList.remove('active');
            cssEditorWrapper.style.display = 'block';
            htmlEditorWrapper.style.display = 'none';
            this.cssEditor.refresh();
        });
    }

    setupAutoUpdate() {
        const autoUpdateCheckbox = document.getElementById('autoUpdate');
        let updateTimeout;

        const onEditorChange = () => {
            if (!autoUpdateCheckbox.checked) return;

            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                updatePreview();
            }, 500);
        };

        this.htmlEditor.on('change', onEditorChange);
        this.cssEditor.on('change', onEditorChange);
    }

    setupUpdateButton() {
        const updateButton = document.getElementById('updatePreview');
        updateButton.addEventListener('click', () => {
            updatePreview();
        });
    }

    setHTML(html) {
        this.htmlEditor.setValue(html);
        this.htmlEditor.clearHistory();
    }

    setCSS(css) {
        this.cssEditor.setValue(css);
        this.cssEditor.clearHistory();
    }

    getHTML() {
        return this.htmlEditor.getValue();
    }

    getCSS() {
        return this.cssEditor.getValue();
    }

    refresh() {
        this.htmlEditor.refresh();
        this.cssEditor.refresh();
    }
}

// Global editor instance
let codeEditor;

// Initialize editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    codeEditor = new CodeEditor();
});
