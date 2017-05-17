// TODO:
// - Move index.html to dist
// - Read babelrc
// - push dev to /.tmp
// - push prod to /dist

/* global options */
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const extractCSS = new ExtractTextPlugin('./styles/main.css');

const config = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: './index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        extractCSS,
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                },
            },
            {
                loader: 'eslint-loader',
            }],
        },
        {
            test: /\.json$/,
            loader: 'json-loader',
        },
        {
            test: /(\.css|\.scss)$/,
            loader: extractCSS.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            autoprefixer,
                        ],
                    },
                },
                {
                    loader: 'sass-loader',
                }],
            }),
        },
        {
            test: /\.(woff|woff2|ttf|eot)$/,
            loader: 'file-loader',
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'file-loader',
        },
        {
            test: /\.html$/,
            use: [{
                loader: 'file-loader?name=[path][name].[ext]',
            },
            {
                loader: 'extract-loader',
            },
            {
                loader: 'html-loader',
            }],
        }],
    },
    devServer: {
        contentBase: path.resolve(__dirname, '/.tmp'),
        open: true,
    },
    devtool: 'eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
    config.devtool = 'source-map';

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: { warnings: false },
        mangle: { except: ['exports', 'require'] },
    }));
}

module.exports = config;
