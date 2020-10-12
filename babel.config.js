module.exports = {
    plugins: [
      ["@babel/plugin-transform-runtime", {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": false,
        "useESModules": true,
        "version": "7.0.0-beta.0"
      }]
    ],
  };
  