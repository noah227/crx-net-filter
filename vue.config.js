const {defineConfig} = require('@vue/cli-service')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const path = require("path")
const {pageEntryDirs, copyItems, webpackEntry} = require("./vxt.config")

/** 所有Vue打包入口 **/
const pages = pageEntryDirs.reduce((pages, dir) => {
    pages[dir] = {
        entry: `src/${dir}/main.ts`,
        template: `src/${dir}/index.html`,
        filename: `${dir}.html`
    }
    return pages
}, {})

/** 所有copy入口 **/
const createPluginItem = (from, to, extraConfig={}) => ({
    from: path.resolve(from),
    to: path.resolve("dist", to),	// 基于dist
    ...extraConfig
})
const copyPlugins = []

/** manifest.json处理 */
const removeSchemaField = (content) => {
    const data = JSON.parse(content.toString())
    delete data.$schema
    return new Buffer.from(JSON.stringify(data, null, 4), "utf8")
}
switch (process.env.NODE_ENV) {
    case "development":
        copyPlugins.push(
            createPluginItem("src/manifest.dev.json", "manifest.json", {
                transform(content, path) {
                    return removeSchemaField(content)
                }
            })
        )
        break
    case "production":
        copyPlugins.push(
            createPluginItem("src/manifest.prod.json", "manifest.json", {
                transform(content, path) {
                    return removeSchemaField(content)
                }
            })
        )
        break
}
copyPlugins.push(
    ...copyItems.map(item => createPluginItem(...item))
)

// process.traceDeprecation = true
module.exports = defineConfig({
    transpileDependencies: true,
    pages,
    configureWebpack: {
        devtool: false,
        entry: {...webpackEntry},
        output: {
            filename: "js/[name].js"
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: copyPlugins
            }),
            new MonacoWebpackPlugin(),
            // About Bundler Build Feature Flags, see https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
            new webpack.DefinePlugin({
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
            })
        ]
    },
    chainWebpack: config => {
        // config.plugin("copy").use(require("copy-webpack-plugin"), [copyPlugins])
    }
})
