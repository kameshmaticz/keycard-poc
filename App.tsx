/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Keycard from "react-native-status-keycard";

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
