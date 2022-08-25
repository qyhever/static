- [强缓存和协商缓存](#强缓存和协商缓存)
  - [优先级](#优先级)
  - [字段解释](#字段解释)
    - [HTTP1.0](#http10)
    - [HTTP1.1](#http11)
    - [其它相关字段](#其它相关字段)
  - [字段位置](#字段位置)
  - [用户行为对缓存的影响](#用户行为对缓存的影响)
# 强缓存和协商缓存

## 优先级
强缓存：Pragma > Cache-Control > Expires  
协商缓存：If-None-Match/ETag > If-Modified-Since/Last Modified

## 字段解释
### HTTP1.0
- Expires: 文件过期时间
- Pragma: `Pragma: no-cache` 与 `Cache-Control: no-cache` 效果一致，该字段已废弃不建议使用
- Last-Modified: 最近修改时间  
两个字段都是 UTC/GMT 时间（绝对时间）。Expires 过期控制不稳定，因为浏览器端可以随意修改本地时间，导致缓存使用不精准。而且 Last-Modified 过期时间只能精确到秒。

### HTTP1.1
- Cache-Contorl: 精准控制
- Etag: 版本号 

### 其它相关字段
- Vary: 基于用户代理提供内容优化，一般很少用，建议使用基于特征检测的方法
- Date: UTC/GMT 时间
- Age: 秒为单位  
如果 静态资源Age + 静态资源Date < 原服务端Date，则命中缓存。但是也不一定准确，原服务器可能会修改系统时间

## 字段位置
| 字段                   | 请求头 | 响应头 |
| :--------------------- | :----: | -----: |
| Pragma                 |   是   |     是 |
| Expires                |  `否`  |     是 |
| Last-Modified          |  `否`  |     是 |
| If-Match/If-None-Match |   是   |   `否` |
| If-Modified-Since      |   是   |   `否` |
| Cache-Control          |   是   |     是 |
| ETag                   |  `否`  |     是 |

## 用户行为对缓存的影响
| 用户操作        | Expires/Cache-Control | Last-Modified/ETag |
| :-------------- | :-------------------: | -----------------: |
| 地址栏回车      |         有效          |               有效 |
| 页面链接跳转    |         有效          |               有效 |
| 新开窗口        |         有效          |               有效 |
| 前进后退        |         有效          |               有效 |
| F5刷新          |        `无效`         |             `有效` |
| Ctrl+F5强制刷新 |        `无效`         |             `无效` |

F5 会 跳过强缓存规则，直接走协商缓存；Ctrl+F5 ，跳过所有缓存规则，和第一次请求一样，重新获取资源

参考：  
https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ  
https://juejin.cn/post/6844903763665240072
