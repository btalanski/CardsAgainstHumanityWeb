const plugin = (config) => {
    const { host } = config;
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    
    const data = {
        inject: false,
        appMountId: 'app',
        template: require('html-webpack-template'),
        baseHref: host,
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