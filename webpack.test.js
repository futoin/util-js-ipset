'use strict';

module.exports = {
    mode: 'development',
    entry: {
        unittest : './test/unittest.js',
    },
    output: {
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
                        presets: [ '@babel/preset-env' ],
                        plugins: [ "@babel/transform-object-assign" ],
                    },
                },
            },
        ],
    },
};
