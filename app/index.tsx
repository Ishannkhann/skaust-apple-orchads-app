import React, {
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useRouter,
} from "expo-router";

const { width } = Dimensions.get("window");

const SLIDE_WIDTH = width * 0.88;

const slides = [
  {
    id: "1",
    title: "Welcome to <APP NAME>",
    description:
      "A smart platform designed to simplify your agricultural operations and productivity.",
  },
  {
    id: "2",
    title: "<APP NAME>",
    textBlock1:
      "Built to modernize agricultural workflows with smart digital tools and seamless farm management.",

    textBlock2:
      "Powered through the collaboration of SKUAST and HADP to support innovation-driven farming ecosystems.",
  },
  {
    id: "3",
    appName: "<APP NAME>",
    title: "Grow Better Every Season",

    description:
      "Empowering farmers with technology-driven insights and smarter workflows.",

    image: require("../assets/skaust-logo.png"),
  },
];

export default function Onboarding() {
  const router = useRouter();

  const flatListRef =
    useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] =
    useState<number>(0);

  const onViewableItemsChanged =
    useRef(
      ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
          setCurrentIndex(
            viewableItems[0].index
          );
        }
      }
    ).current;

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
  }: {
    item: any;
    index: number;
  }) => {
    const isFirst = index === 0;
    const isSecond = index === 1;

    const isLast =
      index === slides.length - 1;

    return (
      <View
        style={{
          width: isLast
            ? width
            : SLIDE_WIDTH,
        }}
        className="px-4"
      >
        <View className="flex-1">

          {/* FIRST */}
          {isFirst ? (
            <>
              <View className="items-center mt-14">
                <Text className="text-4xl font-bold text-center text-green-950">
                  {item.title}
                </Text>

                <Text className="text-center mt-5 text-base leading-7 px-2 text-green-700">
                  {item.description}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center">

                <View className="w-44 h-44 items-center justify-center">
                  <Image
                    source={require("../assets/skaust-logo.png")}
                    className="w-32 h-32"
                    resizeMode="contain"
                  />
                </View>

                <View className="h-8" />

                <View className="w-44 h-44 items-center justify-center">
                  <Image
                    source={require("../assets/hadp-logo.png")}
                    className="w-32 h-32"
                    resizeMode="contain"
                  />
                </View>

              </View>
            </>
          ) : isSecond ? (
            <>
              <View className="items-center mt-14">
                <Text className="text-4xl font-bold text-center text-green-950">
                  {item.title}
                </Text>
              </View>

              <View className="mt-14">

                <View className="rounded-3xl p-5 border bg-white border-green-100">
                  <Text className="text-base leading-7 text-center text-green-700">
                    {item.textBlock1}
                  </Text>
                </View>

                <View className="rounded-3xl p-5 border mt-5 bg-white border-green-100">
                  <Text className="text-base leading-7 text-center text-green-700">
                    {item.textBlock2}
                  </Text>
                </View>

              </View>

              <View className="flex-1 flex-row items-center justify-center gap-6">

                <View className="w-36 h-36 items-center justify-center">
                  <Image
                    source={require("../assets/skaust-logo.png")}
                    className="w-24 h-24"
                    resizeMode="contain"
                  />
                </View>

                <View className="w-36 h-36 items-center justify-center">
                  <Image
                    source={require("../assets/hadp-logo.png")}
                    className="w-24 h-24"
                    resizeMode="contain"
                  />
                </View>

              </View>
            </>
          ) : (
            <>
              <View className="items-center mt-14">
                <Text className="text-4xl font-bold text-center text-green-950">
                  {item.appName}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center">

                <View className="w-56 h-56 items-center justify-center">
                  <Image
                    source={item.image}
                    className="w-32 h-32"
                    resizeMode="contain"
                  />
                </View>

                <Text className="text-2xl font-semibold text-center mt-6 text-green-950">
                  {item.title}
                </Text>

                <Text className="text-center mt-5 text-base leading-7 px-3 text-green-700">
                  {item.description}
                </Text>

              </View>
            </>
          )}

        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-lime-50">

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled={false}
        snapToInterval={SLIDE_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={
          onViewableItemsChanged
        }
        viewabilityConfig={
          viewConfigRef.current
        }
        contentContainerStyle={{
          paddingRight: 50,
        }}
      />

      {/* DOTS */}
      <View className="flex-row justify-center mb-7">
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              goToSlide(index)
            }
            activeOpacity={0.7}
          >
            <View
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex
                  ? "bg-green-700 w-5"
                  : "bg-gray-300 w-2"
              }`}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* BUTTON */}
      <View className="px-6 pb-10">
        <TouchableOpacity
          onPress={goToDashboard}
          activeOpacity={0.85}
          className="bg-green-700 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold text-base">
            Continue to Dashboard
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
