const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  cache: true,
  entry: [
    './src/index.js',
    './styles/app.css'
  ],
  output: {
    filename: 'dist/bundle.js',
    path: path.join(__dirname, '/'),
  },
  // devtool: 'inline-source-map',
  devtool: 'eval',
  devServer: {
    port: 8080,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js/, use: 'babel-loader'
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract('css-loader'),
      }, {
        test: /\.json$/, use: 'json-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'dist/app.css',
      allChunks: true
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  ]
};
