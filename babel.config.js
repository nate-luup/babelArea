module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: "> 0.25%, not dead",
        // useBuiltIns: "usage",
        corejs: 3,
        // modules: false,
        debug: true
      }
    ],
    ["@babel/preset-react"]
  ];
  const plugins = [["@babel/plugin-transform-runtime", { corejs: 3 }]];

  return {
    sourceMaps: 'inline',
    presets,
    plugins
  };
};
