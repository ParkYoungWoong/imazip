module.exports = {
  mode: "production",
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    libraryExport: 'default',
    libraryTarget: 'umd',
    filename: 'imazip.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};