'use strict';

// A vendor's key is not always the name it goes by.
//
// The Spaces row shows a vendor's name beside its mark, and it reads that name
// from the vendor key — the same key that names the glyph, the brand colour and
// the activity history. VitaCode's key is `vitacode`, but the brand signs
// itself `vita`, and the row has room for the short form. So the key stays and
// only the label is shortened: renaming the key instead would take the glyph,
// the colour and the history with it.

const test = require('node:test');
const assert = require('node:assert/strict');

const logos = require('../lib/logos');

test('a vendor with a short name is labelled with it', () => {
  assert.equal(logos.labelFor('vitacode'), 'vita');
});

test('every other vendor is labelled with its own key', () => {
  assert.equal(logos.labelFor('claude'), 'claude');
  assert.equal(logos.labelFor('opencode'), 'opencode');
  assert.equal(logos.labelFor('crush'), 'crush');
});

test('a label never changes which mark a vendor wears', () => {
  // The two tables answer different questions: `labelFor` is what the row
  // reads, `logoFor` is what it draws. A label that leaked into the mark
  // lookup would leave the row unmarked.
  assert.equal(logos.logoFor('vitacode'), logos.logoFor('vitacode'));
  assert.ok(logos.logoFor('vitacode'), 'vitacode has a mark');
  assert.equal(logos.labelFor('vitacode'), 'vita');
});

test('every label points at a vendor this plugin can draw', () => {
  for (const [vendor, label] of Object.entries(logos.LABELS)) {
    assert.ok(vendor in logos.PUA, `${vendor} has no mark`);
    assert.ok(vendor in logos.TEXT, `${vendor} has no text fallback`);
    assert.ok(vendor in logos.DISPLAY, `${vendor} has no display name`);
    assert.notEqual(label, vendor, `${vendor} is already its own label; the entry does nothing`);
  }
});

test('VitaCode YOLO is its own vendor, labelled yolo', () => {
  // The YOLO build runs VitaCode's TUI, so it shares the manifest but not the
  // row: its own mark, its own colour and the short label `yolo`.
  assert.equal(logos.labelFor('vitayolo'), 'yolo');
  assert.ok(logos.logoFor('vitayolo'), 'vitayolo has a mark');
  assert.notEqual(logos.logoFor('vitayolo'), logos.logoFor('vitacode'));
});
