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

const plugin = (config) => {
    const { devServerPort } = config;

    const data = {
        inject: false,
        template: require('html-webpack-template'),
        appMountId: 'app',
        appMountHtmlSnippet: '<div class="app-spinner"><i class="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div>',
        headHtmlSnippet: '<style>div.app-spinner {position: fixed;top:50%;left:50%;}</style >',
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

module.exports = config;