import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'yourstore.io',
  appName: 'yourstore',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    }
  }
};

export default config;