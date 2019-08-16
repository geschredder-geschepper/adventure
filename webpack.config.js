const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const { resolve, join } = require('path')

const PATH = {
  SRC: resolve(__dirname, 'src'),
  DIST: resolve(__dirname, 'dist')
}

module.exports = ({ production = false } = {}) => ({
  entry: {
    main: join(PATH.SRC, 'index.js')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
      chunkFilename: '[id].[hash:8].css'
    }),
    new HtmlWebpackPlugin({
      template: join(PATH.SRC, 'index.html'),
      minify: {
        removeComments: production,
        collapseWhitespace: production
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'standard-loader'
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.(c|sc|sa)ss$/,
      use: [
        production ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }, {
      test: /\.(png|jpe?g|gif|svg|ttf|eot|woff2?)$/,
      loader: 'url-loader',
      options: {
        fallback: 'file-loader'
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }, {
      test: /\.xml$/,
      use: 'raw-loader'
    }]
  },
  mode: production ? 'production' : 'development',
  devtool: production ? false : 'inline-source-map',
  devServer: {
    contentBase: PATH.DIST
  },
  output: {
    filename: production ? '[name].[hash:8].bundle.js' : '[name].bundle.js',
    path: PATH.DIST,
    publicPath: '/'
  }
})
