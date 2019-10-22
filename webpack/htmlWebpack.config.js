const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = new HtmlWebpackPlugin(
    {
        inject: false,
        template: require('html-webpack-template'),
        appMountId: 'app',
        appMountHtmlSnippet: '<div class="app-spinner"><i class="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div>',
        headHtmlSnippet: '<style>div.app-spinner {position: fixed;top:50%;left:50%;}</style >',
        baseHref: 'http://localhost:3001',
        devServer: 'http://localhost:3001',
        meta: [],
        mobile: true,
        lang: 'pt-BR',
        links: [],
        inlineManifestWebpackName: 'webpackManifest',
        scripts: [],
        title: 'Cards Against Humanity App',
        // window: {}
    }
);

module.exports = config;