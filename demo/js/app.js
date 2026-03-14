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
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(updatePreview, 500);
    });
}

// Load templates into sidebar
function loadTemplates() {
    const list = document.getElementById('templatesList');
    list.innerHTML = templates.map(t => `
        <button class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium" 
                onclick="loadTemplate('${t.id}')" data-template-id="${t.id}">
            ${t.name}
        </button>`).join('');
}

// Load a template
function loadTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    currentTemplate = template;
    currentSlideIndex = 0;

    // Update active state
    document.querySelectorAll('#templatesList button').forEach(btn => {
        const isActive = btn.dataset.templateId === templateId;
        btn.classList.toggle('bg-blue-50', isActive);
        btn.classList.toggle('text-blue-600', isActive);
        btn.classList.toggle('font-semibold', isActive);
    });

    // Set editor content
    codeEditor.setValue(template.html);
    codeEditor.clearHistory();
    updatePreview();
}

// Update preview
function updatePreview() {
    const html = codeEditor.getValue();
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = html;

    // Execute scripts to initialize components like Reveal.js
    previewContent.querySelectorAll('script').forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) newScript.src = script.src;
        else newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
        setTimeout(() => document.body.removeChild(newScript), 100);
    });

    // Find all slides and handle Reveal.js
    slides = Array.from(previewContent.querySelectorAll('.slide'));
    const revealEl = previewContent.querySelector('.reveal');
    
    if (typeof Reveal !== 'undefined' && revealEl) {
        initReveal(revealEl, previewContent);
    }

    // Update UI
    const slideCount = document.getElementById('slideCount');
    slideCount.textContent = slides.length > 0 ? `${slides.length} slides` : '1 slide';
    if (slides.length > 0) showSlide(0);
    
    scalePreview();
}

function initReveal(revealEl, previewContent) {
    try {
        if (window.currentDeck) window.currentDeck.destroy();
        
        // Fixed dimensions for container
        revealEl.style.width = previewContent.style.width = '1280px';
        revealEl.style.height = previewContent.style.height = '720px';
        
        window.currentDeck = new Reveal(revealEl, {
            hash: false, embedded: true, keyboard: false, 
            transition: document.getElementById('transition').value || 'slide',
            width: 1280, height: 720, margin: 0,
            minScale: 1, maxScale: 1, disableLayout: false
        });
        
        window.currentDeck.initialize().then(() => {
            window.currentDeck.on('slidechanged', e => {
                currentSlideIndex = e.indexh;
                updateDimensions(currentSlideIndex);
            });
        });
    } catch (e) {
        console.warn('Reveal.js error:', e);
    }
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
    currentSlideIndex = Math.max(0, Math.min(index, slides.length - 1));

    if (window.currentDeck && document.querySelector('.reveal')) {
        window.currentDeck.slide(currentSlideIndex, 0);
    } else {
        slides.forEach((s, i) => s.style.display = i === currentSlideIndex ? 'block' : 'none');
    }
    updateDimensions(currentSlideIndex);
}

// Setup slide navigation
function setupSlideNavigation() {
    const nav = (dir) => {
        if (window.currentDeck) window.currentDeck[dir === 1 ? 'right' : 'left']();
        else showSlide(currentSlideIndex + dir);
    };

    document.getElementById('prevSlide')?.addEventListener('click', () => nav(-1));
    document.getElementById('nextSlide')?.addEventListener('click', () => nav(1));

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        const keys = {ArrowLeft: -1, ArrowRight: 1};
        if (keys[e.key]) nav(keys[e.key]);
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
