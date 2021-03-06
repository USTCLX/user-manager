
const publicPath = process.env.NODE_ENV === 'production' ? '/admin/' : '/';

console.log('publicPath', publicPath);

export default {
  "proxy": {
    "/api": {
      "target": "http://localhost:3000/",
      "changeOrigin": true,
    }
  },
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ],
  outputPath: '../new_operate/server/static/admin',
  publicPath: publicPath,
  hash: true,
  html: {
    template: './src/index.ejs',
  },
}
