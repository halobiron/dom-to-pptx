// src/__tests__/pptx-normalizer.test.js
import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { normalizePptxZip } from '../pptx-normalizer.js';

const CONTENT_TYPES_NS = 'http://schemas.openxmlformats.org/package/2006/content-types';

function buildContentTypes({ defaults = [], overrides = [] } = {}) {
  const defaultsXml = defaults
    .map((d) => `  <Default Extension="${d.ext}" ContentType="${d.contentType}"/>`)
    .join('\n');
  const overridesXml = overrides
    .map((o) => `  <Override PartName="${o.partName}" ContentType="${o.contentType}"/>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="${CONTENT_TYPES_NS}">
${defaultsXml}
${overridesXml}
</Types>`;
}

describe('normalizePptxZip', () => {
  it('removes Override entries that point at files missing from the zip', async () => {
    const zip = new JSZip();
    zip.file(
      '[Content_Types].xml',
      buildContentTypes({
        defaults: [
          { ext: 'rels', contentType: 'application/vnd.openxmlformats-package.relationships+xml' },
          { ext: 'xml', contentType: 'application/xml' },
        ],
        overrides: [
          {
            partName: '/ppt/slideMasters/slideMaster1.xml',
            contentType:
              'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
          },
          {
            partName: '/ppt/slideMasters/slideMaster2.xml',
            contentType:
              'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
          },
          {
            partName: '/ppt/slideMasters/slideMaster3.xml',
            contentType:
              'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
          },
        ],
      })
    );
    zip.file('ppt/slideMasters/slideMaster1.xml', '<sldMaster/>');

    await normalizePptxZip(zip);

    const xml = await zip.file('[Content_Types].xml').async('string');
    expect(xml).toContain('slideMaster1.xml');
    expect(xml).not.toContain('slideMaster2.xml');
    expect(xml).not.toContain('slideMaster3.xml');
  });

  it('preserves Default entries even when their extension has no parts in the zip', async () => {
    const zip = new JSZip();
    zip.file(
      '[Content_Types].xml',
      buildContentTypes({
        defaults: [{ ext: 'fntdata', contentType: 'application/x-fontdata' }],
        overrides: [],
      })
    );

    await normalizePptxZip(zip);

    const xml = await zip.file('[Content_Types].xml').async('string');
    expect(xml).toContain('Extension="fntdata"');
  });

  it('is idempotent', async () => {
    const zip = new JSZip();
    zip.file(
      '[Content_Types].xml',
      buildContentTypes({
        defaults: [{ ext: 'xml', contentType: 'application/xml' }],
        overrides: [
          {
            partName: '/ppt/slideMasters/slideMaster1.xml',
            contentType:
              'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
          },
          {
            partName: '/ppt/slideMasters/slideMaster9.xml',
            contentType:
              'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
          },
        ],
      })
    );
    zip.file('ppt/slideMasters/slideMaster1.xml', '<sldMaster/>');

    await normalizePptxZip(zip);
    const firstPass = await zip.file('[Content_Types].xml').async('string');
    await normalizePptxZip(zip);
    const secondPass = await zip.file('[Content_Types].xml').async('string');

    expect(secondPass).toBe(firstPass);
  });

  it('does nothing when [Content_Types].xml is missing', async () => {
    const zip = new JSZip();
    await expect(normalizePptxZip(zip)).resolves.toBeUndefined();
  });

  it('skips a malformed [Content_Types].xml without throwing', async () => {
    const zip = new JSZip();
    const garbage = '<<<not xml>>>';
    zip.file('[Content_Types].xml', garbage);

    await expect(normalizePptxZip(zip)).resolves.toBeUndefined();
    const xml = await zip.file('[Content_Types].xml').async('string');
    expect(xml).toBe(garbage);
  });

  it('handles PartName values without a leading slash', async () => {
    const zip = new JSZip();
    zip.file(
      '[Content_Types].xml',
      buildContentTypes({
        overrides: [
          {
            partName: 'ppt/slideMasters/slideMaster1.xml',
            contentType:
              'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
          },
          {
            partName: 'ppt/slideMasters/slideMasterGhost.xml',
            contentType:
              'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
          },
        ],
      })
    );
    zip.file('ppt/slideMasters/slideMaster1.xml', '<sldMaster/>');

    await normalizePptxZip(zip);

    const xml = await zip.file('[Content_Types].xml').async('string');
    expect(xml).toContain('slideMaster1.xml');
    expect(xml).not.toContain('slideMasterGhost.xml');
  });
});
