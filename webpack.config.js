module.exports = {
    entry: './src/historical-dates.ts',
    mode: 'production',
    output: {
        filename: 'historical-dates.js',
        libraryTarget: 'umd'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    }
}
