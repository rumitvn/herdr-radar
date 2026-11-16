'use strict';

// A pane's declared vendor is also the label Herdr draws, so a short label is
// a display choice rather than a new vendor.
//
// Herdr renders `display_agent` verbatim in the sidebar row, which makes the
// string a pane reports a user-visible name. VitaCode wants to read as `vita`
// there, but the mark, the brand colour and the display name all hang off the
// vendor key `vitacode`. Without an alias the short label resolves to nothing,
// the pane falls back to the agent Herdr detected (opencode), and the row
// silently wears the wrong logo — the exact failure the alias prevents.

const test = require('node:test');
const assert = require('node:assert/strict');

const logos = require('../lib/logos');

test('a short label resolves to the vendor it names', () => {
  assert.equal(logos.canonicalVendor('vita'), 'vitacode');
  assert.equal(logos.canonicalVendor('VITA'), 'vitacode', 'the label is hand-written; case must not matter');
  assert.equal(logos.canonicalVendor('  vita  '), 'vitacode', 'padding around a hand-written label is not a vendor');
});

test('a vendor key passes through unchanged', () => {
  assert.equal(logos.canonicalVendor('claude'), 'claude');
  assert.equal(logos.canonicalVendor('vitacode'), 'vitacode');
  assert.equal(logos.canonicalVendor('GLM'), 'glm');
});

test('nothing declared resolves to nothing', () => {
  assert.equal(logos.canonicalVendor(undefined), '');
  assert.equal(logos.canonicalVendor(null), '');
  assert.equal(logos.canonicalVendor(''), '');
  assert.equal(logos.canonicalVendor('   '), '');
});

test('every alias points at a vendor this plugin can draw', () => {
  for (const [alias, vendor] of Object.entries(logos.ALIASES)) {
    assert.ok(vendor in logos.PUA, `${alias} → ${vendor} has no mark`);
    assert.ok(vendor in logos.TEXT, `${alias} → ${vendor} has no text fallback`);
    assert.ok(vendor in logos.DISPLAY, `${alias} → ${vendor} has no display name`);
    assert.ok(!(alias in logos.PUA), `${alias} is itself a vendor key; the alias would shadow it`);
  }
});
