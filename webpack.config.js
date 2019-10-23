const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('config');


const commonPluginsConfig = merge([{
    plugins: [
        new ManifestPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'app.css'
        }),
    ],
}]);

const commonConfig = merge([{
    entry: './src/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "dist"
    },
    resolve: {
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
        },
        // extensions: [],
        // modules: ["src", "node_modules"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [],
                        plugins: [
                            ["@babel/plugin-transform-react-jsx", { "pragma": "h" }],
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
    }
}]);

const prodConfig = (config) => {
    return merge([{
        plugins: [
            require('./webpack/htmlWebpack.config.js')(config),
        ]
    }]);
};

const devConfig = (config) => {
    return merge([{
        plugins: [
            require('./webpack/htmlWebpackDev.config.js')(config),
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
            host: process.env.HOST, // Defaults to `localhost`
            port: config.devServerPort,
            open: true, // Open the page in browser,
            historyApiFallback: true, // If you are using HTML5 History API based routing
        },
    }]);
}

module.exports = mode => {
    const defaults = {
        mode,
        devServerPort: config.get("devServerPort"),
        host: "http://localhost:8080",
    };

    if (mode === "production") {
        return merge(
            commonConfig,
            commonPluginsConfig,
            prodConfig(defaults),
            { mode }
        );
    }
    
    return merge(
        commonConfig,
        commonPluginsConfig,
        devConfig(defaults),
        { mode }
    );
};