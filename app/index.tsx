import React, { useRef, useState } from "react";

import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Text,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { onboardingSlides } from "@/constants/onboarding";
import OnboardingBackground, {
  EcosystemCore,
  InfoScreen,
} from "@/components/onboarding/OnboardingBackground";

const { width, height } = Dimensions.get("window");

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

        {/* 🌌 BACKGROUND + PARTICLES */}
        <OnboardingBackground />

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
          data={onboardingSlides}
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

            {onboardingSlides.map((_, index) => (

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
