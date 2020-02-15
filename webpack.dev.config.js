const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        //path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js',

    },
    watch: true,
    mode: 'development',
    target: 'web',
    devtool: '#source-map',
    node: {
        fs: "empty"
    },
    module: {

        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                    failOnError: false,
                    failOnWarning: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'

            },
            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                        //options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })
            }
        ]
    },


    plugins: [

        new HtmlWebPackPlugin({
            template: "./src/html/index.html",
            filename: "index.html"
        }),
        new HtmlWebPackPlugin({
            template: "./src/html/dashboard.html",
            filename: "dashboard.html",

        }),
        new HtmlWebPackPlugin({
            template: "./src/html/login.html",
            filename: "login.html",

        }),

        new ExtractTextPlugin("styles.css"),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({ options: {} })

    ]
};