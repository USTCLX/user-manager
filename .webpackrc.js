export default {
  "proxy": {
    "/api": {
      "target": "http://localhost:3000/",
      "changeOrigin": true,
    }
  },
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ]
}
