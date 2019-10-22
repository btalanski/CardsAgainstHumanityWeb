const plugin = (config) => {
    const { devServerPort } = config;
    const HtmlWebpackPlugin = require("html-webpack-plugin");

    const data = {
        inject: false,
        template: require('html-webpack-template'),
        appMountId: 'app',
        baseHref: `http://localhost:${devServerPort}`,
        devServer: `http://localhost:${devServerPort}`,
        meta: [],
        mobile: true,
        lang: 'pt-BR',
        links: [],
        inlineManifestWebpackName: 'webpackManifest',
        scripts: [],
        title: 'Cards Against Humanity App',
        // window: {}
    }

    return new HtmlWebpackPlugin(data);
}

module.exports = plugin;