import React from "react";
import NotificationScreen from "@/Screens/notification/notification.screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Notification() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationScreen />
    </GestureHandlerRootView>
  );
}
