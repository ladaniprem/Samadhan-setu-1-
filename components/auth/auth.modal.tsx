import { View, Text, Pressable, Image, Platform} from "react-native";
import React, { useEffect } from "react";
import { BlurView } from "expo-blur";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import JWT from "expo-jwt";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
export default function AuthModal({
  setModalVisible,
}: {
  setModalVisible: (modal: boolean) => void;
}) {
  const configureGoogleSignIn = () => {
    if (Platform.OS === "ios") {
      GoogleSignin.configure({
        iosClientId : process.env.EXPO_PUBLIC_IOS_GOOGLE_API_KEY,
      });
    } else {
      GoogleSignin.configure({
        webClientId: "802041688593-qidiob37af5qgebp7f3k5qb77ghlaivm.apps.googleusercontent.com",
      });
    }
  };
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await authHandler({
        name: userInfo.user.name!,
        email: userInfo.user.email!,
        avatar: userInfo.user.photo!,
        isGuest: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const guestUser = {
        name: `Guest_${Math.random().toString(36).substring(7)}`,
        email: `guest_${Date.now()}@guest.com`,
        avatar: "@/assets/images/onboarding/guest.png",
        isGuest: true,
      };
      await authHandler(guestUser);
    } catch (error) {
      console.error("Guest login error:", error);
    }
  };
  const authHandler = async ({
    name,
    email,
    avatar,
    isGuest,
  }: {
    name: string;
    email: string;
    avatar: string;
    isGuest: boolean;
  }) => {
    const user = {
      name,
      email,
      avatar,
      isGuest,
    };
    const token = JWT.encode(
      {
        ...user,
      },
      process.env.EXPO_PUBLIC_JWT_SECRET_KEY!
    );
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/login`,
      {
        signedToken: token,
        isGuest,
      }
    );
    await SecureStore.setItemAsync("accessToken", res.data.accessToken);
    if (isGuest) {
      await SecureStore.setItemAsync("isGuest", "true");
    }
    setModalVisible(false);
    router.push("/(tabs)");
  };

  return (
    <BlurView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Pressable
        style={{
          width: windowWidth(420),
          height: windowHeight(250),
          marginHorizontal: windowWidth(50),
          backgroundColor: "#fff",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: "Poppins_700Bold",
          }}
        >
          Samadhan Simplified
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT17,
            paddingTop: windowHeight(5),
            fontFamily: "Poppins_300Light",
          }}
        >
          It's easier than your imagination!
        </Text>
        <View
          style={{
            paddingVertical: windowHeight(10),
            flexDirection: "row",
            gap: windowWidth(20),
          }}
        >
          <Pressable onPress={googleSignIn}>
            <Image
              source={require("@/assets/images/onboarding/google.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/images/onboarding/guest.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </Pressable>
        </View>
      </Pressable>
    </BlurView>
  );
}