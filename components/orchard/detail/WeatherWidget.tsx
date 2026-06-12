import React from "react";

import { View, Text, TouchableOpacity, ScrollView, ImageBackground, useColorScheme } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle, Text as SvgText, Defs, LinearGradient, Stop, G } from "react-native-svg";

import { Fonts } from "@/theme/fonts";
import { Colors } from "@/theme/colors";
import type { DailyForecast, HourlyForecast } from "@/types/weather";

type Point = { x: number; y: number; prob: number; vol: string; label: string };

/**
 * The high-fidelity weather widget on orchard-detail (Home tab).
 *
 * All data + chart coordinate math is computed in the screen and passed in as
 * props, so this component is purely presentational — the SVG paths/points are
 * NOT re-derived here (avoids any risk of changing the chart). Markup copied
 * verbatim; inline Montserrat strings swapped for Fonts tokens.
 */
export default function WeatherWidget({
  weatherSubTab,
  setWeatherSubTab,
  expandedDays,
  setExpandedDays,
  resolvedCity,
  activeForecast,
  visibleDays,
  activeHourlyList,
  points,
  fillPathD,
  linePathD,
  svgWidth,
  svgHeight,
}: {
  weatherSubTab: "today" | "tomorrow" | "nextWeek";
  setWeatherSubTab: (t: "today" | "tomorrow" | "nextWeek") => void;
  expandedDays: boolean;
  setExpandedDays: React.Dispatch<React.SetStateAction<boolean>>;
  resolvedCity: string;
  activeForecast: DailyForecast | undefined;
  visibleDays: DailyForecast[];
  activeHourlyList: HourlyForecast[];
  points: Point[];
  fillPathD: string;
  linePathD: string;
  svgWidth: number;
  svgHeight: number;
}) {
  const isDark = useColorScheme() === "dark";
  const activeTabColor = isDark ? Colors.brandGreenDark : Colors.brandGreen;

  return (
    /* ─── NEW HIGH-FIDELITY WEATHER WIDGET SECTION (Matches Photo exactly) ─── */
    <View className="mt-2">

                  {/* WEATHER SUB-TABS: Today, Tomorrow, Next 16 Days (Matches Next 16 Days exactly) */}
                  <View className="flex-row items-center justify-between px-2 mb-3 mt-1">
                    <TouchableOpacity
                      onPress={() => setWeatherSubTab("today")}
                      className="px-4 py-1.5 rounded-full"
                      style={{
                        backgroundColor: weatherSubTab === "today" ? activeTabColor : "transparent",
                      }}
                    >
                      <Text
                        style={{ fontFamily: Fonts.bold, fontSize: 11 }}
                        className={
                          weatherSubTab === "today"
                            ? "text-white font-bold"
                            : isDark
                            ? "text-gray-300 font-semibold"
                            : "text-brand-text/80 font-semibold"
                        }
                      >
                        Today
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setWeatherSubTab("tomorrow")}
                      className="px-4 py-1.5 rounded-full"
                      style={{
                        backgroundColor: weatherSubTab === "tomorrow" ? activeTabColor : "transparent",
                      }}
                    >
                      <Text
                        style={{ fontFamily: Fonts.bold, fontSize: 11 }}
                        className={
                          weatherSubTab === "tomorrow"
                            ? "text-white font-bold"
                            : isDark
                            ? "text-gray-300 font-semibold"
                            : "text-brand-text/80 font-semibold"
                        }
                      >
                        Tomorrow
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setWeatherSubTab("nextWeek")}
                      className="px-4 py-1.5 rounded-full"
                      style={{
                        backgroundColor: weatherSubTab === "nextWeek" ? activeTabColor : "transparent",
                      }}
                    >
                      <Text
                        style={{ fontFamily: Fonts.bold, fontSize: 11 }}
                        className={
                          weatherSubTab === "nextWeek"
                            ? "text-white font-bold"
                            : isDark
                            ? "text-gray-300 font-semibold"
                            : "text-brand-text/80 font-semibold"
                        }
                      >
                        Next 16 Days
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* MAIN WEATHER CARD - uses the same existing dashboard/orchard gradient asset */}
                  <View className="bg-brand-green dark:bg-brand-green-dark rounded-[28px] overflow-hidden border border-edge-green-soft dark:border-slate-800 shadow-md relative">
                    <ImageBackground
                      source={require("../../../assets/images/orchard-gradient-bg.png")}
                      resizeMode="cover"
                      className="w-full"
                    >
                      {/* Subtle overlay keeps white weather text readable on the shared gradient */}
                      <View className="bg-black/10 p-5 relative">

                      {/* CARD CONTENT HEADER */}
                      <View className="items-center">
                        <View className="flex-row items-center justify-center">
                          <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.85)" />
                          <Text
                            style={{ fontFamily: Fonts.semibold }}
                            className="text-white text-[14px] ml-1.5 font-semibold tracking-wide"
                          >
                            {resolvedCity}
                          </Text>
                        </View>
                        <Text
                          style={{ fontFamily: Fonts.bold }}
                          className="text-white text-[23px] font-bold mt-1"
                        >
                          {weatherSubTab === "today"
                            ? "Today's Weather"
                            : weatherSubTab === "tomorrow"
                            ? "Tomorrow's Weather"
                            : "16-Day Forecast"}
                        </Text>
                        <Text
                          style={{ fontFamily: Fonts.medium }}
                          className="text-white/80 text-[10px] mt-0.5"
                        >
                          {weatherSubTab === "today"
                            ? new Date().toLocaleDateString([], {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })
                            : weatherSubTab === "tomorrow"
                            ? new Date(Date.now() + 86400000).toLocaleDateString([], {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })
                            : "Next 16 Days Overview"}
                        </Text>
                      </View>

                      {/* CONDITIONAL RENDER BY WEATHER SUB-TAB */}
                      {weatherSubTab !== "nextWeek" ? (
                        <>
                          {/* CURRENT TEMP / ICON BLOCK */}
                          <View className="flex-row items-center justify-center mt-5 mb-3">
                            <View className="items-center mr-6">
                              <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center shadow-inner">
                                <Ionicons
                                  name={
                                    activeForecast?.icon === "sunny" ? "sunny" :
                                    activeForecast?.icon === "rainy" ? "rainy" :
                                    activeForecast?.icon === "thunderstorm" ? "thunderstorm" :
                                    activeForecast?.icon === "cloudy" ? "cloudy" : "partly-sunny"
                                  }
                                  size={30}
                                  color="white"
                                />
                              </View>
                              <Text
                                style={{ fontFamily: Fonts.semibold }}
                                className="text-white text-[11px] mt-1 uppercase tracking-wider"
                              >
                                {activeForecast?.desc || "Clouds"}
                              </Text>
                            </View>
                            <Text
                              style={{ fontFamily: Fonts.bold, fontSize: 44, lineHeight: 50 }}
                              className="text-white font-extrabold"
                            >
                              {activeForecast?.maxTemp || "30.3"}°C
                            </Text>
                          </View>

                          {/* METRICS GRID (3 columns x 2 rows, matching photo layout) */}
                          <View className="mt-3.5 mb-2.5">
                            {/* Row 1 */}
                            <View className="flex-row justify-between mb-2">
                              {/* Feels Like */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="thermometer-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: Fonts.medium }} className="text-white/70 text-[8px] uppercase tracking-wider">Feels Like</Text>
                                  <Text style={{ fontFamily: Fonts.bold }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.feelsLike || "30.3°C"}</Text>
                                </View>
                              </View>
                              {/* Humidity */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="water-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: Fonts.medium }} className="text-white/70 text-[8px] uppercase tracking-wider">Humidity</Text>
                                  <Text style={{ fontFamily: Fonts.bold }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.humidity || "68"}%</Text>
                                </View>
                              </View>
                              {/* Clouds */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="cloud-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: Fonts.medium }} className="text-white/70 text-[8px] uppercase tracking-wider">Clouds</Text>
                                  <Text style={{ fontFamily: Fonts.bold }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.clouds || "13"}%</Text>
                                </View>
                              </View>
                            </View>
                            {/* Row 2 */}
                            <View className="flex-row justify-between">
                              {/* Dew Point */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="snow-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: Fonts.medium }} className="text-white/70 text-[8px] uppercase tracking-wider">Dew Point</Text>
                                  <Text style={{ fontFamily: Fonts.bold }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.dewPoint || "20.47°"}</Text>
                                </View>
                              </View>
                              {/* Wind */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="flag-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: Fonts.medium }} className="text-white/70 text-[8px] uppercase tracking-wider">Wind</Text>
                                  <Text style={{ fontFamily: Fonts.bold }} className="text-white text-[11px] font-bold mt-0.5">{activeForecast?.wind || "1.93KM/Hr"}</Text>
                                </View>
                              </View>
                              {/* Air Pressure */}
                              <View className="flex-row items-center flex-1 py-1 px-1">
                                <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mr-2">
                                  <Ionicons name="speedometer-outline" size={14} color="white" />
                                </View>
                                <View>
                                  <Text style={{ fontFamily: Fonts.medium }} className="text-white/70 text-[8px] uppercase tracking-wider">Pressure</Text>
                                  <Text style={{ fontFamily: Fonts.bold }} className="text-white text-[11px] font-bold mt-0.5">1012 hPa</Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          {/* --- SCROLLABLE HOURLY TIMELINE --- */}
                          <View className="border-t border-white/20 pt-3 mt-1.5">
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ paddingRight: 10, gap: 16 }}
                            >
                              {activeHourlyList.map((h, i) => (
                                <View key={i} className="items-center px-2">
                                  <Text style={{ fontFamily: Fonts.medium, fontSize: 9 }} className="text-white/60">{h.time}</Text>
                                  <View className="my-1.5">
                                    <Ionicons
                                      name={
                                        h.icon === "sunny" ? "sunny" :
                                        h.icon === "rainy" ? "rainy" :
                                        h.icon === "thunderstorm" ? "thunderstorm" :
                                        h.icon === "cloudy" ? "cloudy" : "partly-sunny"
                                      }
                                      size={15}
                                      color="white"
                                      style={{ opacity: 0.9 }}
                                    />
                                  </View>
                                  <Text style={{ fontFamily: Fonts.bold, fontSize: 11 }} className="text-white font-bold">{Math.round(h.temp)}°C</Text>
                                </View>
                              ))}
                            </ScrollView>
                          </View>

                          {/* COHESIVE GRAPH SECTION: Scrollable Rain Intelligence line graph inside card (HOURLY BASED) */}
                          <View className="border-t border-white/20 pt-3 mt-3">
                            <Text
                              style={{ fontFamily: Fonts.bold, fontSize: 9, letterSpacing: 0.8 }}
                              className="text-white/80 uppercase mb-2"
                            >
                             Rain Probability Intelligence
                            </Text>

                            {/* --- FIXED Y-AXIS OVERLAY + SCROLLABLE GRAPH CONTAINER --- */}
                            <View className="flex-row items-center mt-1">
                              {/* Fixed Stationary Y-Axis Panel (Always visible on the left) */}
                              <View style={{ width: 35 }}>
                                <Svg height={svgHeight} width={35}>
                                  <SvgText x="28" y="18" fontSize="8" fontWeight="bold" fill="rgba(255,255,255,0.65)" textAnchor="end">100%</SvgText>
                                  <SvgText x="28" y="53" fontSize="8" fontWeight="bold" fill="rgba(255,255,255,0.65)" textAnchor="end">0%</SvgText>
                                  {/* Vertical separator line between axis and scrolling curve */}
                                  <Path d="M 34 10 L 34 75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                </Svg>
                              </View>
                              {/* Horizontally Scrollable Plot Area */}
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingRight: 10 }}
                                className="flex-1"
                              >
                                <View className="items-center justify-center">
                                  <Svg height={svgHeight} width={svgWidth} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                                    <Defs>
                                      <LinearGradient id="cardRainGrad" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor="white" stopOpacity="0.35" />
                                        <Stop offset="100%" stopColor="white" stopOpacity="0.0" />
                                      </LinearGradient>
                                    </Defs>
                                    <Path d={`M 18 50 L ${svgWidth - 18} 50`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
                                    <Path d={fillPathD} fill="url(#cardRainGrad)" />
                                    <Path
                                      d={linePathD}
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    {/* Render hourly dots, probability values, and time stamps directly inside the SVG */}
                                    {points.map((p, idx) => {
                                      // Split "12:30 AM" into "12:30" (Time) and "AM" (Descriptor) to draw them stacked in two lines
                                      const timeParts = p.label.split(" ");
                                      const timeOnly = timeParts[0] || "";
                                      const ampmOnly = timeParts[1] || "";
                                      return (
                                        <G key={idx}>
                                          <Circle cx={p.x} cy={p.y} r="3" fill="white" stroke={Colors.brandGreenDark} strokeWidth="1.5" />
                                          <SvgText
                                            x={p.x}
                                            y={p.y - 6}
                                            fontSize="7.5"
                                            fontWeight="bold"
                                            fill="white"
                                            textAnchor="middle"
                                          >
                                            {p.prob}%
                                          </SvgText>
                                          {/* Line 1: TIME (e.g. "12:30") */}
                                          <SvgText
                                            x={p.x}
                                            y="64"
                                            fontSize="8"
                                            fontWeight="700"
                                            fill="rgba(255, 255, 255, 0.9)"
                                            textAnchor="middle"
                                          >
                                            {timeOnly}
                                          </SvgText>
                                          {/* Line 2: AM / PM (e.g. "AM") */}
                                          <SvgText
                                            x={p.x}
                                            y="74"
                                            fontSize="7"
                                            fontWeight="600"
                                            fill="rgba(255, 255, 255, 0.6)"
                                            textAnchor="middle"
                                          >
                                            {ampmOnly}
                                          </SvgText>
                                        </G>
                                      );
                                    })}
                                  </Svg>
                                </View>
                              </ScrollView>
                            </View>
                          </View>
                        </>
                      ) : (
                        /* --- "NEXT WEEK" TAB --- */
                        <View className="mt-4">
                          <View className="divide-y divide-white/10">
                            {visibleDays.map((item, idx) => (
                              <View key={idx} className="flex-row items-center justify-between py-2.5">
                                <View className="flex-1">
                                  <Text
                                    style={{ fontFamily: Fonts.bold, fontSize: 12 }}
                                    className="text-white"
                                  >
                                    {item.day}
                                  </Text>
                                  <Text
                                    style={{ fontFamily: Fonts.medium, fontSize: 10 }}
                                    className="text-white/60 mt-0.5"
                                  >
                                    {item.desc}
                                  </Text>
                                </View>
                                {/* Prob Segmented Mini Bar (Unified style inside card!) */}
                                <View className="w-24 flex-row items-center justify-center mr-3">
                                  <Ionicons name="rainy" size={12} color="white" />
                                  <View className="flex-row ml-1.5 flex-1 items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <View
                                        key={i}
                                        className="flex-1 mx-[0.5px] h-1 rounded-full bg-white/10 overflow-hidden"
                                      >
                                        <View
                                          className={`h-full ${
                                            i < Math.ceil(item.rainProb / 20)
                                              ? "bg-white"
                                              : "bg-transparent"
                                          }`}
                                        />
                                      </View>
                                    ))}
                                  </View>
                                  <Text className="text-[8px] font-bold text-white ml-1">
                                    {item.rainProb}%
                                  </Text>
                                </View>
                                <View className="flex-row items-center justify-end w-16">
                                  <Ionicons
                                    name={
                                      item.icon === "sunny" ? "sunny" :
                                      item.icon === "rainy" ? "rainy" :
                                      item.icon === "thunderstorm" ? "thunderstorm" :
                                      item.icon === "cloudy" ? "cloudy" : "partly-sunny"
                                    }
                                    size={15}
                                    color="white"
                                    style={{ marginRight: 6 }}
                                  />
                                  <View className="items-end">
                                    <Text className="text-xs font-bold text-white">
                                      {item.maxTemp}°
                                    </Text>
                                    <Text className="text-[9px] text-white/60">
                                      {item.minTemp}°
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            ))}
                          </View>
                          <TouchableOpacity
                            onPress={() => setExpandedDays(!expandedDays)}
                            className="border-t border-white/10 pt-3 mt-1 items-center justify-center flex-row"
                          >
                            <Text
                              style={{ fontFamily: Fonts.semibold, fontSize: 11 }}
                              className="text-white font-bold"
                            >
                              {expandedDays ? "Show Less Days" : "Show All 16 Days"}
                            </Text>
                            <Ionicons
                              name={expandedDays ? "chevron-up" : "chevron-down"}
                              size={14}
                              color="white"
                              style={{ marginLeft: 4 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      </View>
                    </ImageBackground>
                  </View>
                </View>

  );
}
