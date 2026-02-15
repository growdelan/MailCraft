import { describe, expect, it } from 'vitest';

import { DEVICE_PRESETS, ZOOM_PRESETS } from '../lib/devices';

describe('devices', () => {
  it('contains required email600 preset and zoom values', () => {
    const email600 = DEVICE_PRESETS.find((item) => item.id === 'email600');

    expect(email600?.width).toBe(600);
    expect(ZOOM_PRESETS).toEqual([80, 100, 125]);
  });
});
