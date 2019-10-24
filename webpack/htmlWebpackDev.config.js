const plugin = (config) => {
    const { devServerPort } = config;
    const HtmlWebpackPlugin = require("html-webpack-plugin");

    const data = {
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
    }

    return new HtmlWebpackPlugin(data);
}

module.exports = plugin;