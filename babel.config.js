module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": ["./src", "./"]
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      ],
      // 'react-native-reanimated/plugin' removed — app uses plain RN Animated
    ],
  };
};
