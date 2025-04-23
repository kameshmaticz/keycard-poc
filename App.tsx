/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState , useEffect } from 'react';
import type {PropsWithChildren} from 'react';

import {
  Alert,
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeEventEmitter
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Keycard from "react-native-status-keycard";
import { DeviceEventEmitter } from 'react-native';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
const [nfc , Setnfc] = useState(false)
const [nftisNotThere , SetnftisNotThere]=useState(false)
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';



let isload = true 

// useEffect(() => {
//   const onConnected = DeviceEventEmitter.addListener("keyCardOnConnected", () => {
//     console.log("keycard connected");
//   });

//   const onDisconnected = DeviceEventEmitter.addListener("keyCardOnDisconnected", () => {
//     console.log("keycard disconnected");
//   });

//   const onNFCEnabled = DeviceEventEmitter.addListener("keyCardOnNFCEnabled", () => {
//     console.log("nfc enabled");
//   });

//   const onNFCDisabled = DeviceEventEmitter.addListener("keyCardOnNFCDisabled", () => {
//     console.log("nfc disabled");
//   });

//   // Cleanup on unmount
//   return () => {
//     onConnected.remove();
//     onDisconnected.remove();
//     onNFCEnabled.remove();
//     onNFCDisabled.remove();
//   };
// });

const eventEmitter = new NativeEventEmitter(Keycard);
  useEffect(() => {
    // stepRef.current = step;
  console.log('listnginnnn')
    let onConnectedListener = eventEmitter.addListener('keyCardOnConnected', ()=> console.log("connected"));
    let onDisconnectedListener = eventEmitter.addListener('keyCardOnDisconnected', () => console.log("keycard disconnected"));
    let onNFCEnabledListener = eventEmitter.addListener('keyCardOnNFCEnabled', () => console.log("nfc enabled"));
    let onNFCDisabledListener = eventEmitter.addListener('keyCardOnNFCDisabled', () => console.log("nfc disabled"));

    // if(isload){
    //   isload = false 
    //   try {
        
    //     const x =  Keycard.init("123456")
    //     console.log("INII" , x )
    //   } catch (error) {
    //     console.log("INITERROR" , error)
    //   }
    // }
//     Keycard.getApplicationInfo("").then(info => console.log(info));

// // If keycard is paired, use pairing key
// const pairing = "AFFdkP01GywuaJRQkGDq+OyPHBE9nECEDDCfXhpfaxlo";
// Keycard.getApplicationInfo(pairing).then(info => console.log(info));
    // if (!didMount.current) {
    //   didMount.current = true;

    //   const loadData = async () => {
    //     await Keycard.setPairings(await getPairings());
    //     await Keycard.setCertificationAuthorities(["029ab99ee1e7a71bdf45b3f9c58c99866ff1294d2c1e304e228a86e10c3343501c"]);
        
    //     let tmp = await AsyncStorage.getItem("wallet-key");
    //     walletKey.current = tmp !== null ? tmp : "";
    //     tmp = await AsyncStorage.getItem("key-uid");
    //     keyUID.current = tmp !== null ? tmp : "";

    //     if (walletKey.current) {
    //       setStep(Step.Home);
    //     }
    //   };

    //   loadData().catch(console.log);
    // }

    return () => {
      onConnectedListener.remove();
      onDisconnectedListener.remove();
      onNFCEnabledListener.remove();
      onNFCDisabledListener.remove();
    };
  });



  async function CheckNftis() {
    try {
      const isSupported = await Keycard.nfcIsSupported();
      if (!isSupported) {
        SetnftisNotThere(true)
        Alert.alert("NFC is not supported on this device");
        return;
      }
      const isEnabled = await Keycard.nfcIsEnabled();
      if (isEnabled) {
        console.log("NFC is enabled");
    await Keycard.startNFC("Tap your Keycard");

        Setnfc(true); // assuming Setnfc is from useState
      } else {
        console.log("NFC is supported but not enabled");
        Keycard.openNfcSettings(); // prompts the user to enable NFC
      }
    } catch (error : any) {
      console.error("Error checking NFC status:", error);
      Alert.alert("Error checking NFC", error.message || String(error));
    }
  }


  function NotNFC (){
    return (
    <View style={backgroundStyle}>
      NFC is not supported on this device
</View>
    )
  }

  function CheckForNfc(){
return (
  <View style={backgroundStyle}>
  <Text>CHECK</Text>
  <Button onPress={()=> CheckNftis()}title='CHECK NFC IS WORKING'/>
  </View>
)
  }

  function NfcisEnabled (){
    return (
      <View>
        <Text style={styles.highlight}>Nfc is Enabled </Text>
      </View>
    )
  }
  return (
    <View style={backgroundStyle}>
      {
        nfc ? NfcisEnabled() : nftisNotThere ?  NotNFC() : CheckForNfc()
      }
     
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
    color : "#FFFFFF"
  },
});

export default App;
