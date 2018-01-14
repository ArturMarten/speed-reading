const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './src/index.js',
    './styles/app.css'
  ],
  output: {
    filename: 'dist/bundle.js',
    path: path.join(__dirname, '/'),
  },
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
      }, {
        test: /\.(png|jpg)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'dist/app.css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: '"production"'}
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      warnings: false,
    }),
    new MinifyPlugin()
  ]
};
