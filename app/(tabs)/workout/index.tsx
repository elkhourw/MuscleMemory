import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Text, View } from 'react-native';
import { Alert, BackHandler } from 'react-native';
import { CustomHeader } from '../../Components/CustomHeader'

export default function Index() {

  const navigation = useNavigation();

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Exit App',
        'Do you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              // Do nothing
            },
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();

  }, [navigation]);

  return (
    <>
      <CustomHeader
        title={{ text: 'Entrainements' }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Entrainements</Text>
      </View>
    </>
  );

}