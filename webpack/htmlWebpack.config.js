const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = new HtmlWebpackPlugin(
    {
        // Required
        inject: false,
        template: require('html-webpack-template'),
        // Optional
        appMountId: 'app',
        appMountHtmlSnippet: '<div class="app-spinner"><i class="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div>',
        headHtmlSnippet: '<style>div.app-spinner {position: fixed;top:50%;left:50%;}</style >',
        // bodyHtmlSnippet: '<custom-element></custom-element>',
        baseHref: 'http://localhost:3001',
        devServer: 'http://localhost:3001',
        // googleAnalytics: {
        //     trackingId: 'UA-XXXX-XX',
        //     pageViewOnLoad: true
        // },
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