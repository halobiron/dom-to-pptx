// src/index.js
import * as PptxGenJSImport from '@bapunhansdah/pptxgenjs';
import html2canvas from 'html2canvas';
import { PPTXEmbedFonts } from './font-embedder.js';
import JSZip from 'jszip';

// Normalize import
const PptxGenJS = PptxGenJSImport?.default ?? PptxGenJSImport;

import {
  parseColor,
  getTextStyle,
  isTextContainer,
  getVisibleShadow,
  generateGradientSVG,
  getRotation,
  getWritingModeVert,
  svgToPng,
  svgToSvg,
  getPadding,
  getSoftEdges,
  generateBlurredSVG,
  getBorderInfo,
  generateCompositeBorderSVG,
  isClippedByParent,
  generateCustomShapeSVG,
  getUsedFontFamilies,
  getAutoDetectedFonts,
  extractTableData,
  tempOverride,
  getAccumulatedScale,
  collectTextParts,
} from './utils.js';
import { getProcessedImage } from './image-processor.js';

const PPI = 96;
const PX_TO_INCH = 1 / PPI;

/**
 * Map Reveal.js transitions to PPTX transition inner XML
 * Allows for easy addition of new transition types.
 */
const TRANSITION_MAP = {
  'fade': '<p:fade thruBlk="false"/>',
  'slide': '<p:push dir="l"/>',
  'push': '<p:push dir="l"/>',
  'convex': '<p:zoom dir="in"/>',
  'concave': '<p:zoom dir="in"/>',
  'zoom': '<p:zoom dir="in"/>',
  'wipe': '<p:wipe dir="l"/>',
  'reveal': '<p:reveal dir="l"/>',
};

/**
 * Helper functions to trim whitespace while preserving non-breaking spaces (\u00A0)
 */
function smartTrimStart(text) {
  // Only trim regular spaces, tabs, newlines - NOT non-breaking spaces
  return text.replace(/^[ \t\r\n]+/, '');
}
/**
 * Check if an element has any visible content (text/images/etc)
 */
function hasVisibleContent(element) {
  return element.innerText?.trim().length > 0;
}

/**
 * Extract transition from HTML element or use global transition
 * @param {HTMLElement} element - The slide element
 * @param {string} globalTransition - Global transition from Reveal config
 * @returns {string|null} - PPTX transition type
 */
function getSlideTransition(element, globalTransition) {
  const transition = element.getAttribute('data-transition') || globalTransition;
  return transition ? TRANSITION_MAP[transition.toLowerCase()] || null : null;
}

/**
 * Apply transitions to PPTX file using JSZip
 * @param {Blob} pptxBlob - The generated PPTX blob
 * @param {Array<string|null>} slideTransitions - Array of transitions for each slide
 * @returns {Promise<Blob>} - PPTX blob with transitions applied
 */
async function applyTransitionsToBlob(pptxBlob, slideTransitions) {
  if (!slideTransitions.some(t => t)) {
    return pptxBlob;
  }

  const zip = await JSZip.loadAsync(pptxBlob);

  await Promise.all(
    slideTransitions.map(async (transitionKey, index) => {
      const innerXml = TRANSITION_MAP[transitionKey];
      if (!innerXml) return;

      const slideFile = `ppt/slides/slide${index + 1}.xml`;
      const file = zip.file(slideFile);
      if (!file) return;

      let xmlStr = await file.async('string');
      const transitionXml = `<p:transition spd="med" dur="500">${innerXml}</p:transition>`;

      // Remove existing transitions so reruns stay idempotent.
      xmlStr = xmlStr.replace(/<p:transition\b[^>]*>[\s\S]*?<\/p:transition>/g, '');

      // Add transition after </p:cSld>
      if (xmlStr.includes('</p:cSld>')) {
        xmlStr = xmlStr.replace('</p:cSld>', '</p:cSld>' + transitionXml);
      }

      zip.file(slideFile, xmlStr);
    })
  );

  return await zip.generateAsync({ type: 'blob' });
}



/**
 * Main export function.
 * @param {HTMLElement | string | Array<HTMLElement | string>} target
 * @param {Object} options
 * @param {string} [options.fileName]
 * @param {boolean} [options.skipDownload=false] - If true, prevents automatic download
 * @param {Object} [options.listConfig] - Config for bullets
 * @param {boolean} [options.svgAsVector=false] - If true, keeps SVG as vector (for Convert to Shape in PowerPoint)
 * @param {number} [options.margin=0] - Slide margin as a fraction (e.g. 0.1 for 5% margin)
 * @param {string} [options.transition] - Global slide transition (fade, slide, convex, concave, zoom, push, wipe, reveal). Overrides Reveal.js config.
 * @param {Array} [options.fonts] - Array of fonts to embed
 * @param {boolean} [options.autoEmbedFonts=false] - Auto-detect and embed fonts
 * @returns {Promise<Blob>} - Returns the generated PPTX Blob
 */
export async function exportToPptx(target, options = {}) {
  const resolvePptxConstructor = (pkg) =>
    typeof pkg === 'function' ? pkg :
      typeof pkg?.default === 'function' ? pkg.default :
        typeof pkg?.PptxGenJS === 'function' ? pkg.PptxGenJS :
          typeof pkg?.PptxGenJS?.default === 'function' ? pkg.PptxGenJS.default : null;

  const PptxConstructor = resolvePptxConstructor(PptxGenJS);
  if (!PptxConstructor) throw new Error('PptxGenJS constructor not found.');
  const pptx = new PptxConstructor();

  // 1. Layout Handling
  let finalWidth = 10; // default 16:9
  let finalHeight = 5.625;

  if (options.width && options.height) {
    pptx.defineLayout({ name: 'CUSTOM', width: options.width, height: options.height });
    pptx.layout = 'CUSTOM';
    finalWidth = options.width;
    finalHeight = options.height;
  } else if (options.layout) {
    pptx.layout = options.layout;
    // Map standard layouts for internal scale calculation if possible,
    // though PptxGenJS defaults to 16:9 if unknown.
    if (options.layout === 'LAYOUT_4x3') {
      finalWidth = 10;
      finalHeight = 7.5;
    } else if (options.layout === 'LAYOUT_16x10') {
      finalWidth = 10;
      finalHeight = 6.25;
    } else if (options.layout === 'LAYOUT_WIDE') {
      finalWidth = 13.3;
      finalHeight = 7.5;
    }
  } else {
    pptx.layout = 'LAYOUT_16x9';
  }

  // Pass these dimensions to options so processSlide can use them
  const extendedOptions = {
    ...options,
    _slideWidth: finalWidth,
    _slideHeight: finalHeight,
  };

  const elements = Array.isArray(target) ? target : [target];

  // Get global transition from multiple sources (in priority order):
  // 1. Explicit option passed to exportToPptx
  // 2. Reveal.js global config (if available)
  let globalTransition = options.transition || null;

  if (!globalTransition && typeof window !== 'undefined' && window.Reveal) {
    try {
      const config = window.Reveal.getConfig?.();
      if (config && config.transition) {
        globalTransition = config.transition;
      }
    } catch {
      // Silently ignore if Reveal.js is not available
    }
  }

  // Collect slide transitions
  const slideTransitions = [];

  for (const el of elements) {
    const root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) {
      continue;
    }

    // Skip completely empty slides (no actual text/image content, only background)
    const hasContent = hasVisibleContent(root);
    if (!hasContent) {
      console.warn('Slide is empty, skipping:', el);
      continue;
    }

    // Collect transition for this slide
    const slideTransition = getSlideTransition(root, globalTransition);
    slideTransitions.push(slideTransition);

    const slide = pptx.addSlide();
    await processSlide(root, slide, pptx, extendedOptions);
  }

  // 3. Font Embedding Logic
  let finalBlob;
  let fontsToEmbed = options.fonts || [];

  if (options.autoEmbedFonts) {
    // A. Scan DOM for used font families
    const usedFamilies = getUsedFontFamilies(elements);

    // B. Scan CSS for URLs matches
    const detectedFonts = await getAutoDetectedFonts(usedFamilies);

    // C. Merge (Avoid duplicates)
    const explicitNames = new Set(fontsToEmbed.map((f) => f.name));
    for (const autoFont of detectedFonts) {
      if (!explicitNames.has(autoFont.name)) {
        fontsToEmbed.push(autoFont);
      }
    }

    if (detectedFonts.length > 0) {
      console.log(
        'Auto-detected fonts:',
        detectedFonts.map((f) => f.name)
      );
    }
  }

  if (fontsToEmbed.length > 0) {
    // Generate initial PPTX
    const initialBlob = await pptx.write({ outputType: 'blob' });

    // Load into Embedder
    const zip = await JSZip.loadAsync(initialBlob);
    const embedder = new PPTXEmbedFonts();
    await embedder.loadZip(zip);

    // Fetch and Embed
    for (const fontCfg of fontsToEmbed) {
      try {
        const response = await fetch(fontCfg.url);
        if (!response.ok) throw new Error(`Failed to fetch ${fontCfg.url}`);
        const buffer = await response.arrayBuffer();

        // Infer type
        const ext = fontCfg.url.split('.').pop().split(/[?#]/)[0].toLowerCase();
        let type = 'ttf';
        if (['woff', 'otf'].includes(ext)) type = ext;

        await embedder.addFont(fontCfg.name, buffer, type);
      } catch (e) {
        console.warn(`Failed to embed font: ${fontCfg.name} (${fontCfg.url})`, e);
      }
    }

    await embedder.updateFiles();
    let blobWithFonts = await embedder.generateBlob();

    // Apply transitions
    finalBlob = await applyTransitionsToBlob(blobWithFonts, slideTransitions);
  } else {
    // No fonts to embed
    let initialBlob = await pptx.write({ outputType: 'blob' });

    // Apply transitions
    finalBlob = await applyTransitionsToBlob(initialBlob, slideTransitions);
  }

  // 4. Output Handling
  // If skipDownload is NOT true, proceed with browser download
  if (!options.skipDownload) {
    const fileName = options.fileName || 'export.pptx';
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Always return the blob so the caller can use it (e.g. upload to server)
  return finalBlob;
}

/**
 * Worker function to process a single DOM element into a single PPTX slide.
 * @param {HTMLElement} root - The root element for this slide.
 * @param {PptxGenJS.Slide} slide - The PPTX slide object to add content to.
 * @param {PptxGenJS} pptx - The main PPTX instance.
 */
async function processSlide(root, slide, pptx, globalOptions = {}) {
  // Reset transforms and opacity on parent elements to get accurate measurements and prevent capture issues.
  const resets = [];

  for (let p = root.parentElement; p && p !== document.body; p = p.parentElement) {
    const s = window.getComputedStyle(p);
    if (s.transform !== 'none' || s.zoom !== '1') {
      resets.push(tempOverride(p, { transform: 'none', zoom: '1', transition: 'none' }));
    }
  }

  // Force visibility without changing layout mode (e.g. keep flex/grid centering).
  const rootDisplay = window.getComputedStyle(root).display;
  resets.push(
    tempOverride(root, {
      display: rootDisplay === 'none' ? 'block' : rootDisplay,
      opacity: '1',
      visibility: 'visible',
      transform: 'none',
      transition: 'none',
    })
  );

  root.querySelectorAll('.fragment').forEach((f) => {
    resets.push(tempOverride(f, { transform: 'none', opacity: '1', visibility: 'visible', transition: 'none' }));
  });

  // Ensure element is in view and has finished layout recalculation
  root.scrollIntoView({ behavior: 'auto' });
  // Force a synchronous layout recalculation by accessing offsetHeight
  void root.offsetHeight;

  // Brief timeout to let the browser recalculate styles after resetting transforms
  // Double requestAnimationFrame ensures the browser has truly painted the un-transformed frame
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise((r) => setTimeout(r, 150));

  const rootRect = root.getBoundingClientRect();
  const PPTX_WIDTH_IN = globalOptions._slideWidth || 10;
  const PPTX_HEIGHT_IN = globalOptions._slideHeight || 5.625;

  const contentWidthIn = rootRect.width * PX_TO_INCH;
  const contentHeightIn = rootRect.height * PX_TO_INCH;

  const marginPct = Math.max(0, globalOptions.margin ?? 0.02);
  const targetW = PPTX_WIDTH_IN * (1 - marginPct * 2);
  const targetH = PPTX_HEIGHT_IN * (1 - marginPct * 2);

  const scale = Math.min(targetW / contentWidthIn, targetH / contentHeightIn);

  const layoutConfig = {
    rootX: rootRect.x,
    rootY: rootRect.y,
    scale: scale,
    offX: (PPTX_WIDTH_IN - contentWidthIn * scale) / 2,
    offY: (PPTX_HEIGHT_IN - contentHeightIn * scale) / 2,
  };

  const renderQueue = [];
  const asyncTasks = []; // Queue for heavy operations (Images, Canvas)
  let domOrderCounter = 0;

  // --- EXTRACT BACKGROUND ---
  const getHex = (v) => { const c = parseColor(v); return (c?.hex && c.opacity > 0) ? c.hex : null; };
  const rStyle = window.getComputedStyle(root);
  const bStyle = window.getComputedStyle(document.body);
  const slideBgColor = getHex(root.getAttribute('data-background-color')) || getHex(rStyle.backgroundColor) || getHex(bStyle.backgroundColor);
  const slideBgImg = root.getAttribute('data-background-image') || rStyle.backgroundImage?.match(/url\(["']?(.*?)["']?\)/)?.[1];
  const rawBgOpacity = parseFloat(root.getAttribute('data-background-opacity'));
  const slideBgOpacity = Number.isFinite(rawBgOpacity) ? Math.max(0, Math.min(1, rawBgOpacity)) : 1;
  const slideBgTransparency = (1 - slideBgOpacity) * 100;

  if (slideBgColor) {
    renderQueue.push({
      type: 'shape', zIndex: -10000, domOrder: -2, shapeType: pptx.ShapeType.rect,
      options: { x: 0, y: 0, w: PPTX_WIDTH_IN, h: PPTX_HEIGHT_IN, fill: { color: slideBgColor } }
    });
  }

  if (slideBgImg) {
    const item = { type: 'image', zIndex: -9999, domOrder: -1, options: { x: 0, y: 0, w: PPTX_WIDTH_IN, h: PPTX_HEIGHT_IN, transparency: slideBgTransparency, data: null } };
    renderQueue.push(item);
    asyncTasks.push(async () => {
      item.options.data = await getProcessedImage(slideBgImg, PPTX_WIDTH_IN * PPI, PPTX_HEIGHT_IN * PPI, { tl: 0, tr: 0, bl: 0, br: 0 }, 'cover', '50% 50%');
      if (!item.options.data) item.skip = true;
    });
  }

  // Sync Traversal Function
  function collect(node, parentZIndex, inheritedAnim = null) {
    const order = domOrderCounter++;

    let currentZ = parentZIndex;
    let nodeStyle = null;
    let currentAnim = inheritedAnim;
    const nodeType = node.nodeType;

    if (nodeType === 1) {
      nodeStyle = window.getComputedStyle(node);
      const isFragment = node.classList && node.classList.contains('fragment');

      if (isFragment) {
        const classes = node.getAttribute('class') || '';
        const dirMatch = classes.match(/(fade|slide)-(up|down|left|right)/);

        let config = { type: 'fadein' };
        if (dirMatch) {
          const dirs = { up: 'bottom', down: 'top', left: 'right', right: 'left' };
          config = { type: 'flyin', direction: dirs[dirMatch[2]] };
        } else if (/\b(zoom|shrink|grow)\b/.test(classes)) {
          config = { type: 'zoom' };
        } else if (/\b(wipe|peak)\b/.test(classes)) {
          config = { type: classes.match(/\b(wipe|peak)\b/)[0] };
        }

        const order = parseInt(node.getAttribute('data-fragment-index') || 0) + 1;
        currentAnim = { ...config, order };
      }

      // Optimization: Skip completely hidden elements immediately
      if (
        nodeStyle.display === 'none' ||
        (!isFragment && !currentAnim && (nodeStyle.visibility === 'hidden' || nodeStyle.opacity === '0'))
      ) {
        return;
      }
      if (nodeStyle.zIndex !== 'auto') {
        currentZ = parseInt(nodeStyle.zIndex);
      }
    }

    // Prepare the item. If it needs async work, it returns a 'job'
    const result = prepareRenderItem(
      node,
      { ...layoutConfig, root },
      order,
      pptx,
      currentZ,
      nodeStyle,
      globalOptions
    );

    if (result) {
      if (result.items) {
        // Apply inherited animations
        if (currentAnim) {
          result.items.forEach(item => {
            if (!item.options) item.options = {};
            if (!item.options.animation) item.options.animation = { ...currentAnim };
          });
        }
        // Push items immediately to queue (data might be missing but filled later)
        renderQueue.push(...result.items);
      }
      if (result.job) {
        // Push the promise-returning function to the task list
        asyncTasks.push(result.job);
      }
      if (result.stopRecursion) return;
    }

    // Recurse children synchronously
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      collect(childNodes[i], currentZ, currentAnim);
    }
  }

  // 1. Traverse and build the structure (Fast)
  collect(root, 0, null);

  // 2. Execute all heavy tasks in parallel (Fast)
  if (asyncTasks.length > 0) {
    await Promise.all(asyncTasks.map((task) => task()));
  }

  // 3. Cleanup and Sort
  // Remove items that failed to generate data (marked with skip)
  const finalQueue = renderQueue.filter(
    (item) => !item.skip && (item.type !== 'image' || item.options.data)
  );

  finalQueue.sort((a, b) => {
    if (a.zIndex !== b.zIndex) return a.zIndex - b.zIndex;
    return a.domOrder - b.domOrder;
  });

  // Assign triggers to animations (Ensures items sharing same fragment order trigger together)
  const triggeredOrders = new Set();
  finalQueue.forEach(item => {
    if (item.options?.animation?.order !== undefined) {
      if (!item.options.animation.trigger) {
        if (triggeredOrders.has(item.options.animation.order)) {
          item.options.animation.trigger = 'withPrevious';
        } else {
          item.options.animation.trigger = 'onClick';
          triggeredOrders.add(item.options.animation.order);
        }
      } else if (item.options.animation.trigger === 'onClick') {
        triggeredOrders.add(item.options.animation.order);
      }
    }
  });

  // 4. Add to Slide
  for (const item of finalQueue) {
    if (item.type === 'shape') slide.addShape(item.shapeType, item.options);
    if (item.type === 'image') slide.addImage(item.options);
    if (item.type === 'text') slide.addText(item.textParts, item.options);
    if (item.type === 'table') {
      slide.addTable(item.tableData.rows, {
        x: item.options.x,
        y: item.options.y,
        w: item.options.w,
        colW: item.tableData.colWidths, // Essential for correct layout
        autoPage: false,
        // Remove default table styles so our extracted CSS applies cleanly
        border: { type: 'none' },
        fill: { color: 'FFFFFF', transparency: 100 },
      });
    }
  }

  // Restore overrides
  resets.forEach((restore) => restore());
}

/**
 * Optimized html2canvas wrapper
 * Includes fix for cropped icons by adjusting styles in the cloned document.
 */
async function elementToCanvasImage(node, widthPx, heightPx) {
  return new Promise((resolve) => {
    // 1. Assign a temp ID to locate the node inside the cloned document
    const originalId = node.id;
    const tempId = 'pptx-capture-' + Math.random().toString(36).substr(2, 9);
    node.id = tempId;

    const width = Math.max(Math.ceil(widthPx), 1);
    const height = Math.max(Math.ceil(heightPx), 1);
    const style = window.getComputedStyle(node);

    // Add padding to the clone to capture spilling content (like extensive font glyphs)
    const padding = 10;

    html2canvas(node, {
      backgroundColor: null,
      logging: false,
      scale: 3, // Higher scale for sharper icons
      useCORS: true, // critical for external fonts/images
      width: width + padding * 2, // Capture a larger area
      height: height + padding * 2,
      x: -padding, // Offset capture to include the padding
      y: -padding,
      onclone: (clonedDoc) => {
        const clonedNode = clonedDoc.getElementById(tempId);
        if (clonedNode) {
          // --- FIX: CLIP & FONT ISSUES ---
          // Apply styles DIRECTLY to elements to ensure html2canvas picks them up
          // This avoids issues where <style> tags in onclone are ignored or delayed

          // 1. Force FontAwesome Family on Icons
          const icons = clonedNode.querySelectorAll('.fa, .fas, .far, .fab');
          icons.forEach((icon) => {
            icon.style.setProperty('font-family', 'FontAwesome', 'important');
          });

          // 2. Fix Image Display
          const images = clonedNode.querySelectorAll('img');
          images.forEach((img) => {
            img.style.setProperty('display', 'inline-block', 'important');
          });

          // 3. Force overflow visible on the container so glyphs bleeding out aren't cut
          clonedNode.style.overflow = 'visible';

          // 4. Adjust alignment for Icons to prevent baseline clipping
          // (Applies to <i>, <span>, or standard icon classes)
          const tag = clonedNode.tagName;
          if (tag === 'I' || tag === 'SPAN' || clonedNode.className.includes('fa-')) {
            Object.assign(clonedNode.style, {
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0',
              lineHeight: '1',
              verticalAlign: 'middle'
            });
            clonedNode.style.setProperty('font-family', 'FontAwesome', 'important');
          }
        }
      },
    })
      .then((canvas) => {
        // Restore the original ID
        if (originalId) node.id = originalId;
        else node.removeAttribute('id');

        const destCanvas = document.createElement('canvas');
        destCanvas.width = width;
        destCanvas.height = height;
        const ctx = destCanvas.getContext('2d');

        // Draw captured canvas (which is padded) back to the original size
        // We need to draw the CENTER of the source canvas to the destination
        // The source canvas is (width + 2*padding) * scale
        // We want to draw the crop starting at padding*scale
        const scale = 3;
        const sX = padding * scale;
        const sY = padding * scale;
        const sW = width * scale;
        const sH = height * scale;

        ctx.drawImage(canvas, sX, sY, sW, sH, 0, 0, width, height);

        // --- Border Radius Clipping (Existing Logic) ---
        let { tl, tr, br, bl } = getBorderRadii(style);

        const f = Math.min(
          width / (tl + tr) || Infinity,
          height / (tr + br) || Infinity,
          width / (br + bl) || Infinity,
          height / (bl + tl) || Infinity
        );

        if (f < 1) {
          tl *= f;
          tr *= f;
          br *= f;
          bl *= f;
        }

        if (tl + tr + br + bl > 0) {
          ctx.globalCompositeOperation = 'destination-in';
          ctx.beginPath();
          ctx.moveTo(tl, 0);
          ctx.lineTo(width - tr, 0);
          ctx.arcTo(width, 0, width, tr, tr);
          ctx.lineTo(width, height - br);
          ctx.arcTo(width, height, width - br, height, br);
          ctx.lineTo(bl, height);
          ctx.arcTo(0, height, 0, height - bl, bl);
          ctx.lineTo(0, tl);
          ctx.arcTo(0, 0, tl, 0, tl);
          ctx.closePath();
          ctx.fill();
        }

        resolve(destCanvas.toDataURL('image/png'));
      })
      .catch((e) => {
        if (originalId) node.id = originalId;
        else node.removeAttribute('id');
        console.warn('Canvas capture failed for node', node, e);
        resolve(null);
      });
  });
}

/**
 * Helper to identify elements that should be rendered as icons (Images).
 * Detects Custom Elements AND generic tags (<i>, <span>) with icon classes/pseudo-elements.
 */
function isIconElement(node) {
  // 1. Custom Elements (hyphenated tags) or Explicit Library Tags
  const tag = node.tagName.toUpperCase();
  if (
    tag.includes('-') ||
    [
      'MATERIAL-ICON',
      'ICONIFY-ICON',
      'REMIX-ICON',
      'ION-ICON',
      'EVA-ICON',
      'BOX-ICON',
      'FA-ICON',
    ].includes(tag)
  ) {
    return true;
  }

  // 2. Class-based Icons (FontAwesome, Bootstrap, Material symbols) on <i> or <span>
  if (tag === 'I' || tag === 'SPAN') {
    const cls = node.getAttribute('class') || '';
    if (
      typeof cls === 'string' &&
      (cls.includes('fa-') ||
        cls.includes('fas') ||
        cls.includes('far') ||
        cls.includes('fab') ||
        cls.includes('bi-') ||
        cls.includes('material-icons') ||
        cls.includes('icon'))
    ) {
      // Double-check: Must have pseudo-element content to be a CSS icon
      const before = window.getComputedStyle(node, '::before').content;
      const after = window.getComputedStyle(node, '::after').content;
      const hasContent = (c) => c && c !== 'none' && c !== 'normal' && c !== '""';

      if (hasContent(before) || hasContent(after)) return true;
    }
  }

  return false;
}

function getBorderRadii(style) {
  return {
    tl: parseFloat(style.borderTopLeftRadius) || 0,
    tr: parseFloat(style.borderTopRightRadius) || 0,
    br: parseFloat(style.borderBottomRightRadius) || 0,
    bl: parseFloat(style.borderBottomLeftRadius) || 0,
  };
}

function createAsyncImageJob(itemOpts, dataFetcher) {
  const item = {
    type: 'image',
    zIndex: itemOpts.zIndex,
    domOrder: itemOpts.domOrder,
    options: { x: itemOpts.x, y: itemOpts.y, w: itemOpts.w, h: itemOpts.h, rotate: itemOpts.rotate, data: null },
  };

  const job = async () => {
    try {
      const data = await dataFetcher();
      if (data && (typeof data !== 'string' || data.length > 10)) {
        item.options.data = data;
      } else {
        item.skip = true;
      }
    } catch (e) {
      console.warn('Async image job failed:', e);
      item.skip = true;
    }
  };

  return { items: [item], job, stopRecursion: true };
}

/**
 * Replaces createRenderItem.
 * Returns { items: [], job: () => Promise, stopRecursion: boolean }
 */
function prepareRenderItem(
  node,
  config,
  domOrder,
  pptx,
  effectiveZIndex,
  computedStyle,
  globalOptions = {}
) {
  let scaleNode = node;
  let style = computedStyle;
  const isTextNode = node.nodeType === 3;

  if (isTextNode) {
    if (!node.nodeValue.trim()) return null;
    scaleNode = node.parentElement;
    if (!scaleNode || isTextContainer(scaleNode)) return null;
    style = window.getComputedStyle(scaleNode);
  } else if (node.nodeType !== 1) {
    return null;
  }

  const accScale = getAccumulatedScale(scaleNode, config.root.parentElement, style);
  const intrinsicScale = config.scale * accScale;

  // 1. Text Node Handling
  if (isTextNode) {
    const textContent = smartTrimStart(node.nodeValue);
    const range = document.createRange();
    range.selectNode(node);
    const rect = range.getBoundingClientRect();
    range.detach();

    const widthPx = rect.width;
    const heightPx = rect.height;
    const unrotatedW = widthPx * PX_TO_INCH * config.scale;
    const unrotatedH = heightPx * PX_TO_INCH * config.scale;

    const x = config.offX + (rect.left - config.rootX) * PX_TO_INCH * config.scale;
    const y = config.offY + (rect.top - config.rootY) * PX_TO_INCH * config.scale;

    return {
      items: [
        {
          type: 'text',
          zIndex: effectiveZIndex,
          domOrder,
          textParts: [
            {
              text: textContent,
              options: getTextStyle(style, intrinsicScale),
            },
          ],
          options: { x, y, w: unrotatedW, h: unrotatedH, margin: 0, autoFit: true },
        },
      ],
      stopRecursion: false,
    };
  }

  const rect = node.getBoundingClientRect();
  if (rect.width < 0.5 || rect.height < 0.5) return null;

  const zIndex = effectiveZIndex;
  const rotation = getRotation(style.transform);
  const writingModeVert = getWritingModeVert(style.writingMode, style.textOrientation);
  const elementOpacity = parseFloat(style.opacity);
  const safeOpacity = isNaN(elementOpacity) ? 1 : elementOpacity;

  // Use scaled offsetWidth if available, else rect.width
  const widthPx = node.offsetWidth ? (node.offsetWidth * accScale) : rect.width;
  const heightPx = node.offsetHeight ? (node.offsetHeight * accScale) : rect.height;

  const unrotatedW = widthPx * PX_TO_INCH * config.scale;
  const unrotatedH = heightPx * PX_TO_INCH * config.scale;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let x = config.offX + (centerX - config.rootX) * PX_TO_INCH * config.scale - unrotatedW / 2;
  let y = config.offY + (centerY - config.rootY) * PX_TO_INCH * config.scale - unrotatedH / 2;
  let w = unrotatedW;
  let h = unrotatedH;

  const items = [];

  if (node.tagName === 'TABLE') {
    const tableData = extractTableData(node, config.scale, intrinsicScale);
    const tableItems = [
      {
        type: 'table',
        zIndex: effectiveZIndex,
        domOrder,
        tableData: tableData,
        options: { x, y, w: unrotatedW, h: unrotatedH },
      },
    ];

    // 1. Check for Background / Shadow / Radius on the table itself
    const shadowStr = style.boxShadow;
    const hasShadow = shadowStr && shadowStr !== 'none';
    const borderRadius = parseFloat(style.borderRadius) || 0;
    const bgColor = parseColor(style.backgroundColor);
    const hasBg = bgColor.hex && bgColor.opacity > 0;

    if (hasShadow || borderRadius > 0 || hasBg) {
      const transparency = (1 - bgColor.opacity) * 100;
      const shadow = hasShadow ? getVisibleShadow(shadowStr, config.scale) : null;
      let shapeType = pptx.ShapeType.rect;
      let rectRadius = 0;

      if (borderRadius > 0) {
        shapeType = pptx.ShapeType.roundRect;
        let cappedRadiusPx = Math.min(borderRadius, Math.min(widthPx, heightPx) / 2);
        rectRadius = cappedRadiusPx * PX_TO_INCH * config.scale;
      }

      // Add a backing shape item before the table
      tableItems.unshift({
        type: 'shape',
        zIndex: effectiveZIndex,
        domOrder, // Same domOrder ensures it renders before the table (queue order)
        shapeType,
        options: {
          x,
          y,
          w: unrotatedW,
          h: unrotatedH,
          fill: hasBg ? { color: bgColor.hex, transparency } : { type: 'none' },
          shadow,
          rectRadius,
        },
      });
    }

    return {
      items: tableItems,
      stopRecursion: true,
    };
  }

  if ((node.tagName === 'UL' || node.tagName === 'OL') && !isComplexHierarchy(node)) {
    const result = renderListAsBullets(node, x, y, w, h, zIndex, domOrder, config, intrinsicScale, style);
    if (result) return result;
    const listItems = [];
    const liChildren = Array.from(node.children).filter((c) => c.tagName === 'LI');

    liChildren.forEach((child, index) => {
      const liStyle = window.getComputedStyle(child);
      const liRect = child.getBoundingClientRect();
      const parentRect = node.getBoundingClientRect(); // node is UL/OL

      // 1. Determine Bullet Config
      let bullet = { type: 'bullet' };
      const listStyleType = liStyle.listStyleType || 'disc';

      if (node.tagName === 'OL' || listStyleType === 'decimal') {
        bullet = { type: 'number' };
      } else if (listStyleType === 'none') {
        bullet = false;
      } else {
        let code = '2022'; // disc
        if (listStyleType === 'circle') code = '25CB';
        if (listStyleType === 'square') code = '25A0';

        // --- CHANGE: Color & Size Logic (Option > ::marker > CSS color) ---
        let finalHex = '000000';
        let markerFontSize = null;

        // A. Check Global Option override
        if (globalOptions?.listConfig?.color) {
          finalHex = parseColor(globalOptions.listConfig.color).hex || '000000';
        }
        // B. Check ::marker pseudo element (supported in modern browsers)
        else {
          const markerStyle = window.getComputedStyle(child, '::marker');
          const markerColor = parseColor(markerStyle.color);
          if (markerColor.hex) {
            finalHex = markerColor.hex;
          } else {
            // C. Fallback to LI text color
            const colorObj = parseColor(liStyle.color);
            if (colorObj.hex) finalHex = colorObj.hex;
          }

          // Check ::marker font-size
          const markerFs = parseFloat(markerStyle.fontSize);
          if (!isNaN(markerFs) && markerFs > 0) {
            // Convert px->pt for PPTX
            markerFontSize = markerFs * 0.75 * config.scale;
          }
        }

        bullet = { code, color: finalHex };
        if (markerFontSize) {
          bullet.fontSize = markerFontSize;
        }
      }

      // 2. Calculate Dynamic Indent (Respects padding-left)
      // Visual Indent = Distance from UL left edge to LI Content left edge.
      // PptxGenJS 'indent' = Space between bullet and text?
      // Actually PptxGenJS 'indent' allows setting the hanging indent.
      // We calculate the TOTAL visual offset from the parent container.
      // 1 px = 0.75 pt (approx, standard DTP).
      // We must scale it by config.scale.
      const visualIndentPx = liRect.left - parentRect.left;
      /*
         Standard indent in PPT is ~27pt.
         If visualIndentPx is small (e.g. 10px padding), we want small indent.
         If visualIndentPx is large (40px padding), we want large indent.
         We treat 'indent' as the value to pass to PptxGenJS.
      */
      const computedIndentPt = visualIndentPx * 0.75 * config.scale;

      if (bullet && computedIndentPt > 0) {
        bullet.indent = computedIndentPt;
        // Also support custom margin between bullet and text if provided in listConfig?
        // For now, computedIndentPt covers the visual placement.
      }

      // 3. Extract Text Parts
      const parts = collectTextParts(child, liStyle, config.scale);

      if (parts.length > 0) {
        parts.forEach((p) => {
          if (!p.options) p.options = {};
        });

        // A. Apply Bullet
        // Workaround: pptxgenjs bullets inherit the style of the text run they are attached to.
        // To support ::marker styles (color, size) that differ from the text, we create
        // a "dummy" text run at the start of the list item that carries the bullet configuration.
        if (bullet) {
          const firstPartInfo = parts[0].options;

          // Create a dummy run. We use a Zero Width Space to ensure it's rendered but invisible.
          // This "run" will hold the bullet and its specific color/size.
          const bulletRun = {
            text: '\u200B',
            options: {
              ...firstPartInfo, // Inherit base props (fontFace, etc.)
              color: bullet.color || firstPartInfo.color,
              fontSize: bullet.fontSize || firstPartInfo.fontSize,
              bullet: bullet,
            },
          };

          // Don't duplicate transparent or empty color from firstPart if bullet has one
          if (bullet.color) bulletRun.options.color = bullet.color;
          if (bullet.fontSize) bulletRun.options.fontSize = bullet.fontSize;

          // Prepend
          parts.unshift(bulletRun);
        }

        // B. Apply Spacing
        let ptBefore = 0;
        let ptAfter = 0;

        // A. Check Global Options (Expected in Points)
        if (globalOptions.listConfig?.spacing) {
          if (typeof globalOptions.listConfig.spacing.before === 'number') {
            ptBefore = globalOptions.listConfig.spacing.before;
          }
          if (typeof globalOptions.listConfig.spacing.after === 'number') {
            ptAfter = globalOptions.listConfig.spacing.after;
          }
        }
        // B. Fallback to CSS Margins (Convert px -> pt)
        else {
          const mt = parseFloat(liStyle.marginTop) || 0;
          const mb = parseFloat(liStyle.marginBottom) || 0;
          if (mt > 0) ptBefore = mt * 0.75 * config.scale;
          if (mb > 0) ptAfter = mb * 0.75 * config.scale;
        }

        if (ptBefore > 0) parts[0].options.paraSpaceBefore = ptBefore;
        if (ptAfter > 0) parts[0].options.paraSpaceAfter = ptAfter;

        if (index < liChildren.length - 1) {
          parts[parts.length - 1].options.breakLine = true;
        }

        listItems.push(...parts);
      }
    });

    if (listItems.length > 0) {
      // Add background if exists
      const bgColorObj = parseColor(style.backgroundColor);
      if (bgColorObj.hex && bgColorObj.opacity > 0) {
        items.push({
          type: 'shape',
          zIndex,
          domOrder,
          shapeType: 'rect',
          options: { x, y, w, h, fill: { color: bgColorObj.hex } },
        });
      }

      items.push({
        type: 'text',
        zIndex: zIndex + 1,
        domOrder,
        textParts: listItems,
        options: {
          x,
          y,
          w,
          h,
          align: 'left',
          valign: 'top',
          margin: 0,
          autoFit: true,
          wrap: true,
          vert: writingModeVert,
        },
      });

      return { items, stopRecursion: true };
    }
  }

  if (node.tagName === 'CANVAS') {
    return createAsyncImageJob(
      { zIndex, domOrder, x, y, w, h, rotate: rotation },
      () => node.toDataURL('image/png')
    );
  }

  // --- ASYNC JOB: SVG Tags ---
  if (node.nodeName.toUpperCase() === 'SVG') {
    return createAsyncImageJob(
      { zIndex, domOrder, x, y, w, h, rotate: rotation },
      () => {
        const converter = globalOptions.svgAsVector ? svgToSvg : svgToPng;
        return converter(node);
      }
    );
  }

  // --- ASYNC JOB: IMG Tags ---
  if (node.tagName === 'IMG') {
    let radii = getBorderRadii(style);

    const hasAnyRadius = radii.tl > 0 || radii.tr > 0 || radii.br > 0 || radii.bl > 0;
    if (!hasAnyRadius) {
      const parent = node.parentElement;
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.overflow !== 'visible') {
        const pRadii = getBorderRadii(parentStyle);
        const pRect = parent.getBoundingClientRect();
        if (Math.abs(pRect.width - rect.width) < 5 && Math.abs(pRect.height - rect.height) < 5) {
          radii = pRadii;
        }
      }
    }

    const objectFit = style.objectFit || 'fill'; // default CSS behavior is fill
    const objectPosition = style.objectPosition || '50% 50%';

    return createAsyncImageJob(
      { zIndex, domOrder, x, y, w, h, rotate: rotation },
      () => getProcessedImage(node.src, widthPx, heightPx, radii, objectFit, objectPosition)
    );
  }

  // --- ASYNC JOB: Icons and Other Elements ---
  if (isIconElement(node)) {
    return createAsyncImageJob(
      { zIndex, domOrder, x, y, w, h, rotate: rotation },
      () => elementToCanvasImage(node, widthPx, heightPx)
    );
  }

  // Radii logic
  const radii = getBorderRadii(style);
  const borderRadiusValue = parseFloat(style.borderRadius) || 0;

  const hasPartialBorderRadius =
    [radii.bl, radii.br, radii.tl, radii.tr].some((r) => r > 0 && r !== borderRadiusValue) ||
    (borderRadiusValue === 0 && Object.values(radii).some((r) => r > 0));

  // --- PRIORITY SVG: Solid Fill with Partial Border Radius (Vector Cone/Tab) ---
  // Fix for "missing cone": Prioritize SVG vector generation over Raster Canvas for simple shapes with partial radii.
  // This avoids html2canvas failures on empty divs.
  const tempBg = parseColor(style.backgroundColor);
  const isTxt = isTextContainer(node);

  // BUG FIX: Don't treat as a vector shape if it has content (like text or children).
  // This prevents containers like ".glass-box" from being treated as empty shapes and stopping recursion.
  const hasContent = node.textContent.trim().length > 0 || node.children.length > 0;

  if (hasPartialBorderRadius && tempBg.hex && !isTxt && !hasContent) {
    const shapeSvg = generateCustomShapeSVG(widthPx, heightPx, tempBg.hex, tempBg.opacity, radii);

    return {
      items: [
        {
          type: 'image',
          zIndex,
          domOrder,
          options: { data: shapeSvg, x, y, w, h, rotate: rotation },
        },
      ],
      stopRecursion: true, // Treat as leaf
    };
  }

  // --- ASYNC JOB: Clipped Divs via Canvas ---
  // Only capture as image if it's an empty leaf.
  // Rasterizing containers (like .glass-box) kills editability of children.
  if (hasPartialBorderRadius && isClippedByParent(node) && !hasContent) {
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginTop = parseFloat(style.marginTop) || 0;
    x += marginLeft * PX_TO_INCH * config.scale;
    y += marginTop * PX_TO_INCH * config.scale;

    return createAsyncImageJob(
      { zIndex, domOrder, x, y, w, h, rotate: rotation },
      () => elementToCanvasImage(node, widthPx, heightPx)
    );
  }

  // --- SYNC: Standard CSS Extraction ---
  const bgColorObj = parseColor(style.backgroundColor);
  const bgClip = style.webkitBackgroundClip || style.backgroundClip;
  const isBgClipText = bgClip === 'text';
  const bgImgStr = style.backgroundImage;
  const hasGradient = !isBgClipText && bgImgStr && bgImgStr.includes('linear-gradient');
  const urlMatch = !isBgClipText && !hasGradient && bgImgStr ? bgImgStr.match(/url\(['"]?(.*?)['"]?\)/) : null;
  const hasBgImgUrl = !!urlMatch;

  const borderColorObj = parseColor(style.borderColor);
  const borderWidth = parseFloat(style.borderWidth);
  const hasBorder = borderWidth > 0 && borderColorObj.hex;

  const borderInfo = getBorderInfo(style, intrinsicScale);
  const hasUniformBorder = borderInfo.type === 'uniform';
  const hasCompositeBorder = borderInfo.type === 'composite';

  const shadowStr = style.boxShadow;
  const hasShadow = shadowStr && shadowStr !== 'none';
  const softEdge = getSoftEdges(style.filter, intrinsicScale);

  let isImageWrapper = false;
  const imgChild = Array.from(node.children).find((c) => c.tagName === 'IMG');
  if (imgChild) {
    const childW = imgChild.offsetWidth || imgChild.getBoundingClientRect().width;
    const childH = imgChild.offsetHeight || imgChild.getBoundingClientRect().height;
    if (childW >= widthPx - 2 && childH >= heightPx - 2) isImageWrapper = true;
  }

  let textPayload = null;
  const isText = isTextContainer(node);

  // If node contains a UL/OL as a direct child, DON'T treat it as pure text container
  // Let the UL/OL be processed separately for proper bullet rendering
  const hasDirectList = Array.from(node.children).some((c) => c.tagName === 'UL' || c.tagName === 'OL');

  if (isText && !hasDirectList) {
    const textParts = [];
    let trimNextLeading = false;

    node.childNodes.forEach((child, index) => {
      // Handle <br> tags
      if (child.tagName === 'BR') {
        // 1. Trim trailing space from the *previous* text part to prevent double wrapping
        if (textParts.length > 0) {
          const lastPart = textParts[textParts.length - 1];
          if (lastPart.text && typeof lastPart.text === 'string') {
            lastPart.text = lastPart.text.trimEnd();
          }
        }

        textParts.push({ text: '', options: { breakLine: true } });

        // 2. Signal to trim leading space from the *next* text part
        trimNextLeading = true;
        return;
      }

      let textVal = child.nodeType === 3 ? child.nodeValue : child.textContent;
      let nodeStyle = child.nodeType === 1 ? window.getComputedStyle(child) : style;
      // Normalize whitespace: replace newlines/tabs with spaces, but preserve &nbsp; (U+00A0)
      textVal = textVal.replace(/[\n\r\t]+/g, ' ').replace(/[ \f\v]{2,}/g, ' ');

      // Trimming logic - use smart trim to preserve non-breaking spaces
      if (index === 0) textVal = smartTrimStart(textVal);
      if (trimNextLeading) {
        textVal = smartTrimStart(textVal);
        trimNextLeading = false;
      }

      if (index === node.childNodes.length - 1) textVal = textVal.trimEnd();
      if (nodeStyle.textTransform === 'uppercase') textVal = textVal.toUpperCase();
      if (nodeStyle.textTransform === 'lowercase') textVal = textVal.toLowerCase();

      if (textVal.length > 0) {
        const textOpts = getTextStyle(nodeStyle, intrinsicScale);

        // BUG FIX: Numbers 1 and 2 having background.
        // If this is a naked Text Node (nodeType 3), it inherits style from the parent container.
        // The parent container's background is already rendered as the Shape Fill.
        // We must NOT render it again as a Text Highlight, otherwise it looks like a solid marker on top of the shape.
        if (child.nodeType === 3 && textOpts.highlight) {
          delete textOpts.highlight;
        }

        textParts.push({ text: textVal, options: textOpts });
      }
    });

    if (textParts.length > 0) {
      let align = style.textAlign || 'left';
      if (align === 'start') align = 'left';
      if (align === 'end') align = 'right';
      let valign = 'top';
      if (style.alignItems === 'center') valign = 'middle';
      if (style.justifyContent === 'center' && style.display.includes('flex')) align = 'center';

      const pt = parseFloat(style.paddingTop) || 0;
      const pb = parseFloat(style.paddingBottom) || 0;
      if (Math.abs(pt - pb) < 2) valign = 'middle';

      let padding = getPadding(style, intrinsicScale);
      if (align === 'center' && valign === 'middle') padding = [0, 0, 0, 0];

      textPayload = { text: textParts, align, valign, inset: padding };
    }
  }

  let bgJob = null;

  if (hasBgImgUrl || hasGradient || (softEdge && bgColorObj.hex && !isImageWrapper)) {
    if (hasBgImgUrl) {
      const bgUrl = urlMatch[1];
      const radii = {
        tl: parseFloat(style.borderTopLeftRadius) || 0,
        tr: parseFloat(style.borderTopRightRadius) || 0,
        br: parseFloat(style.borderBottomRightRadius) || 0,
        bl: parseFloat(style.borderBottomLeftRadius) || 0,
      };

      const bgItem = {
        type: 'image',
        zIndex,
        domOrder,
        options: { x, y, w, h, rotate: rotation, data: null },
      };
      items.push(bgItem);

      bgJob = async () => {
        const processed = await getProcessedImage(
          bgUrl,
          widthPx,
          heightPx,
          radii,
          style.backgroundSize || 'cover',
          style.backgroundPosition || '50% 50%'
        );
        if (processed) bgItem.options.data = processed;
        else bgItem.skip = true;
      };
    } else {
      let bgData = null;
      let padIn = 0;
      if (softEdge) {
        const svgInfo = generateBlurredSVG(
          widthPx,
          heightPx,
          bgColorObj.hex,
          borderRadiusValue,
          softEdge
        );
        bgData = svgInfo.data;
        padIn = svgInfo.padding * PX_TO_INCH * config.scale;
      } else {
        bgData = generateGradientSVG(
          widthPx,
          heightPx,
          style.backgroundImage,
          hasPartialBorderRadius ? radii : borderRadiusValue,
          hasBorder ? { color: borderColorObj.hex, width: borderWidth } : null
        );
      }

      if (bgData) {
        items.push({
          type: 'image',
          zIndex,
          domOrder,
          options: {
            data: bgData,
            x: x - padIn,
            y: y - padIn,
            w: w + padIn * 2,
            h: h + padIn * 2,
            rotate: rotation,
          },
        });
      }
    }

    if (textPayload) {
      textPayload.text[0].options.fontSize =
        Number(textPayload.text[0]?.options?.fontSize?.toFixed(1)) || 12;
      items.push({
        type: 'text',
        zIndex: zIndex + 1,
        domOrder,
        textParts: textPayload.text,
        options: {
          x,
          y,
          w,
          h,
          align: textPayload.align,
          valign: textPayload.valign,
          inset: textPayload.inset,
          rotate: rotation,
          margin: 0,
          wrap: true,
          autoFit: true,
          vert: writingModeVert,
        },
      });
    }
    if (hasCompositeBorder) {
      const borderItems = createCompositeBorderItems(
        borderInfo.sides,
        x,
        y,
        w,
        h,
        intrinsicScale,
        zIndex,
        domOrder
      );
      items.push(...borderItems);
    }
  } else if (
    (bgColorObj.hex && !isImageWrapper) ||
    hasUniformBorder ||
    hasCompositeBorder ||
    hasShadow ||
    textPayload
  ) {
    const finalAlpha = safeOpacity * bgColorObj.opacity;
    const transparency = (1 - finalAlpha) * 100;
    const useSolidFill = bgColorObj.hex && !isImageWrapper;

    if (hasPartialBorderRadius && useSolidFill && !textPayload) {
      const shapeSvg = generateCustomShapeSVG(
        widthPx,
        heightPx,
        bgColorObj.hex,
        bgColorObj.opacity,
        radii
      );

      items.push({
        type: 'image',
        zIndex,
        domOrder,
        options: { data: shapeSvg, x, y, w, h, rotate: rotation },
      });
    } else {
      const shapeOpts = {
        x,
        y,
        w,
        h,
        rotate: rotation,
        fill: useSolidFill
          ? { color: bgColorObj.hex, transparency: transparency }
          : { type: 'none' },
        line: hasUniformBorder ? borderInfo.options : null,
      };

      if (hasShadow) shapeOpts.shadow = getVisibleShadow(shadowStr, intrinsicScale);

      // 1. Calculate dimensions first
      const minDimension = Math.min(widthPx, heightPx);

      let rawRadius = parseFloat(style.borderRadius) || 0;
      const isPercentage = style.borderRadius && style.borderRadius.toString().includes('%');

      // 2. Normalize radius to pixels
      let radiusPx = rawRadius;
      if (isPercentage) {
        radiusPx = (rawRadius / 100) * minDimension;
      }

      let shapeType = pptx.ShapeType.rect;

      // 3. Determine Shape Logic
      const isSquare = Math.abs(widthPx - heightPx) < 1;
      const isFullyRound = radiusPx >= minDimension / 2;

      // CASE A: It is an Ellipse if:
      // 1. It is explicitly "50%" (standard CSS way to make ovals/circles)
      // 2. OR it is a perfect square and fully rounded (a circle)
      if (isFullyRound && (isPercentage || isSquare)) {
        shapeType = pptx.ShapeType.ellipse;
      }
      // CASE B: It is a Rounded Rectangle (including "Pill" shapes)
      else if (radiusPx > 0) {
        shapeType = pptx.ShapeType.roundRect;
        let r = radiusPx / minDimension;
        if (r > 0.5) r = 0.5;

        shapeOpts.rectRadius = r;
      }

      if (textPayload) {
        let cappedRadiusPx = Math.min(radiusPx, minDimension / 2);
        shapeOpts.rectRadius = cappedRadiusPx * PX_TO_INCH * config.scale;
        textPayload.text[0].options.fontSize =
          Number(textPayload.text[0]?.options?.fontSize?.toFixed(1)) || 12;
        const textOptions = {
          shape: shapeType,
          ...shapeOpts,
          rotate: rotation,
          align: textPayload.align,
          valign: textPayload.valign,
          inset: textPayload.inset,
          margin: 0,
          wrap: true,
          autoFit: true,
          vert: writingModeVert,
        };
        items.push({
          type: 'text',
          zIndex,
          domOrder,
          textParts: textPayload.text,
          options: textOptions,
        });
      } else if (!hasPartialBorderRadius) {
        items.push({
          type: 'shape',
          zIndex,
          domOrder,
          shapeType,
          options: shapeOpts,
        });
      }
    }

    if (hasCompositeBorder) {
      const borderSvgData = generateCompositeBorderSVG(
        widthPx,
        heightPx,
        borderRadiusValue,
        borderInfo.sides
      );
      if (borderSvgData) {
        items.push({
          type: 'image',
          zIndex: zIndex + 1,
          domOrder,
          options: { data: borderSvgData, x, y, w, h, rotate: rotation },
        });
      }
    }
  }

  return { items, job: bgJob, stopRecursion: !!textPayload };
}

function isComplexHierarchy(root) {
  // Use a simple tree traversal to find forbidden elements in the list structure
  const stack = [root];
  while (stack.length > 0) {
    const el = stack.pop();

    // 1. Layouts: Flex/Grid on LIs
    if (el.tagName === 'LI') {
      const s = window.getComputedStyle(el);
      if (s.display === 'flex' || s.display === 'grid' || s.display === 'inline-flex') return true;
    }

    // 2. Media / Icons
    if (['IMG', 'SVG', 'CANVAS', 'VIDEO', 'IFRAME'].includes(el.tagName)) return true;
    if (isIconElement(el)) return true;

    // 3. Nested Lists (Flattening logic doesn't support nested bullets well yet)
    if (el !== root && (el.tagName === 'UL' || el.tagName === 'OL')) return true;

    // Recurse, but don't go too deep if not needed
    for (let i = 0; i < el.children.length; i++) {
      stack.push(el.children[i]);
    }
  }
  return false;
}

/**
 * Render UL/OL as native PPTX bullets (simplified)
 */
function renderListAsBullets(node, x, y, w, h, zIndex, domOrder, config, intrinsicScale, style) {
  const listItems = [];
  const liChildren = Array.from(node.children).filter(c => c.tagName === 'LI');

  liChildren.forEach((li, idx) => {
    const liStyle = window.getComputedStyle(li);
    const bullet = getBulletConfig(node, li, liStyle);

    if (bullet) {
      const visualIndent = (li.getBoundingClientRect().left - node.getBoundingClientRect().left) * 0.75 * config.scale;
      if (visualIndent > 0) bullet.indent = visualIndent;
    }

    const parts = collectListParts(li, liStyle, intrinsicScale);
    if (parts.length === 0) return;

    parts.forEach(p => { if (!p.options) p.options = {}; });

    if (bullet) {
      parts.unshift({
        text: '\u200B',
        options: { ...parts[0]?.options, bullet, color: bullet.color || parts[0]?.options?.color }
      });
    }

    const mt = parseFloat(liStyle.marginTop) || 0;
    const mb = parseFloat(liStyle.marginBottom) || 0;
    if (mt > 0) parts[0].options.paraSpaceBefore = mt * 0.75 * intrinsicScale;
    if (mb > 0) parts[0].options.paraSpaceAfter = mb * 0.75 * intrinsicScale;
    if (idx < liChildren.length - 1) parts[parts.length - 1].options.breakLine = true;

    listItems.push(...parts);
  });

  if (listItems.length === 0) return null;

  const items = [];
  const bgColorObj = parseColor(style.backgroundColor);
  if (bgColorObj.hex && bgColorObj.opacity > 0) {
    items.push({ type: 'shape', zIndex, domOrder, shapeType: 'rect', options: { x, y, w, h, fill: { color: bgColorObj.hex } } });
  }

  items.push({
    type: 'text',
    zIndex: zIndex + 1,
    domOrder,
    textParts: listItems,
    options: { x, y, w, h, align: 'left', valign: 'top', margin: 0, autoFit: true, wrap: true }
  });

  return { items, stopRecursion: true };
}

/** Get bullet config for a list item */
function getBulletConfig(node, li, liStyle) {
  let listStyleType = liStyle.listStyleType || 'disc';

  // Check for custom icons from ::before
  if (listStyleType === 'none') {
    const beforeStyle = window.getComputedStyle(li, '::before');
    const content = beforeStyle.content?.replace(/^['"]|['"]$/g, '').trim();

    if (content && !/^[\d.\s]*$/.test(content)) {
      const color = parseColor(beforeStyle.color).hex || '000000';
      return { type: 'bullet', char: content, color: color.startsWith('#') ? color : `#${color}` };
    }

    listStyleType = node.tagName === 'OL' ? 'decimal' : 'disc';
  }

  if (node.tagName === 'OL' || listStyleType === 'decimal') return { type: 'number' };
  if (listStyleType === 'none') return null;

  const charMap = { disc: '2022', circle: '25CB', square: '25A0' };
  return { type: 'bullet', char: charMap[listStyleType] || charMap.disc, color: '#000000' };
}

function collectListParts(node, parentStyle, scale) {
  const parts = [];

  // Check for CSS Content (::before) - often used for icons
  if (node.nodeType === 1) {
    const beforeStyle = window.getComputedStyle(node, '::before');
    const content = beforeStyle.content;
    if (content && content !== 'none' && content !== 'normal' && content !== '""') {
      // Strip quotes
      const cleanContent = content.replace(/^['"]|['"]$/g, '');
      if (cleanContent.trim()) {
        parts.push({
          text: cleanContent + ' ', // Add space after icon
          options: getTextStyle(beforeStyle, scale),  // Use ::before style for custom icons (color, etc)
        });
      }
    }
  }

  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      // Text
      const val = child.nodeValue.replace(/[\n\r\t]+/g, ' ').replace(/\s{2,}/g, ' ');
      if (val) {
        // Use parent style if child is text node, otherwise current style
        const styleToUse = node.nodeType === 1 ? window.getComputedStyle(node) : parentStyle;
        parts.push({
          text: val,
          options: getTextStyle(styleToUse, scale),
        });
      }
    } else if (child.nodeType === 1) {
      // Element (span, i, b)
      // Recurse
      parts.push(...collectListParts(child, parentStyle, scale));
    }
  });

  return parts;
}

function createCompositeBorderItems(sides, x, y, w, h, scale, zIndex, domOrder) {
  const items = [];
  const pxToInch = 1 / 96;
  const common = { zIndex: zIndex + 1, domOrder, shapeType: 'rect' };

  if (sides.top.width > 0)
    items.push({
      ...common,
      options: { x, y, w, h: sides.top.width * pxToInch * scale, fill: { color: sides.top.color } },
    });
  if (sides.right.width > 0)
    items.push({
      ...common,
      options: {
        x: x + w - sides.right.width * pxToInch * scale,
        y,
        w: sides.right.width * pxToInch * scale,
        h,
        fill: { color: sides.right.color },
      },
    });
  if (sides.bottom.width > 0)
    items.push({
      ...common,
      options: {
        x,
        y: y + h - sides.bottom.width * pxToInch * scale,
        w,
        h: sides.bottom.width * pxToInch * scale,
        fill: { color: sides.bottom.color },
      },
    });
  if (sides.left.width > 0)
    items.push({
      ...common,
      options: {
        x,
        y,
        w: sides.left.width * pxToInch * scale,
        h,
        fill: { color: sides.left.color },
      },
    });

  return items;
}
