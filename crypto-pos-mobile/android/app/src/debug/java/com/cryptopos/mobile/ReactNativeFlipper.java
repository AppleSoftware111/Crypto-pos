/**
 * Flipper disabled for EAS/CI builds - no-op to avoid Flipper dependency.
 */
package com.cryptopos.mobile;

import android.content.Context;
import com.facebook.react.ReactInstanceManager;

public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    // No-op: Flipper removed to fix EAS Gradle builds.
  }
}
