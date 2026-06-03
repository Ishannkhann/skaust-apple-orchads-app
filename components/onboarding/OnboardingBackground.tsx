import React, { useRef, useEffect } from "react";

import {
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

/* ---------------- 🌌 CINEMATIC BACKGROUND ---------------- */

function CinematicBackground() {

  const drift = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {

    Animated.loop(
      Animated.sequence([

        Animated.timing(drift, {
          toValue: 1,
          duration: 18000,
          useNativeDriver: true,
        }),

        Animated.timing(drift, {
          toValue: 0,
          duration: 18000,
          useNativeDriver: true,
        }),

      ])
    ).start();

  }, []);

  const translateX =
    drift.interpolate({
      inputRange: [0, 1],
      outputRange: [-18, 18],
    });

  const translateY =
    drift.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 10],
    });

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
    >

      {/* 🌌 DEPTH BACKGROUND */}
      <LinearGradient
        colors={[
          "#020617",
          "#07131c",
          "#0b1f17",
          "#020617",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />

      {/* 🌿 AMBIENT FIELD LIGHT */}
      <Animated.View
        style={{
          position: "absolute",

          width: 420,

          height: 420,

          borderRadius: 999,

          backgroundColor:
            "rgba(34,197,94,0.05)",

          top: "10%",

          alignSelf: "center",

          transform: [
            { translateX },
            { translateY },
          ],
        }}
      />

      {/* 🌫 CINEMATIC HAZE */}
      <View
        style={{
          position: "absolute",

          bottom: 0,

          width: "100%",

          height: height * 0.42,

          backgroundColor:
            "rgba(0,0,0,0.14)",
        }}
      />

      {/* 🌱 LAND CURVE */}
      <View
        style={{
          position: "absolute",

          bottom: -60,

          width: width * 1.5,

          height: 220,

          borderRadius: 999,

          backgroundColor:
            "#041d12",

          alignSelf: "center",

          opacity: 0.9,
        }}
      />

    </View>
  );
}

/* ---------------- ✨ ECOSYSTEM PARTICLES ---------------- */

function EcosystemParticles() {

  const particles =
    [...Array(14)];

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFillObject}
    >

      {particles.map((_, index) => {

        const anim =
          useRef(
            new Animated.Value(0)
          ).current;

        useEffect(() => {

          Animated.loop(
            Animated.sequence([

              Animated.timing(anim, {
                toValue: 1,
                duration:
                  4200 +
                  index * 250,
                useNativeDriver:
                  true,
              }),

              Animated.timing(anim, {
                toValue: 0,
                duration:
                  4200 +
                  index * 250,
                useNativeDriver:
                  true,
              }),

            ])
          ).start();

        }, []);

        const translateY =
          anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -28],
          });

        const opacity =
          anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.03, 0.16],
          });

        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",

              width: 4,

              height: 4,

              borderRadius: 999,

              backgroundColor:
                "#d9f99d",

              left: `${6 + index * 7}%`,

              top: `${18 + index * 4}%`,

              opacity,

              transform: [
                { translateY },
              ],
            }}
          />
        );
      })}

    </View>
  );
}

/* ---------------- 🌿 ERAM CORE (named export) ---------------- */

export function EcosystemCore() {

  const breathe = useRef(
    new Animated.Value(0)
  ).current;

  const shimmer = useRef(
    new Animated.Value(-220)
  ).current;

  useEffect(() => {

    Animated.loop(
      Animated.sequence([

        Animated.timing(breathe, {
          toValue: 1,
          duration: 4200,
          useNativeDriver: true,
        }),

        Animated.timing(breathe, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true,
        }),

      ])
    ).start();

    Animated.loop(
      Animated.sequence([

        Animated.delay(1800),

        Animated.timing(shimmer, {
          toValue: 220,
          duration: 2600,
          useNativeDriver: true,
        }),

        Animated.timing(shimmer, {
          toValue: -220,
          duration: 0,
          useNativeDriver: true,
        }),

      ])
    ).start();

  }, []);

  const scale =
    breathe.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.03],
    });

  const glowOpacity =
    breathe.interpolate({
      inputRange: [0, 1],
      outputRange: [0.08, 0.18],
    });

  return (
    <View className="items-center">

      {/* 🌌 OUTER GLOW */}
      <Animated.View
        style={{
          position: "absolute",

          width: 220,

          height: 220,

          borderRadius: 999,

          backgroundColor:
            "rgba(74,222,128,0.05)",

          opacity: glowOpacity,

          transform: [{ scale }],
        }}
      />

      {/* 🌱 ERAM */}
      <Animated.View
        style={{
          transform: [{ scale }],
          overflow: "hidden",
        }}
      >

        <View>

          <Text
            style={{
              fontFamily:
                "Montserrat_700Bold",

              fontSize: 58,

              letterSpacing: 7,

              color: "#f0fdf4",

              textShadowColor:
                "rgba(187,247,208,0.16)",

              textShadowRadius: 14,
            }}
          >
            ERAM
          </Text>

          {/* ✨ SHIMMER */}
          <Animated.View
            style={{
              position: "absolute",

              top: 0,

              bottom: 0,

              width: 50,

              backgroundColor:
                "rgba(255,255,255,0.06)",

              transform: [
                {
                  translateX:
                    shimmer,
                },
                {
                  rotate: "12deg",
                },
              ],
            }}
          />

        </View>

      </Animated.View>

      {/* 🌿 TAGLINE */}
      <Text
        style={{
          fontFamily:
            "Montserrat_500Medium",

          letterSpacing: 2,

          marginTop: 16,
        }}
        className="text-[12px] text-lime-100"
      >
        Agriculture, Reimagined!
      </Text>

    </View>
  );
}

/* ---------------- 🌿 INFO SCREEN (named export) ---------------- */

export function InfoScreen({ item }: any) {

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 190,
        justifyContent: "space-between",
      }}
    >

      {/* LOGO */}
      <View className="items-center">

        <Image
          source={item.image}
          style={{
            width: 160,
            height: 160,
            opacity: 0.96,
          }}
          resizeMode="contain"
        />

      </View>

      {/* CONTENT */}
      <View
        style={{
          marginTop: 10,
        }}
      >

        <Text
          style={{
            fontFamily:
              "Montserrat_600SemiBold",

            fontSize: 20,

            lineHeight: 32,

            color: "#ffffff",

            textAlign: "center",
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontFamily:
              "Montserrat_500Medium",

            fontSize: 15.5,

            lineHeight: 30,

            color: "#d1fae5",

            textAlign: "center",

            marginTop: 24,

            paddingHorizontal: 4,
          }}
        >
          {item.description}
        </Text>

      </View>

    </View>
  );
}

/* ---------------- 🌌 COMBINED BACKGROUND (default export) ---------------- */

/**
 * The absolute-positioned cinematic backdrop for a slide: depth gradient +
 * ambient light + floating particles. These always render together as the
 * background layer behind the slide content.
 *
 * NOTE: the breathing "ERAM" core (`EcosystemCore`) is part of the slide's
 * content flow (not the absolute background), so it is exported separately and
 * rendered inside the content layer in app/index.tsx — preserving the exact
 * original layout.
 */
export default function OnboardingBackground() {
  return (
    <>
      {/* 🌌 BACKGROUND */}
      <CinematicBackground />

      {/* ✨ PARTICLES */}
      <EcosystemParticles />
    </>
  );
}
