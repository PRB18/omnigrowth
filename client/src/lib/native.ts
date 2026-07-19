import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { App } from '@capacitor/app'

/**
 * Native shell bootstrap for Capacitor (no-ops on web).
 * Call once at app start from main.tsx.
 */
export async function initNativeShell(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  try {
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#09101f' })
  } catch {
    // StatusBar unavailable on some hosts
  }

  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back()
    } else {
      void App.exitApp()
    }
  })

  try {
    await SplashScreen.hide()
  } catch {
    // Splash already auto-hidden via capacitor.config
  }
}
