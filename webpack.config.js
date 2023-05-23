const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
  ],
  devServer: {
    proxy: {
      "/": {
        target: " http://127.0.0.1:9292",
        secure: false,
        changeOrigin: true,
        autoRewrite: true,
      },
    },
    static: {
      directory: path.join(__dirname, 'src'),
    },
    watchFiles: ['src/**/*', '/layout/**/*', '/templates/**/*'],
    hot: true,
    open: true,
    port: 8080,
    liveReload: false,
    historyApiFallback: true,
  },
};
