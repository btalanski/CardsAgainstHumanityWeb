const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const prodConfig = (config) => {
    
    return merge([{
        output: {
            filename: 'app.js',
            path: path.resolve(appRoot, 'dist'),
            publicPath: "dist/"
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                appMountId: 'app',
                template: require('html-webpack-template'),
                meta: [],
                mobile: true,
                lang: 'pt-BR',
                links: [],
                inlineManifestWebpackName: 'webpackManifest',
                scripts: [],
                title: 'Cards Against Humanity App',
            })
        ],
        optimization: {
            sideEffects: true,
            minimize: true,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                        reuseExistingChunk: true,
                        minChunks: 2
                    },
                }
            },
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: undefined,
                        warnings: false,
                        parse: {},
                        compress: {
                            drop_console: true
                        },
                        mangle: true,
                        module: false,
                        output: null,
                        toplevel: false,
                        nameCache: null,
                        ie8: false,
                        keep_classnames: undefined,
                        keep_fnames: false,
                        safari10: false,
                        extractComments: true,
                    },
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {
                        safe: true,
                        discardComments: {
                            removeAll: true
                        }
                    },
                    canPrint: true,
                    cssProcessorPluginOptions: {
                        preset: ['default', {
                            discardComments: {
                                removeAll: true
                            }
                        }],
                    },
                })
            ]
        }
    }]);
}

module.exports = prodConfig;