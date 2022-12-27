const proxy = require('http-proxy-middleware');

module.exports = function(app)
{
    app.use(proxy('/ws', { target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001', ws: true }));
    app.use(proxy('/fonts', { target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001' }));
    app.use(proxy('/auth/**', { target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001' }));
    app.use(proxy('/api', { target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001' }));
    app.use(proxy('/service', { target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001' }));
};
