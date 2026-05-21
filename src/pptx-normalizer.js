// src/pptx-normalizer.js
//
// Defensive OOXML normalizer that runs over the PPTX produced by PptxGenJS
// before we hand the .pptx blob to the user. Microsoft PowerPoint refuses to
// open files when [Content_Types].xml advertises parts that are not actually
// present in the package — see 错误诊断.md for the original incident report.
//
// This module operates on an already-loaded JSZip instance and mutates it in
// place. The caller is responsible for re-serializing the zip with DEFLATE
// compression afterwards.

/**
 * Strips dangling <Override> entries from [Content_Types].xml.
 *
 * An Override is "dangling" when its PartName attribute references a file path
 * that does not exist inside the zip. Default entries are left untouched
 * because they apply to every file with a matching extension, and removing
 * them would break legitimate parts (e.g. the fntdata default added by the
 * font embedder).
 *
 * The function is idempotent: running it twice on the same zip yields the
 * same result as running it once.
 *
 * @param {import('jszip')} zip - JSZip instance with the loaded PPTX package.
 * @returns {Promise<void>}
 */
export async function normalizePptxZip(zip) {
  if (!zip) return;

  const contentTypesFile = zip.file('[Content_Types].xml');
  if (!contentTypesFile) return;

  let xmlStr;
  try {
    xmlStr = await contentTypesFile.async('string');
  } catch (e) {
    console.warn('[pptx-normalizer] Failed to read [Content_Types].xml:', e);
    return;
  }

  let doc;
  try {
    doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
  } catch (e) {
    console.warn('[pptx-normalizer] Failed to parse [Content_Types].xml:', e);
    return;
  }

  const parserError = doc.getElementsByTagName('parsererror')[0];
  if (parserError) {
    console.warn('[pptx-normalizer] [Content_Types].xml has parser errors, skipping cleanup.');
    return;
  }

  const overrides = Array.from(doc.getElementsByTagName('Override'));
  let removedCount = 0;

  for (const node of overrides) {
    const partName = node.getAttribute('PartName');
    if (!partName) continue;

    // PartName is always an absolute path inside the zip, e.g. "/ppt/slideMasters/slideMaster2.xml".
    // JSZip indexes its files without the leading slash.
    const zipPath = partName.startsWith('/') ? partName.slice(1) : partName;

    if (!zip.file(zipPath)) {
      node.parentNode?.removeChild(node);
      removedCount++;
    }
  }

  if (removedCount === 0) return;

  const serialized = new XMLSerializer().serializeToString(doc);
  zip.file('[Content_Types].xml', serialized);
}
