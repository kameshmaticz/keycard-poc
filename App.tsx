import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  NativeEventEmitter,
  useColorScheme,
} from 'react-native';

import Keycard from 'react-native-status-keycard';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const eventEmitter = new NativeEventEmitter(Keycard);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [nfcUnsupported, setNfcUnsupported] = useState(false);

  const backgroundStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // ✅ Register NFC Event Listeners
  useEffect(() => {
    console.log('🔁 Registering NFC event listeners');
  
    const listeners = [
      eventEmitter.addListener('keyCardOnConnected', (data) => {
        console.log('🟢 Keycard Connected!', data);
        Alert.alert("Keycard Connected");
      }),
      
      eventEmitter.addListener('keyCardOnDisconnected', () => {
        console.log('🔴 Keycard Disconnected');
        Alert.alert("Keycard Disconnected");
      }),
      
      eventEmitter.addListener('keyCardOnNFCEnabled', () => {
        console.log('📶 NFC Enabled');
      }),
      
      eventEmitter.addListener('keyCardOnNFCDisabled', () => {
        console.log('🚫 NFC Disabled');
      }),
      
      eventEmitter.addListener('keyCardOnError', (error) => {
        console.error('⚠️ NFC Error:', error);
        Alert.alert("NFC Error", error.message || "Unknown error");
      })
    ];
  
    return () => {
      listeners.forEach(listener => listener.remove());
      Keycard.stopNFC().catch(console.warn);
    };
  }, []);

  // ✅ Function to Check & Start NFC
  async function checkNFC() {
    try {
      const isSupported = await Keycard.nfcIsSupported();
      console.log("✅ NFC Supported:", isSupported);

      if (!isSupported) {
        setNfcUnsupported(true);
        Alert.alert("❌ NFC not supported on this device.");
        return;
      }

      const isEnabled = await Keycard.nfcIsEnabled();
      console.log("⚙️ NFC Enabled:", isEnabled);

      if (isEnabled) {
        await Keycard.startNFC("📲 Tap your Keycard");
       const dax =  await Keycard.start()
console.log("dax" , dax)
        //  console.log(await Keycard.log())
        //  key
        setNfcEnabled(true);
      } else {
        Alert.alert("ℹ️ Please enable NFC from settings.");
        Keycard.openNfcSettings();
      }
    } catch (error: any) {
      console.error("⚠️ Error checking NFC:", error);
      Alert.alert("Error", error.message || "Unknown NFC error");
    }
  }

  return (
    <View style={backgroundStyle}>
      {nfcUnsupported ? (
        <Text>NFC is not supported on this device.</Text>
      ) : nfcEnabled ? (
        <Text style={styles.highlight}>✅ NFC is Enabled and waiting for card...</Text>
      ) : (
        <View>
          <Text style={styles.highlight}>🔍 Tap the button to check NFC</Text>
          <Button title="Check NFC" onPress={checkNFC} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default App;
