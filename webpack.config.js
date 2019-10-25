const path = require('path');
global.appRoot = path.resolve(__dirname);

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
    resolve: {
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "babel-preset-preact"],
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

// const prodConfig = (config) => require("./webpack/prod.parts.js")(config);

const devConfig = (config) => {
    return merge([{
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'dist'),
        },
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
            host: config.host, // Defaults to `localhost`
            port: config.devServerPort,
            open: true, // Open the page in browser,
            historyApiFallback: true, // If you are using HTML5 History API based routing
        },
        devtool: "inline-source-map",
    }]);
}

module.exports = mode => {
    const defaults = {
        mode,
        devServerPort: config.get("devServerPort"),
        host: config.get("hostName"),
        protocol: config.get("protocol"),
    };

    if (mode === "production") {
        return merge(
            commonConfig,
            commonPluginsConfig,
            require("./webpack/prod.parts.js")(defaults),
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