const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/lambda.js',
  target: 'node',
  externalsPresets: { node: true },
  output: {
    filename: 'lambda.js',
    path: path.resolve(__dirname, '.webpack'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
};