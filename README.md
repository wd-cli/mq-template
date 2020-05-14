# mq-template

## lib下每个目录表示一个业务

## lerna用法
- 将example02模块添加到example01的dependencies中
```bash
lerna add example02 --scope=example01   
```
- 获取哪些包发生了变更
```bash
lerna updated
```