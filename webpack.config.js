let Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/ui/')
    .setPublicPath('/ui')
    .addEntry('app', './assets/js/app.js')
    .addStyleEntry('ui', './assets/css/app.scss')
    .enableSassLoader(function(options) {}, {
        resolveUrlLoader: false
    })
;

let config = Encore.getWebpackConfig();
config.output.library = 'xiv';
config.output.libraryExport = "default";
config.output.libraryTarget = 'var';
module.exports = config;
