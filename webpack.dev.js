var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/index.js',
    './styles/app.css'
  ],
  output: {
    filename: 'dist/bundle.js',
    path: path.join(__dirname, '/'),
  },
  devServer: {
    port: 8080
  },
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      { test: /\.js/, use: 'babel-loader' },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract('css-loader'),
      },
      { test: /\.json$/, use: 'json-loader' }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'dist/app.css',
      allChunks: true
    })
  ]
};
