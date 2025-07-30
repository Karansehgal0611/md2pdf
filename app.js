// Markdown PDF Converter Application
class MarkdownPDFConverter {
    constructor() {
        this.initializeElements();
        this.initializeData();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.loadSettings();
        this.loadContent();
        this.updatePreview();
        this.updateLineNumbers();
        this.updateStats();
        
        // Apply initial theme
        this.applyTheme();
    }

    initializeElements() {
        // Editor elements
        this.editor = document.getElementById('markdownEditor');
        this.preview = document.getElementById('preview');
        this.lineNumbers = document.getElementById('lineNumbers');
        
        // Header elements
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.importBtn = document.getElementById('importBtn');
        this.exportPdfBtn = document.getElementById('exportPdfBtn');
        this.exportMdBtn = document.getElementById('exportMdBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.syncScrollBtn = document.getElementById('syncScrollBtn');
        
        // Status elements
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.lineCount = document.getElementById('lineCount');
        this.autoSaveStatus = document.getElementById('autoSaveStatus');
        
        // Modal elements
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.cancelSettings = document.getElementById('cancelSettings');
        this.saveSettings = document.getElementById('saveSettings');
        
        // Settings form elements
        this.pageSize = document.getElementById('pageSize');
        this.orientation = document.getElementById('orientation');
        this.margins = document.getElementById('margins');
        this.fontSize = document.getElementById('fontSize');
        this.enableAutoSave = document.getElementById('enableAutoSave');
        
        // Other elements
        this.fileInput = document.getElementById('fileInput');
        this.resizeHandle = document.getElementById('resizeHandle');
        this.editorPanel = document.querySelector('.editor-panel');
        this.previewPanel = document.querySelector('.preview-panel');
        this.mainContent = document.querySelector('.main-content');
    }

    initializeData() {
        this.settings = {
            pageSize: 'a4',
            orientation: 'portrait',
            margins: 'medium',
            fontSize: 12,
            autoSave: true,
            theme: 'light'
        };
        
        this.marginSettings = {
            none: [0, 0, 0, 0],
            small: [0.5, 0.5, 0.5, 0.5],
            medium: [1, 1, 1, 1],
            large: [1.5, 1.5, 1.5, 1.5]
        };
        
        this.syncScroll = true;
        this.autoSaveTimeout = null;
        this.isResizing = false;
        
        // Sample content
        this.sampleContent = `# Welcome to Markdown PDF Converter

This is a **professional** markdown to PDF converter with *live preview*.

## Features

- Real-time preview
- Syntax highlighting
- PDF export with customization
- File import/export
- Clean, technical UI

### Code Example

\`\`\`javascript
function convertToPDF() {
  const element = document.getElementById('preview');
  html2pdf().from(element).save('document.pdf');
}
\`\`\`

### Lists

1. First item
2. Second item
   - Nested item
   - Another nested item

### Blockquote

> This is a blockquote with **bold** text and *italic* text.

### Table

| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| PDF Export | ✅ |
| Syntax Highlighting | ✅ |

---

**Happy writing!**`;
    }

    setupEventListeners() {
        // Editor events
        this.editor.addEventListener('input', () => {
            this.updatePreview();
            this.updateLineNumbers();
            this.updateStats();
            this.scheduleAutoSave();
        });
        
        this.editor.addEventListener('scroll', () => {
            if (this.syncScroll) {
                this.syncPreviewScroll();
            }
        });
        
        // Toolbar events
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.executeToolbarAction(action);
            });
        });
        
        // Header button events - Enhanced event listeners
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Theme toggle clicked'); // Debug log
                this.toggleTheme();
            });
        }
        
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openSettings();
            });
        }
        
        if (this.importBtn) {
            this.importBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Import button clicked'); // Debug log
                this.importFile();
            });
        }
        
        if (this.exportPdfBtn) {
            this.exportPdfBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportPDF();
            });
        }
        
        if (this.exportMdBtn) {
            this.exportMdBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportMarkdown();
            });
        }
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearEditor();
            });
        }
        
        if (this.syncScrollBtn) {
            this.syncScrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSyncScroll();
            });
        }
        
        // Modal events
        if (this.closeSettings) {
            this.closeSettings.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSettingsModal();
            });
        }
        
        if (this.cancelSettings) {
            this.cancelSettings.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSettingsModal();
            });
        }
        
        if (this.saveSettings) {
            this.saveSettings.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveSettingsAndClose();
            });
        }
        
        // Modal backdrop click
        if (this.settingsModal) {
            const backdrop = this.settingsModal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closeSettingsModal());
            }
        }
        
        // File input event - Enhanced file handling
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => {
                console.log('File input changed'); // Debug log
                this.handleFileImport(e);
            });
        }
        
        // Resize handle events
        this.setupResizeHandle();
        
        // Tab key handling in editor
        if (this.editor) {
            this.editor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.insertAtCursor('  ');
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.executeToolbarAction('header1');
                        break;
                    case '2':
                        e.preventDefault();
                        this.executeToolbarAction('header2');
                        break;
                    case '3':
                        e.preventDefault();
                        this.executeToolbarAction('header3');
                        break;
                    case 'b':
                        e.preventDefault();
                        this.executeToolbarAction('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.executeToolbarAction('italic');
                        break;
                    case 'k':
                        e.preventDefault();
                        this.executeToolbarAction('link');
                        break;
                    case 'l':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.executeToolbarAction('orderedList');
                        } else {
                            this.executeToolbarAction('list');
                        }
                        break;
                    case 'q':
                        e.preventDefault();
                        this.executeToolbarAction('blockquote');
                        break;
                    case 't':
                        e.preventDefault();
                        this.executeToolbarAction('table');
                        break;
                    case 'r':
                        e.preventDefault();
                        this.executeToolbarAction('hr');
                        break;
                    case 's':
                        e.preventDefault();
                        this.exportPDF();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.importFile();
                        break;
                    case '/':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
                
                if (e.key === '`') {
                    e.preventDefault();
                    this.executeToolbarAction('code');
                }
                
                if (e.key === 'I' && e.shiftKey) {
                    e.preventDefault();
                    this.executeToolbarAction('image');
                }
            }
        });
    }

    executeToolbarAction(action) {
        if (!this.editor) return;
        
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const selectedText = this.editor.value.substring(start, end);
        
        let replacement = '';
        let cursorOffset = 0;
        
        switch (action) {
            case 'header1':
                replacement = `# ${selectedText || 'Header 1'}`;
                cursorOffset = selectedText ? 0 : -9;
                break;
            case 'header2':
                replacement = `## ${selectedText || 'Header 2'}`;
                cursorOffset = selectedText ? 0 : -9;
                break;
            case 'header3':
                replacement = `### ${selectedText || 'Header 3'}`;
                cursorOffset = selectedText ? 0 : -9;
                break;
            case 'bold':
                replacement = `**${selectedText || 'bold text'}**`;
                cursorOffset = selectedText ? 0 : -11;
                break;
            case 'italic':
                replacement = `*${selectedText || 'italic text'}*`;
                cursorOffset = selectedText ? 0 : -12;
                break;
            case 'code':
                replacement = `\`${selectedText || 'code'}\``;
                cursorOffset = selectedText ? 0 : -5;
                break;
            case 'link':
                replacement = `[${selectedText || 'link text'}](url)`;
                cursorOffset = selectedText ? -5 : -14;
                break;
            case 'image':
                replacement = `![${selectedText || 'alt text'}](image-url)`;
                cursorOffset = selectedText ? -12 : -21;
                break;
            case 'list':
                replacement = `- ${selectedText || 'list item'}`;
                cursorOffset = selectedText ? 0 : -9;
                break;
            case 'orderedList':
                replacement = `1. ${selectedText || 'list item'}`;
                cursorOffset = selectedText ? 0 : -9;
                break;
            case 'blockquote':
                replacement = `> ${selectedText || 'blockquote'}`;
                cursorOffset = selectedText ? 0 : -10;
                break;
            case 'table':
                replacement = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`;
                cursorOffset = 0;
                break;
            case 'hr':
                replacement = '---';
                cursorOffset = 0;
                break;
        }
        
        this.replaceSelection(replacement);
        if (cursorOffset !== 0) {
            this.editor.setSelectionRange(end + replacement.length + cursorOffset, end + replacement.length + cursorOffset);
        }
        this.editor.focus();
    }

    replaceSelection(replacement) {
        if (!this.editor) return;
        
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const value = this.editor.value;
        
        this.editor.value = value.substring(0, start) + replacement + value.substring(end);
        this.updatePreview();
        this.updateLineNumbers();
        this.updateStats();
        this.scheduleAutoSave();
    }

    insertAtCursor(text) {
        if (!this.editor) return;
        
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const value = this.editor.value;
        
        this.editor.value = value.substring(0, start) + text + value.substring(end);
        this.editor.setSelectionRange(start + text.length, start + text.length);
    }

    updatePreview() {
        if (!this.editor || !this.preview) return;
        
        const markdown = this.editor.value;
        try {
            this.preview.innerHTML = marked.parse(markdown);
            
            // Highlight code blocks if Prism is available
            if (typeof Prism !== 'undefined') {
                this.preview.querySelectorAll('pre code').forEach((block) => {
                    Prism.highlightElement(block);
                });
            }
        } catch (error) {
            console.error('Error parsing markdown:', error);
            this.preview.innerHTML = '<p>Error parsing markdown</p>';
        }
    }

    updateLineNumbers() {
        if (!this.editor || !this.lineNumbers) return;
        
        const lines = this.editor.value.split('\n').length;
        const lineNumbersHTML = Array.from({length: lines}, (_, i) => i + 1).join('\n');
        this.lineNumbers.textContent = lineNumbersHTML;
    }

    updateStats() {
        if (!this.editor) return;
        
        const text = this.editor.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const lines = text.split('\n').length;
        
        if (this.wordCount) this.wordCount.textContent = `Words: ${words}`;
        if (this.charCount) this.charCount.textContent = `Characters: ${characters}`;
        if (this.lineCount) this.lineCount.textContent = `Lines: ${lines}`;
    }

    syncPreviewScroll() {
        if (!this.editor) return;
        
        const editorScrollPercent = this.editor.scrollTop / (this.editor.scrollHeight - this.editor.clientHeight);
        const previewWrapper = document.querySelector('.preview-wrapper');
        if (previewWrapper) {
            previewWrapper.scrollTop = editorScrollPercent * (previewWrapper.scrollHeight - previewWrapper.clientHeight);
        }
    }

    toggleSyncScroll() {
        this.syncScroll = !this.syncScroll;
        if (this.syncScrollBtn) {
            this.syncScrollBtn.style.opacity = this.syncScroll ? '1' : '0.5';
            this.syncScrollBtn.title = this.syncScroll ? 'Sync Scroll: On' : 'Sync Scroll: Off';
        }
    }

    scheduleAutoSave() {
        if (!this.settings.autoSave) return;
        
        clearTimeout(this.autoSaveTimeout);
        if (this.autoSaveStatus) {
            this.autoSaveStatus.textContent = 'Saving...';
        }
        
        this.autoSaveTimeout = setTimeout(() => {
            this.saveContent();
            if (this.autoSaveStatus) {
                this.autoSaveStatus.textContent = 'Auto-saved';
            }
        }, 1000);
    }

    saveContent() {
        if (this.editor) {
            localStorage.setItem('markdownContent', this.editor.value);
        }
    }

    loadContent() {
        if (!this.editor) return;
        
        const saved = localStorage.getItem('markdownContent');
        if (saved) {
            this.editor.value = saved;
        } else {
            this.editor.value = this.sampleContent;
        }
    }

    clearEditor() {
        if (!this.editor) return;
        
        if (confirm('Are you sure you want to clear all content?')) {
            this.editor.value = '';
            this.updatePreview();
            this.updateLineNumbers();
            this.updateStats();
            this.scheduleAutoSave();
        }
    }

    applyTheme() {
        const theme = this.settings.theme || 'light';
        console.log('Applying theme:', theme); // Debug log
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        const currentTheme = this.settings.theme || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log(`Toggling theme from ${currentTheme} to ${newTheme}`); // Debug log
        
        this.settings.theme = newTheme;
        this.applyTheme();
        this.saveSettingsData();
    }

    importFile() {
        console.log('Import file method called'); // Debug log
        if (this.fileInput) {
            console.log('File input exists, triggering click'); // Debug log
            
            // Reset the file input to ensure change event fires
            this.fileInput.value = '';
            
            // Create a new click event and dispatch it
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            
            this.fileInput.dispatchEvent(clickEvent);
        } else {
            console.error('File input element not found'); // Debug log
        }
    }

    handleFileImport(event) {
        console.log('File import handler called'); // Debug log
        const file = event.target.files[0];
        if (!file || !this.editor) {
            console.log('No file selected or editor not available'); // Debug log
            return;
        }
        
        console.log('Processing file:', file.name); // Debug log
        
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('File loaded successfully'); // Debug log
            this.editor.value = e.target.result;
            this.updatePreview();
            this.updateLineNumbers();
            this.updateStats();
            this.scheduleAutoSave();
        };
        
        reader.onerror = (e) => {
            console.error('Error reading file:', e); // Debug log
            alert('Error reading file. Please try again.');
        };
        
        reader.readAsText(file);
    }

    exportMarkdown() {
        if (!this.editor) return;
        
        const content = this.editor.value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async exportPDF() {
        if (!this.preview) {
            alert('Preview not available for PDF export');
            return;
        }
        
        // Check if html2pdf is available
        if (typeof html2pdf === 'undefined') {
            alert('PDF export library not loaded. Please refresh the page and try again.');
            return;
        }
        
        const element = this.preview;
        const margins = this.marginSettings[this.settings.margins];

        let filename = (document.getElementById('pdf-filename')?.value || 'document.pdf').trim();
        filename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
        if (!filename.toLowerCase().endsWith('.pdf')) {
            filename += '.pdf';
        }
        
        const opt = {
            margin: margins,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { 
                unit: 'in', 
                format: this.settings.pageSize,
                orientation: this.settings.orientation
            }
        };
        
        // Temporarily adjust font size
        const originalFontSize = element.style.fontSize;
        element.style.fontSize = `${this.settings.fontSize}px`;
        
        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('PDF export failed. Please try again.');
        } finally {
            // Restore original font size
            element.style.fontSize = originalFontSize;
        }
    }

    openSettings() {
        if (!this.settingsModal) return;
        
        // Load current settings into form
        if (this.pageSize) this.pageSize.value = this.settings.pageSize;
        if (this.orientation) this.orientation.value = this.settings.orientation;
        if (this.margins) this.margins.value = this.settings.margins;
        if (this.fontSize) this.fontSize.value = this.settings.fontSize;
        if (this.enableAutoSave) this.enableAutoSave.checked = this.settings.autoSave;
        
        this.settingsModal.classList.remove('hidden');
    }

    closeSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('hidden');
        }
    }

    saveSettingsAndClose() {
        // Update settings from form
        if (this.pageSize) this.settings.pageSize = this.pageSize.value;
        if (this.orientation) this.settings.orientation = this.orientation.value;
        if (this.margins) this.settings.margins = this.margins.value;
        if (this.fontSize) this.settings.fontSize = parseInt(this.fontSize.value);
        if (this.enableAutoSave) this.settings.autoSave = this.enableAutoSave.checked;
        
        this.saveSettingsData();
        this.closeSettingsModal();
    }

    saveSettingsData() {
        localStorage.setItem('markdownSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('markdownSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }

    setupResizeHandle() {
        if (!this.resizeHandle || !this.editorPanel || !this.previewPanel || !this.mainContent) return;
        
        let startX = 0;
        let startWidth = 0;
        
        this.resizeHandle.addEventListener('mousedown', (e) => {
            this.isResizing = true;
            startX = e.clientX;
            startWidth = this.editorPanel.offsetWidth;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });
        
        const handleMouseMove = (e) => {
            if (!this.isResizing) return;
            
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            const containerWidth = this.mainContent.offsetWidth;
            const minWidth = 300;
            const maxWidth = containerWidth - minWidth - 4; // 4px for resize handle
            
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                this.editorPanel.style.flex = 'none';
                this.editorPanel.style.width = `${newWidth}px`;
                this.previewPanel.style.flex = '1';
            }
        };
        
        const handleMouseUp = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MarkdownPDFConverter();
});