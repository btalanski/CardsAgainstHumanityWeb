const plugin = (config) => {
    const { host } = config;
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    
    const data = {
        inject: false,
        template: require('html-webpack-template'),
        appMountId: 'app',
        appMountHtmlSnippet: '<div class="app-spinner"><i class="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div>',
        headHtmlSnippet: '<style>div.app-spinner {position: fixed;top:50%;left:50%;}</style >',
        baseHref: host,
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