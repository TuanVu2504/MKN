const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@Backend': path.resolve(__dirname, 'src/'),
    },
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // watch: true,
  // watchOptions: {
  //   ignored: /node_modules/,
  // },
  // devServer: {
  //   headers: {
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // }s
};