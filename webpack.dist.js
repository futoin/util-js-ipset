'use strict';

const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

module.exports = {
    entry: {
        'futoin-ipset': './lib/browser.js',
    },
    output: {
        library: {
            root: "futoinIpSet",
            amd: "futoin-ipset",
            commonjs: "futoin-ipset",
        },
        libraryTarget: "umd",
        filename: "[name].js",
        path: __dirname + '/dist',
    },
    node : false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ 'babel-preset-env' ],
                        plugins: [ "transform-object-assign" ],
                    },
                },
            },
        ],
    },
    plugins: [
        new UglifyJsPlugin( {
            sourceMap: true,
        } ),
    ],
};
