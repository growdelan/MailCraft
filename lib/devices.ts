export interface DevicePreset {
  id: string;
  label: string;
  width: number;
  height?: number;
  mode: 'fixed' | 'email600';
}

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'email600', label: 'Email 600px', width: 600, mode: 'email600' },
  { id: 'mobile360', label: 'Mobile 360x800', width: 360, height: 800, mode: 'fixed' },
  { id: 'iphone390', label: 'iPhone 390x844', width: 390, height: 844, mode: 'fixed' },
  { id: 'tablet768', label: 'Tablet 768x1024', width: 768, height: 1024, mode: 'fixed' },
  { id: 'desktop1280', label: 'Desktop 1280x800', width: 1280, height: 800, mode: 'fixed' }
];

export const ZOOM_PRESETS = [80, 100, 125] as const;
export type ZoomPreset = (typeof ZOOM_PRESETS)[number];
