import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.vinylidentifier.app',
  appName: 'VinylIdentifier',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos'],
    },
    Share: {
      // Use native share sheet
    },
  },
}

export default config
