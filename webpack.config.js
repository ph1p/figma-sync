const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const { figmaPlugin } = require('./package.json');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  entry: {
    ui: './src/Ui.tsx',
    code: './src/main/code.ts',
  },
  watchOptions: {
    ignored: ['node_modules/**'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|webp|svg|zip|mp3)$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mp3'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, figmaPlugin.name),
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          REACT_APP_SC_ATTR: JSON.stringify('data-styled-figma-chat'),
          SC_ATTR: JSON.stringify('data-styled-figma-chat'),
          REACT_APP_SC_DISABLE_SPEEDY: JSON.stringify('false'),
        },
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
      inject: false,
      templateContent: ({ compilation, htmlWebpackPlugin }) => `
        <html>
          <body>
          <div id="app"></div>
          ${htmlWebpackPlugin.files.js.map(
            (jsFile) =>
              `<script>${compilation.assets[
                jsFile.substr(htmlWebpackPlugin.files.publicPath.length)
              ].source()}</script>`
          )}
          </body>
        </html>
      `,
    }),
    new CreateFileWebpack({
      path: path.resolve(__dirname, figmaPlugin.name),
      fileName: 'manifest.json',
      content: JSON.stringify(figmaPlugin),
    }),
  ],
});
