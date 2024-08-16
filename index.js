// index.js
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config.js'); // Ensure this path is correct

const app = express();
const compiler = webpack(webpackConfig);

// Serve Webpack bundles and enable HMR
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.use(webpackHotMiddleware(compiler));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Handle other routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'profile.html'));
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
