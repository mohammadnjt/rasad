// import { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// export default function RootLayout() {
//   useFrameworkReady();

//   return (
//     <GestureHandlerRootView style={{ flex: 1, direction: 'rtl' }}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="onboardingScreen" options={{ headerShown: false }} />
//         <Stack.Screen name="login" options={{ headerShown: false }} />
//         <Stack.Screen name="education" options={{ headerShown: false }} />
//         <Stack.Screen name="news" options={{ headerShown: false }} />
//         <Stack.Screen name="contact" options={{ headerShown: false }} />
//         <Stack.Screen name="settings" options={{ headerShown: false }} />
//         <Stack.Screen name="guide" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </GestureHandlerRootView>
//   );
// }

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [isOnboarded, setIsOnboarded] = useState(null);
  useFrameworkReady();

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('version');
      console.log('Onboarding status from AsyncStorage:', value);
      setIsOnboarded(value);
    };
    checkOnboarding();
  }, []);

  // اگر هنوز وضعیت مشخص نشده، به‌طور پیش‌فرض onboarding را نشان بده
  if (isOnboarded === null) {
    return (
      <GestureHandlerRootView style={{ flex: 1, direction: 'ltr' }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, direction: 'ltr' }}>
      {isOnboarded ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="education" options={{ headerShown: false }} />
          <Stack.Screen name="news" options={{ headerShown: false }} />
          <Stack.Screen name="contact" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="guide" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      )}
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}