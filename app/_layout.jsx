import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";
import { CategoryTabProvider } from "./context/CategoryTabContext";
import { PostPropertyProvider } from "./context/PostPropertyContext";
import { LocationProvider } from "./context/LocationContext";
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Disable Reanimated strict mode warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Inter-Bold": require("../Font/Inter_18pt-Bold.ttf"),
    "Inter-Regular": require("../Font/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../Font/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../Font/Inter_18pt-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LocationProvider>
      <PostPropertyProvider>
        <CategoryTabProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CategoryTabProvider>
      </PostPropertyProvider>
    </LocationProvider>
  );
}
