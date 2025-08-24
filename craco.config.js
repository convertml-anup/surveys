const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: 'surveys',
          filename: 'remoteEntry.js',
          exposes: {
            './SurveysApp': './src/bootstrap',
          },
          shared: {
            react: { singleton: true },
            'react-dom': { singleton: true },
          },
        }),
      ],
    },
  },
  devServer: {
    port: 3001,
  },
};