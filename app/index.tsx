import React, { useRef, useState, useEffect } from "react";

import {
  View,
  Text,
 Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

const { width, height } =
  Dimensions.get("window");

/* ---------------- SLIDES ---------------- */

const slides = [
  {
    id: "1",
  },

  {
    id: "2",

    title:
      "Sher-e-Kashmir University of Agricultural Sciences and Technology",

    description:
      "SKUAST drives innovation in agriculture through advanced research, technology-led farming practices, and farmer-centric development initiatives focused on sustainability and growth.",

    image: require("../assets/skaust-logo.png"),
  },

  {
    id: "3",

    title:
      "Holistic Agriculture Development Programme",

    description:
      "HADP empowers agricultural transformation through modern infrastructure, sustainable farming initiatives, smart ecosystem development, and technology-enabled support for farming communities.",

    image: require("../assets/hadp-logo.png"),
  },
];

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

/* ---------------- 🌿 ERAM CORE ---------------- */

function EcosystemCore() {

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

/* ---------------- 🌿 INFO SCREEN ---------------- */

function InfoScreen({
  item,
}: any) {

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

/* ---------------- MAIN ---------------- */

export default function Onboarding() {

  const router = useRouter();

  const flatListRef =
    useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const onViewableItemsChanged =
    useRef(({ viewableItems }: any) => {

      if (
        viewableItems.length > 0
      ) {
        setCurrentIndex(
          viewableItems[0].index
        );
      }

    }).current;

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const goToSlide = (
    index: number
  ) => {

    setCurrentIndex(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const goToDashboard = () => {
    router.replace("/home");
  };

  const renderItem = ({
    item,
    index,
  }: any) => {

    const isFirst =
      index === 0;

    return (
      <View
        style={{
          width,
          height,
        }}
      >

        {/* 🌌 BACKGROUND */}
        <CinematicBackground />

        {/* ✨ PARTICLES */}
        <EcosystemParticles />

        {/* 🌿 CONTENT LAYER */}
        <View
          style={{
            flex: 1,
          }}
        >

          {/* 🌿 ERAM CORE */}
          <View
            className="items-center"
            style={{
              paddingTop: 48,
            }}
          >
            <EcosystemCore />
          </View>

          {/* 🌿 FIRST SCREEN */}
          {isFirst ? (

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 150,
              }}
            >

              {/* BOTH LOGOS AS ONE CENTERED COMPONENT */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >

                <Image
                  source={require("../assets/skaust-logo.png")}
                  style={{
                    width: 170,
                    height: 170,
                    opacity: 0.96,
                  }}
                  resizeMode="contain"
                />

                <View style={{ height: 20 }} />

                <Image
                  source={require("../assets/hadp-logo.png")}
                  style={{
                    width: 170,
                    height: 170,
                    opacity: 0.96,
                  }}
                  resizeMode="contain"
                />

              </View>

            </View>

          ) : (

            <InfoScreen item={item} />
          )}

        </View>

      </View>
    );
  };

  return (

    <>
      <StatusBar
        barStyle="light-content"
      />

      <SafeAreaView
        className="flex-1"
        style={{
          backgroundColor: "#020617",
        }}
      >

        {/* 🌌 SLIDES */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={
            false
          }
          keyExtractor={(item) =>
            item.id
          }
          onViewableItemsChanged={
            onViewableItemsChanged
          }
          viewabilityConfig={
            viewConfigRef.current
          }
          snapToInterval={width}
          decelerationRate="fast"
          getItemLayout={(
            _,
            index
          ) => ({
            length: width,
            offset:
              width * index,
            index,
          })}
        />

        {/* 🌿 PAGINATION */}
        <View
          style={{
            position: "absolute",
            bottom: 118,
            width: "100%",
            alignItems: "center",
          }}
        >

          <View className="flex-row">

            {slides.map((_, index) => (

              <TouchableOpacity
                key={index}
                onPress={() =>
                  goToSlide(index)
                }
              >

                <View
                  className={`h-2 rounded-full mx-1 ${
                    index ===
                    currentIndex
                      ? "bg-green-400 w-5"
                      : "bg-white/20 w-2"
                  }`}
                />

              </TouchableOpacity>
            ))}

          </View>

        </View>

        {/* 🌱 CTA */}
        <View
          style={{
            position: "absolute",
            bottom: 36,
            left: 24,
            right: 24,
          }}
        >

          <TouchableOpacity
            onPress={goToDashboard}
            activeOpacity={0.92}
            className="py-4 rounded-[30px] items-center"
            style={{
              backgroundColor:
                "rgba(34,197,94,0.14)",

              borderWidth: 1,

              borderColor:
                "rgba(187,247,208,0.12)",

              shadowColor: "#22c55e",

              shadowOpacity: 0.18,

              shadowRadius: 20,

              shadowOffset: {
                width: 0,
                height: 10,
              },

              elevation: 10,
            }}
          >

            <Text
              style={{
                fontFamily:
                  "Montserrat_600SemiBold",

                letterSpacing: 0.5,
              }}
              className="text-green-50 text-base"
            >
              Continue to Dashboard
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </>
  );
}
