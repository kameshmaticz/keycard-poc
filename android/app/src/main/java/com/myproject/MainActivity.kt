package com.myproject

import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.ReactApplication
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.myproject.BuildConfig
import android.app.PendingIntent
import android.content.IntentFilter
import android.nfc.tech.NfcA
import android.nfc.tech.IsoDep

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  override fun getMainComponentName(): String = "MyProject"

  /**
   * Returns the instance of the [ReactActivityDelegate]. 
   * We use [DefaultReactActivityDelegate] which allows you to enable New Architecture with a single boolean flag [fabricEnabled].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED)

  /**
   * This method is triggered when a new NFC intent is detected.
   * It is called when the app is in the foreground and an NFC tag is scanned.
   */
  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent) // Keep the latest intent to handle in the next step.

    Log.d("NFC_DEBUG", "onNewIntent triggered")

    val tag: Tag? = intent?.getParcelableExtra(NfcAdapter.EXTRA_TAG)
    if (tag != null) {
      // Log the detected NFC tag and the technologies it supports.
      Log.d("NFC_DEBUG", "Tag detected! Techs: ${tag.techList.joinToString()}")

      // Send a custom event to JavaScript to notify about the connection.
      val reactContext = (application as ReactApplication).reactNativeHost
        .reactInstanceManager
        .currentReactContext

      if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
        Log.d("NFC_DEBUG", "React context is ready, sending event to JS")
        // Emits the event to JS to notify the NFC connection
        reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("keyCardOnConnected", null)
      } else {
        Log.e("NFC_DEBUG", "React context is null or not ready")
      }
    }
  }

  /**
   * Lifecycle method for when the app comes into the foreground.
   * We register NFC foreground dispatch to detect NFC tags while the app is in focus.
   */
  override fun onResume() {
    super.onResume()
    val adapter = NfcAdapter.getDefaultAdapter(this)
    if (adapter != null && adapter.isEnabled) {
      val intent = Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
      val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE)
      val filters = arrayOf(IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED))
      val techLists = arrayOf(arrayOf(NfcA::class.java.name, IsoDep::class.java.name))
      adapter.enableForegroundDispatch(this, pendingIntent, filters, techLists)
      Log.d("NFC_DEBUG", "NFC foreground dispatch enabled")
    }
  }

  /**
   * Lifecycle method for when the app goes into the background.
   * We disable NFC foreground dispatch to stop detecting tags when the app is no longer in focus.
   */
  override fun onPause() {
    super.onPause()
    val adapter = NfcAdapter.getDefaultAdapter(this)
    adapter?.disableForegroundDispatch(this)
    Log.d("NFC_DEBUG", "NFC foreground dispatch disabled")
  }
}
