module.exports = {
    chainWebpack: config => config.resolve.symlinks(false),
    transpileDependencies: [
        "vuetify"
    ],
    css: {
        loaderOptions: {
            scss: {
            prependData: `@import "@/scss/app.scss";`
            }
        }
    }
}