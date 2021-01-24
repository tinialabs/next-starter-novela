const { withPlugins } = require('next-compose-plugins');

module.exports = withPlugins(
  [
    require('next-favicon-loader'),
    require('next-image-meta-loader'),
  ],
  {
    webpack: (config, { defaultLoaders }) => {
      defaultLoaders.babel.options.plugins = [
        require.resolve('@emotion/babel-plugin')
      ]

      return config
    }
  }
)
