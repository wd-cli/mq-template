# 小程序模版
## 开发流程
- 安装依赖
```
cnpm install
```
- 启动编译，日常或者预发,如
```
npm run dev-pre
```
- 有时下载新的依赖包，需要重新重新构建npm包
```
npm run npm:i
```

## 引入iconfont图标步骤
- 去 https://www.iconfont.cn/ 下载字体图标库
- 找到.ttf文件
- 到 https://transfonter.org/ 
- 点击Add fonts按钮，导入该.ttf文件
- 下方勾选TTF，开启Base64 encode开关
- 点击Convert
- 点击Download下载
- 拷贝stylesheet.css，拷贝到新建的iconfont.wxss文件
- 最后拷贝iconfont.css文件中的class类样式到iconfont.wxss




- module-alias
- gulp-shell