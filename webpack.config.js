const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    profile: [
      'webpack-hot-middleware/client?reload=true',
      './src/js/profile.js'
    ],
    login: [
      'webpack-hot-middleware/client?reload=true',
      './src/js/login.js'
    ],
    register: [
      'webpack-hot-middleware/client?reload=true',
      './src/js/register.js'
    ],
    style: [
      'webpack-hot-middleware/client?reload=true',
      './src/scss/style.scss'
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    open: true, // Automatically opens the browser
    hot: true, // Enable HMR
    historyApiFallback: {
      rewrites: [
        { from: /^\/register/, to: '/register.html' },
        { from: /^\/login/, to: '/login.html' },
        { from: /^\/profile/, to: '/profile.html' },
        { from: /^\/$/, to: '/index.html' } // Optional: serve index.html for root path
      ],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['profile', 'login', 'register', 'style'],
    }),
    new HtmlWebpackPlugin({
      title: 'Register',
      template: './src/register.html',
      filename: 'register.html',
      chunks: ['register', 'style'],
    }),
    new HtmlWebpackPlugin({
      title: 'Login',
      template: './src/login.html',
      filename: 'login.html',
      chunks: ['login', 'style'],
    }),
    new HtmlWebpackPlugin({
      title: 'Profile',
      template: './src/profile.html',
      filename: 'profile.html',
      chunks: ['profile', 'style'],
    }),
    new HtmlWebpackPlugin({
      title: 'Dashboard',
      template: './src/dashboard.html',
      filename: 'dashboard.html',
      chunks: ['dashboard', 'style'],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
};
