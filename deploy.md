- [前端项目部署](#前端项目部署)
  - [代码层面](#代码层面)
    - [路由懒加载](#路由懒加载)
    - [组件库按需加载](#组件库按需加载)
  - [利用缓存](#利用缓存)
  - [覆盖式发布/非覆盖式发布](#覆盖式发布非覆盖式发布)
  - [CDN](#cdn)
  - [gzip 压缩](#gzip-压缩)
  - [自动化构建](#自动化构建)
  - [宇宙最重物质 node_modules 安装速度过慢](#宇宙最重物质-node_modules-安装速度过慢)
  - [提升 Build 构建速度](#提升-build-构建速度)
    - [启用多进程构建(thread loader)](#启用多进程构建thread-loader)
    - [富文本/echarts 过大资源 CDN 静态化](#富文本echarts-过大资源-cdn-静态化)


# 前端项目部署
## 代码层面
### 路由懒加载
配置路由按需加载，当前路由只加载当前路由资源，提升页面访问速度
### 组件库按需加载
tree shaking

## 利用缓存
提升二次访问速度，节省带宽
- index.html
适合协商缓存或者不走缓存（每次保持最新就好）
- 其它 js/css/png... 资源
`URL` 加上 `hash` 文件摘要，充分利用缓存，文件名 `xxx.[hash].css`  
nginx 配置示例：
```shell
server {
  location = /index.html {
    add_header Cache-Control no-cache;
  }

  location ~ /static/ {
    add_header Cache-Control no-cache;
  }

  location ~ /(js/*|css/*|img/*|font/*) {
    expires 30d;
    add_header Cache-Control public;
   }
}
```

## 覆盖式发布/非覆盖式发布
采用非覆盖式发布，覆盖式发布会有页面与静态资源出现匹配错误的情况  
服务器存在多份 `xxx.[hash].css` 文件，定期清理

## CDN
使用 反向代理，将静态资源部署到 `CDN` 上，再将 `Nginx` 上的流量转发到 `CDN` 上  
使用流程：
- 构建时依据环境变量，将 `HTML` 中的静态资源地址加上 `CDN` 域名。
- 构建完成后将静态资源上传到 `CDN` 。
- 配置 `Nginx` 的反向代理，将静态资源流量转发到 `CDN。`

nginx 配置示例：
```shell
location ^~/static/ {
  proxy_pass $cdn;
}
```
## gzip 压缩
构建生成 `gz` 文件，服务器配置 `gzip` 压缩

## 自动化构建
配置流水线提升发布效率  
手动构建时大约需要的步骤：
- 拉取远程仓库
- 切换到 XXX 分支
- 代码安全检查（非必选）、单元测试（非必选）等等
- 安装 `npm/yarn`依赖
  - 设置 `node` 版本
  - 设置 `npm/yarn` 源
  - 安装依赖等
- 执行编译 & 构建
- 产物检查（比如检测打包后 `JS` 文件 / 图片大小、产物是否安全等，保证产物质量，非必选）
- 人工卡点（非必选，如必须 `Leader` 审批通过才能继续）
- 打包上传 `CDN`
- 自动化测试（非必选，`e2e`）
- 配套剩余其他步骤
- 通知构建完成

业界的一些解决方案：
- 保证环境一致性: Docker
- 按流程构建: Jenkins
- 自动化构建触发: Gitlab webhook 通知
- 开始构建通知: 依赖账号体系打通 + Gitlab Webhook
- 构建完成通知: 依赖账号体系打通
[前端项目自动化部署——超详细教程（Jenkins、Github Actions）](
https://blog.csdn.net/weixin_49592546/article/details/109352249)

## 宇宙最重物质 node_modules 安装速度过慢

## 提升 Build 构建速度
### 启用多进程构建(thread loader)
### 富文本/echarts 过大资源 CDN 静态化
直接访问 `CDN`，不走构建
