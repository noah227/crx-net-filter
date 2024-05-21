/**
 * Vue page entries
 * @typedef {("options"|"popup"|string)[]} TPageEntryDirs
 */

/**
 * Primarily for static files copy (e.g. _locales)
 * @typedef {[from: string, to: string][]} TCopyItems
 */

/**
 * External entry processes (configureWebpack.entry)
 * @typedef {{[index: string]: string}} TWebpackEntry
 */

/**
 * @type {{pageEntryDirs: TPageEntryDirs, copyItems: TCopyItems, webpackEntry: TWebpackEntry}}
 */
module.exports = {
    pageEntryDirs: ["options", "popup"],
    copyItems: [
        ["./src/assets", "assets"],
        ["./src/_locales", "_locales"]
    ],
    webpackEntry: {
        service_worker: "./src/background/service-worker.ts",
        content: "./src/content/index.ts",
    }
}
