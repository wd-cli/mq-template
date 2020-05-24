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
npm run mq:npm
```
- 生成预览码
```
npm run mq:preview
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

## 小程序CI工程配置 
小程序开发者平台
- 配置文件ci-config
- - appid 开发者appid
- - privateKeyPath 前应访问"微信公众平台-开发-开发设置"后下载代码上传密钥
> IP白名单需要配置，可能构建会报IP地址无效
