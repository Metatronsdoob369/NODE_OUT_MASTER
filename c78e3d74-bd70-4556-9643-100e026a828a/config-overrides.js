const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    url: require.resolve('url/'),
    util: require.resolve('util/'),
    querystring: require.resolve('querystring-es3'),
    path: require.resolve('path-browserify'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    zlib: require.resolve('browserify-zlib'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    vm: require.resolve('vm-browserify'),
    assert: require.resolve('assert/'),
    fs: false,
    net: false,
    tls: false,
  };
  
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];
  
  return config;
};
