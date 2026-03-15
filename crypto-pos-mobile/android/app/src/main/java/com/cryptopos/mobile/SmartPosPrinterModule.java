package com.cryptopos.mobile;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class SmartPosPrinterModule extends ReactContextBaseJavaModule {
  private static final String MODULE_NAME = "SmartPosPrinter";
  private volatile boolean sdkInitialized = false;

  public SmartPosPrinterModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void isAvailable(Promise promise) {
    promise.resolve(classExists("com.zcs.sdk.DriverManager"));
  }

  @ReactMethod
  public void initialize(Promise promise) {
    try {
      initializeSdkIfNeeded();
      promise.resolve(true);
    } catch (Exception e) {
      promise.reject("SDK_INIT_ERROR", e.getMessage(), e);
    }
  }

  @ReactMethod
  public void getPrinterStatus(Promise promise) {
    try {
      initializeSdkIfNeeded();
      Object printer = getPrinter();
      Method getPrinterStatusMethod = printer.getClass().getMethod("getPrinterStatus");
      int status = (Integer) getPrinterStatusMethod.invoke(printer);
      promise.resolve(status);
    } catch (Exception e) {
      promise.reject("PRINTER_STATUS_ERROR", e.getMessage(), e);
    }
  }

  @ReactMethod
  public void printText(String text, Promise promise) {
    try {
      if (text == null || text.trim().isEmpty()) {
        promise.reject("INVALID_INPUT", "Receipt text cannot be empty.");
        return;
      }

      initializeSdkIfNeeded();
      Object printer = getPrinter();

      int paperOutStatus = getStaticInt("com.zcs.sdk.SdkResult", "SDK_PRN_STATUS_PAPEROUT", -1001);
      int sdkOk = getStaticInt("com.zcs.sdk.SdkResult", "SDK_OK", 0);

      Method getPrinterStatusMethod = printer.getClass().getMethod("getPrinterStatus");
      int currentStatus = (Integer) getPrinterStatusMethod.invoke(printer);
      if (currentStatus == paperOutStatus) {
        promise.reject("PAPER_OUT", "Printer is out of paper.");
        return;
      }

      Object format = null;
      try {
        Class<?> formatClass = Class.forName("com.zcs.sdk.print.PrnStrFormat");
        format = formatClass.getDeclaredConstructor().newInstance();
      } catch (Exception ignored) {
        // Fallback below if format class is unavailable.
      }

      boolean appended = false;
      if (format != null) {
        try {
          Method appendWithFormat = printer.getClass().getMethod(
            "setPrintAppendString",
            String.class,
            format.getClass()
          );
          appendWithFormat.invoke(printer, text, format);
          appended = true;
        } catch (NoSuchMethodException ignored) {
          // Try plain append method next.
        }
      }

      if (!appended) {
        Method appendPlain = printer.getClass().getMethod("setPrintAppendString", String.class);
        appendPlain.invoke(printer, text);
      }

      Method startPrintMethod = printer.getClass().getMethod("setPrintStart");
      int result = (Integer) startPrintMethod.invoke(printer);
      if (result != sdkOk) {
        promise.reject("PRINT_FAILED", "Printer returned error code: " + result);
        return;
      }

      promise.resolve(true);
    } catch (Exception e) {
      promise.reject("PRINT_ERROR", e.getMessage(), e);
    }
  }

  private synchronized void initializeSdkIfNeeded() throws Exception {
    if (sdkInitialized) {
      return;
    }

    if (!classExists("com.zcs.sdk.DriverManager")) {
      throw new IllegalStateException("SmartPOS SDK classes not found. Add SDK .jar/.aar and .so files to Android app.");
    }

    Object driverManager = getDriverManager();
    Method getBaseSysDevice = driverManager.getClass().getMethod("getBaseSysDevice");
    Object sys = getBaseSysDevice.invoke(driverManager);

    Method sdkInit = sys.getClass().getMethod("sdkInit");
    int status = (Integer) sdkInit.invoke(sys);
    int sdkOk = getStaticInt("com.zcs.sdk.SdkResult", "SDK_OK", 0);

    if (status != sdkOk) {
      Method sysPowerOn = sys.getClass().getMethod("sysPowerOn");
      sysPowerOn.invoke(sys);
      Thread.sleep(1000);
      status = (Integer) sdkInit.invoke(sys);
    }

    if (status != sdkOk) {
      throw new IllegalStateException("Failed to initialize SmartPOS SDK. Code: " + status);
    }

    sdkInitialized = true;
  }

  private Object getDriverManager() throws Exception {
    Class<?> driverManagerClass = Class.forName("com.zcs.sdk.DriverManager");
    Method getInstance = driverManagerClass.getMethod("getInstance");
    return getInstance.invoke(null);
  }

  private Object getPrinter() throws Exception {
    Object driverManager = getDriverManager();
    Method getPrinter = driverManager.getClass().getMethod("getPrinter");
    Object printer = getPrinter.invoke(driverManager);
    if (printer == null) {
      throw new IllegalStateException("Printer device is not available.");
    }
    return printer;
  }

  private static boolean classExists(String className) {
    try {
      Class.forName(className);
      return true;
    } catch (ClassNotFoundException e) {
      return false;
    }
  }

  private static int getStaticInt(String className, String fieldName, int defaultValue) {
    try {
      Class<?> cls = Class.forName(className);
      Field field = cls.getField(fieldName);
      return field.getInt(null);
    } catch (Exception ignored) {
      return defaultValue;
    }
  }
}
