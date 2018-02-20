const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const path = require("path");
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'; //true or false
const cssDev = [
	'style-loader',
	'css-loader?sourceMap',
	'sass-loader',
	{
		loader: 'sass-resources-loader',
		options: {
			resources: [
				 './src/resources.scss',
      ],
		},
	}];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader','sass-loader', {
		loader: 'sass-resources-loader',
		options: {
			// Provide path to the file with resources
			resources: [
				'./src/resources.scss'
			],
		},
	}],
    publicPath: './'
})
const cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    entry: {
					index: './src/index.js',
					//second : './src/second.js'
		},
    output: {
			path: path.resolve(__dirname, "dist"),
			filename: '[name].bundle.js'
    },
		devtool: isProd ? 'none' : 'eval-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                  'file-loader?name=images/[name].[ext]',
                  'image-webpack-loader?bypassOnDebug'
                ]
            },
            { test: /\.(woff2?)$/, use: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
            { test: /\.(ttf|eot)$/, use: 'file-loader?name=fonts/[name].[ext]' },
						{ test: /\.(mp4|ico)$/, use: 'file-loader?name=images/[name].[ext]' }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "src"),
        compress: true,
        hot: true,
        open: true,
				inline: true,
        stats: 'errors-only',
				openPage: ''
    },
    plugins: [
				// new HtmlWebpackPlugin({
				// 		title: '',
				// 		hash: true,
				// 		chunks: ['', ''],
				// 		filename: 'second.html',
				// 		template: './src/second.html'
				// }),
        new HtmlWebpackPlugin({
            title: 'INDEX',
            hash: true,
						excludeChunks: ["", ""],
						template: './src/index.html',
						favicon: 'src/images/favicon.ico',
						environment: {prod: process.env.NODE_ENV === 'production'}
        }),
        new ExtractTextPlugin({
            filename: './[name].css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // Make sure this is after ExtractTextPlugin!
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
						purifyOptions: {
							whitelist: ['.messageButton']
						},
						minimize: isProd
        })
    ]
}
