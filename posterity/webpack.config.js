const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.js',
  // entry: {
  //   app: './src/app.js',
  //   sw: './src/sw.js',
  // },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Disable this for production.
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // Copies index.html from src to dist and adds a references to bundle.js
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: false,
    }),
  ],
};
