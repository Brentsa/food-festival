const webpack = require("webpack")
const path = require("path");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedules: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js"
  },
  output: {
    path: path.join(__dirname + "/dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jpg$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name(file){
                return "[path][name].[ext]"
              },
              publicPath: function(url){
                return url.replace("../","/assets/")
              }
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static", //report outputs to an html file in dist
    }),
    new WebpackPwaManifest({
      name: "Food Event",
      short_name: "Foodies",
      description: "An app that allows you to view upcoming food events.",
      //homepage of the pwa, manifest file relative to the starting html file
      start_url: "../index.html",
      background_color: "#01579b",
      theme_color: "#ffffff",
      //tells webpack to not create a new manifest code in the title
      fingerprints: false,
      //tells webpack to not inject the manifest.json into the HTML, should be used with fingerprints true
      inject: false,
      icons: [{
        src: path.resolve("assets/img/icons/icon-512x512.png"),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join("assets", "icons")
      }]
    })
  ],
  mode: "development"
};