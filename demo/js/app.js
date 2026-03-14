// ============================================
// Main Application Logic
// ============================================

let codeEditor = null;
let currentTemplate = null;
let currentSlideIndex = 0;
let slides = [];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    loadTemplates();
    setupExportButton();
    setupOptionsPanel();
    setupSlideNavigation();

    // Load first template
    if (templates.length > 0) {
        loadTemplate(templates[0].id);
    }
});

// Initialize CodeMirror editor
function initEditor() {
    codeEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
        mode: 'xml',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        tabSize: 2
    });

    // Auto-update on change
    let updateTimeout;
    codeEditor.on('change', () => {
        if (!document.getElementById('autoUpdate').checked) return;
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(updatePreview, 500);
    });

    // Manual update button
    document.getElementById('updatePreview').addEventListener('click', updatePreview);
}

// Load templates into sidebar
function loadTemplates() {
    const templatesList = document.getElementById('templatesList');
    templatesList.innerHTML = '';

    templates.forEach(template => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium';
        btn.dataset.templateId = template.id;
        btn.innerHTML = template.name;

        btn.addEventListener('click', () => loadTemplate(template.id));
        templatesList.appendChild(btn);
    });
}

// Load a template
function loadTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    currentTemplate = template;
    currentSlideIndex = 0;

    // Update active state
    document.querySelectorAll('#templatesList button').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-600', 'font-semibold');
        if (btn.dataset.templateId === templateId) {
            btn.classList.add('bg-blue-50', 'text-blue-600', 'font-semibold');
        }
    });

    // Set editor content
    codeEditor.setValue(template.html);
    codeEditor.clearHistory();

    // Update preview
    updatePreview();
}

// Update preview
function updatePreview() {
    const html = codeEditor.getValue();
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = html;

    // Execute scripts in the preview content to initialize components like Reveal.js
    const scripts = previewContent.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
        // Remove it immediately after execution to keep DOM clean
        setTimeout(() => document.body.removeChild(newScript), 100);
    });

    // Find all slides
    slides = Array.from(previewContent.querySelectorAll('.slide'));

    // Initialize Reveal.js if present
    const revealEl = previewContent.querySelector('.reveal');
    if (typeof Reveal !== 'undefined' && revealEl) {
        try {
            // Use instance API since we are inside a container
            if (window.currentDeck) {
                window.currentDeck.destroy();
            }
            
            // Set fixed dimensions for the container
            revealEl.style.width = '1280px';
            revealEl.style.height = '720px';
            previewContent.style.width = '1280px';
            previewContent.style.height = '720px';
            
            window.currentDeck = new Reveal(revealEl, {
                hash: false,
                embedded: true,
                keyboard: false, 
                transition: document.getElementById('transition').value || 'slide',
                width: 1280,
                height: 720,
                margin: 0,
                // Fix min and max scale to 1 so Reveal doesn't try to scale. 
                // We will handle scaling via our own CSS transform in scalePreview()
                minScale: 1, 
                maxScale: 1,
                disableLayout: false
            });
            window.currentDeck.initialize().then(() => {
                window.currentDeck.on('slidechanged', event => {
                    currentSlideIndex = event.indexh;
                    updateDimensions(currentSlideIndex);
                });
            });
        } catch (e) {
            console.warn('Reveal.js initialization error:', e);
        }
    }

    // Update slide count
    const slideCount = document.getElementById('slideCount');
    if (slides.length > 0) {
        slideCount.textContent = `${slides.length} slides`;
        showSlide(0);
    } else {
        slideCount.textContent = '1 slide';
    }

    scalePreview();
}

function updateDimensions(index) {
    const dimensions = document.getElementById('previewDimensions');
    if (slides[index]) {
        let w = slides[index].offsetWidth || 1280;
        let h = slides[index].offsetHeight || 720;
        
        // If it's a reveal setup, use the config size
        if (window.currentDeck) {
            w = 1280;
            h = 720;
        }
        dimensions.textContent = `Slide ${index + 1}/${slides.length} • ${w} × ${h}`;
    }
}

// Show specific slide
function showSlide(index) {
    if (slides.length === 0) return;

    // Ensure index is within bounds
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;

    currentSlideIndex = index;

    // Handle Reveal.js navigation if present
    const previewContent = document.getElementById('previewContent');
    if (window.currentDeck && previewContent.querySelector('.reveal')) {
        try {
            window.currentDeck.slide(index, 0);
        } catch (e) {
            console.warn('Reveal.js slide navigation error:', e);
            // Fallback to manual display
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }
    } else {
        // Fallback for non-Reveal templates
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    // Update dimensions
    updateDimensions(index);
}

// Setup slide navigation
function setupSlideNavigation() {
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (window.currentDeck) {
                window.currentDeck.left();
            } else if (currentSlideIndex > 0) {
                showSlide(currentSlideIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (window.currentDeck) {
                window.currentDeck.right();
            } else if (currentSlideIndex < slides.length - 1) {
                showSlide(currentSlideIndex + 1);
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Prevent default keyboard if in editor
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        
        if (window.currentDeck) {
            // Let Reveal handle its own keyboard if we re-enable it, 
            // but we disabled it in config, so we trigger manually.
            if (e.key === 'ArrowLeft') window.currentDeck.left();
            else if (e.key === 'ArrowRight') window.currentDeck.right();
            else if (e.key === 'ArrowUp') window.currentDeck.up();
            else if (e.key === 'ArrowDown') window.currentDeck.down();
        } else {
            if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
                showSlide(currentSlideIndex - 1);
            } else if (e.key === 'ArrowRight' && currentSlideIndex < slides.length - 1) {
                showSlide(currentSlideIndex + 1);
            }
        }
    });
}

// Scale preview to fit
function scalePreview() {
    const previewContent = document.getElementById('previewContent');
    const container = previewContent.parentElement;

    // Get the currently visible slide or base it on 1280px default slide width
    const contentWidth = 1280;
    const contentHeight = 720;
    const containerWidth = container.offsetWidth - 80;
    const containerHeight = Math.max(container.offsetHeight - 80, 200);

    // Calculate scale to fit both width and height gracefully
    const scaleX = containerWidth / contentWidth;
    const scaleY = containerHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    if (scale < 1) {
        previewContent.style.transform = `scale(${scale})`;
        previewContent.style.transformOrigin = 'center center';
    } else {
        previewContent.style.transform = 'none';
        previewContent.style.transformOrigin = 'center center';
    }
    
    // Ensure height of container expands if necessary
    previewContent.style.width = '1280px';
    previewContent.style.height = '720px';
}

// Setup export
function setupExportButton() {
    document.getElementById('exportBtn').addEventListener('click', exportToPptx);
}

// Export to PPTX
async function exportToPptx() {
    try {
        const config = getConfig();
        const previewContent = document.getElementById('previewContent');
        const allSlides = previewContent.querySelectorAll('.slide');

        showLoading(true);

        if (allSlides.length > 1) {
            await exportMultipleSlides(Array.from(allSlides), config);
        } else {
            await domToPptx.exportToPptx(previewContent, config);
        }

        showToast('Thành công!', `Đã xuất ${allSlides.length || 1} slide vào file PPTX.`, 'success');
    } catch (error) {
        console.error('Export error:', error);
        showToast('Lỗi!', error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Export multiple slides
async function exportMultipleSlides(slidesArray, config) {
    const originalStates = slidesArray.map(slide => ({
        display: slide.style.display,
        visibility: slide.style.visibility,
        opacity: slide.style.opacity
    }));

    // Show all slides for export
    slidesArray.forEach(slide => {
        slide.style.display = 'block';
        slide.style.visibility = 'visible';
        slide.style.opacity = '1';
    });

    await new Promise(resolve => setTimeout(resolve, 300));
    await domToPptx.exportToPptx(slidesArray, config);

    // Restore original states
    slidesArray.forEach((slide, index) => {
        const state = originalStates[index];
        slide.style.display = state.display;
        slide.style.visibility = state.visibility;
        slide.style.opacity = state.opacity;
    });

    // Restore current slide view
    showSlide(currentSlideIndex);
}

// Get config
function getConfig() {
    const fileName = document.getElementById('fileName').value || 'presentation.pptx';
    const autoEmbedFonts = document.getElementById('autoEmbedFonts').checked;
    const svgAsVector = document.getElementById('svgAsVector').checked;
    const transition = document.getElementById('transition').value || undefined;
    const margin = parseInt(document.getElementById('margin').value) / 100;
    const listBefore = parseInt(document.getElementById('listBefore').value);
    const listAfter = parseInt(document.getElementById('listAfter').value);

    const config = { fileName, autoEmbedFonts, svgAsVector, margin };

    if (transition) config.transition = transition;
    if (listBefore || listAfter) {
        config.listConfig = { spacing: {} };
        if (listBefore) config.listConfig.spacing.before = listBefore;
        if (listAfter) config.listConfig.spacing.after = listAfter;
    }

    return config;
}

// Setup options
function setupOptionsPanel() {
    const marginSlider = document.getElementById('margin');
    const marginValue = document.getElementById('marginValue');

    marginSlider.addEventListener('input', () => {
        marginValue.textContent = marginSlider.value;
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(scalePreview, 250);
    });
}

// Show loading
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const exportBtn = document.getElementById('exportBtn');

    if (show) {
        loadingOverlay.classList.remove('hidden');
        exportBtn.disabled = true;
        exportBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        loadingOverlay.classList.add('hidden');
        exportBtn.disabled = false;
        exportBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// Show toast - FIXED POSITION
function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    const icons = {
        success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };

    // Fixed: Changed from bottom-56 to bottom-4
    toast.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 transform transition-transform duration-300 z-50';
    toastIcon.innerHTML = icons[type] || icons.info;
    toast.classList.add(type, 'show');

    setTimeout(() => toast.classList.remove('show'), 3000);
}
