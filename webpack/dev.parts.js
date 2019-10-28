const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = (config) => {
    const { devServerPort } = config;
    return merge([{
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: require('html-webpack-template'),
                baseHref: `http://localhost:${devServerPort}`,
                devServer: `http://localhost:${devServerPort}`,
                meta: [],
                mobile: true,
                lang: 'pt-BR',
                links: [],
                inlineManifestWebpackName: 'webpackManifest',
                scripts: [],
                title: 'Cards Against Humanity App',
                window: {
                    socketServer: "http://localhost:8080"
                }
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            // Display only errors to reduce the amount of output.
            stats: "errors-only",
            // Parse host and port from env to allow customization.
            //
            // If you use Docker, Vagrant or Cloud9, set
            // host: "0.0.0.0";
            //
            // 0.0.0.0 is available to all network devices
            // unlike default `localhost`.
            host: config.host, // Defaults to `localhost`
            port: config.devServerPort,
            open: true, // Open the page in browser,
            historyApiFallback: true, // If you are using HTML5 History API based routing
        },
        devtool: "inline-source-map",
    }]);
}

module.exports = devConfig;