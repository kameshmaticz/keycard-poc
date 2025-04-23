import React, { useEffect } from "react";
import { DeviceEventEmitter } from "react-native";

const NFCListener = () => {
  useEffect(() => {
    const onConnect = DeviceEventEmitter.addListener("keyCardOnConnected", () =>
      console.log("🔐 Keycard connected")
    );

    const onDisconnect = DeviceEventEmitter.addListener("keyCardOnDisconnected", () =>
      console.log("🔓 Keycard disconnected")
    );

    const onNFCEnabled = DeviceEventEmitter.addListener("keyCardOnNFCEnabled", () =>
      console.log("📡 NFC enabled")
    );

    const onNFCDisabled = DeviceEventEmitter.addListener("keyCardOnNFCDisabled", () =>
      console.log("📴 NFC disabled")
    );

    // Cleanup when component unmounts
    return () => {
      onConnect.remove();
      onDisconnect.remove();
      onNFCEnabled.remove();
      onNFCDisabled.remove();
    };
  }, []);

  return null; // Or your actual UI
};

export default NFCListener;
