### Gulp

  采用最新的Gulp 4版本的构建打包

### 增量更新机制，运行起来更快

  引入Sass，提供css预编译

## 项目结构

```
.
├── gulpfile.js
├── package.json
├── src // 开发目录
│   ├── api // 网络请求相关
│   ├── app.js
│   ├── app.json
│   ├── app.scss
│   ├── common // 开发相关的静态文件原始资源
│   │   ├── font //字体文件
│   │   ├── scss // 放置SCSS 的minxins 等被import 的SCSS 文件
│   │   └── js // 放置js
│   ├── image // 图片资源
│   ├── components // 公用组件
│   ├── config // 公用配置
│   ├── pages
│   └── utils
└── dist // 通过src 目录编译后生成的文件目录，也是小程序开发的项目目录

```

## 开始使用

> Node 版本建议在v4 以上。

### 安装

1. 全局按照 Gulp-cli

```
npm install gulp-cli -g
```

2. 通过`npm i `安装依赖。

```
npm i
```

3. 启动开发

```
gulp | npm run dev 

```# applet
