const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  cache: true,
  entry: [
    require.resolve('./polyfills'),
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
        test: /\.js/,
        loader: require.resolve('babel-loader'),
        options: {cacheDirectory: true}
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract('css-loader'),
      }, {
        test: /\.json$/,
        loader: require.resolve('json-loader')
      }, {
        test: /\.(png|jpg)$/,
        loader: require.resolve('file-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'dist/app.css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: '"development"'}
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  ]
};
