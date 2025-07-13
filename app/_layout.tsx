import { useColorScheme } from '@/hooks/useColorScheme';
import { auth } from '@/lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';



export default function RootLayout() {
  const colorScheme = useColorScheme();  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
 
   useEffect(() => {
    async function saveUserData() {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const userId = user.uid;

      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({ token, userId })
      );

      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log(userData.token, userData.userId);
      }
    }
    saveUserData();
  }, []);
   if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{headerShown:false}}>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
