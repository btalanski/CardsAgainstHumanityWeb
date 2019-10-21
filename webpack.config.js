const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const commonConfig = merge([
    {
        entry: './src/index.js',
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            alias: {},
            extensions: [],
            modules: []
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    modules: false,
                                    "targets": {
                                        "ie": "11"
                                    }
                                }],
                            ],
                            "plugins": [
                                ["@babel/plugin-transform-react-jsx", {
                                    "pragma": "h"
                                }],
                                ['@babel/plugin-proposal-class-properties'],
                                ["@babel/plugin-syntax-dynamic-import"]
                            ],
                        }
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                sourceMap: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: function (loader) {
                                    return [
                                        require('precss')(),
                                        require('autoprefixer')(),
                                        require("postcss-discard-comments")({
                                            removeAll: true
                                        }),
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                    ],
                },
            ],
        },
        plugins: [
            new ManifestPlugin(),
            new CleanWebpackPlugin(),
        ],
    }
]);

module.exports = mode => {
    if (mode === "production") {
        return merge(commonConfig, { mode });
    }
    return merge(commonConfig, { mode });
};