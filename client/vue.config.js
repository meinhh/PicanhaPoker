module.exports = {
  "transpileDependencies": [
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