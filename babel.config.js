module.exports = function (api) {
  api.cache.invalidate(() => process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
