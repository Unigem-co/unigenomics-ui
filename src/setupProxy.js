const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api/*',
        createProxyMiddleware({
            target: 'http://147.182.234.145',
            changeOrigin: true,
        })
    );
};