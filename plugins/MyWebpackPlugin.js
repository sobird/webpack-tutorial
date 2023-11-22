import HtmlWebpackPlugin from "html-webpack-plugin";

const insert = (html, parent, content) => {
  const tag = `</${parent}>`;
  const tagIndex = html.indexOf(tag);

  return [html.slice(0, tagIndex), content, html.slice(tagIndex)].join("");
};

class MyWebpackPlugin {
  constructor(config = {}) {
    this.config = Object.assign(
      {
        appId: `${process.env?.APP_ID || ""}`,
        version: `${process.env?.FLOW_ID || ""}`,
        sha: `${process.env?.SHA || ""}`,
        deployTime: Date.now(),
        retryTimes: 2,
        notifyInterval: 5 * 60 * 1000,
        checkInterval: 5 * 60 * 1000,
        forceUpdateInterval: 60 * 1000,
        forceUpdate: false,
        server: "",
      },
      config
    );
    this.filter = config.filter || ((name) => name === "index.html");
    if (!this.config.appId || !this.config.template) {
      if (process.env.NODE_ENV === "production" || config.strict !== false) {
        // todo
      }
    }
  }

  addAssets(content, htmlPluginData, parent) {
    htmlPluginData.html = insert(htmlPluginData.html, parent, content);
  }

  apply(compiler) {
    // 构建完成钩子
    compiler.hooks.done.tapAsync("MyWebpackPlugin", (stats, callback) => {
      const { output } = stats.compilation.options;
      compiler.outputFileSystem.writeFile(
        `${output.path}/version.json`,
        JSON.stringify(this.config),
        callback
      );
    });
    compiler.hooks.compilation.tap("MyWebpackPlugin", (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);

      hooks.beforeEmit.tap("MyWebpackPlugin", (htmlPluginData) => {
        if (this.filter(htmlPluginData.plugin.options.filename)) {
          this.addAssets(`<link rel="stylesheet" href="./mywebpackplugin.css" />`, htmlPluginData, 'head');
          this.addAssets(
            `<script>window.config = ${JSON.stringify(this.config)}</script>`,
            htmlPluginData,
            "body"
          );
        }

        return htmlPluginData;
      });
    });
  }
}


// export const MyWebpackPlugin = MyWebpackPlugin;
export default MyWebpackPlugin;
