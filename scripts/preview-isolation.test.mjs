import test from 'node:test';
import assert from 'node:assert/strict';
import { isProductionAnalyticsOrigin } from '../app/client/utils/analyticsConsent.js';

test('analytics is eligible only on the exact production HTTPS origin', () => {
  assert.equal(isProductionAnalyticsOrigin('https://www.rentconverter.com'), true);
  for (const origin of ['', 'http://localhost:3000', 'http://127.0.0.1:3000', 'https://deploy-preview-2--rent-converter.netlify.app', 'https://main--rent-converter.netlify.app', 'https://www.rentconverter.com.example.com', 'http://www.rentconverter.com', 'https://rentconverter.com']) {
    assert.equal(isProductionAnalyticsOrigin(origin), false, origin);
  }
});
