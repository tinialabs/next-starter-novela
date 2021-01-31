const { withPlugins } = require('next-compose-plugins');

module.exports = withPlugins(
  [
    require('next-svg-inline-loader'),
    require('next-favicon-loader'),
    require('next-image-meta-loader'),
  ],
  {
    webpack: (config) => {
      /** place custom webpack configuration here */
      return config
    }
  }
)
