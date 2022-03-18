# CORS
---

### 全称“跨域资源共享”（Cross-Origin Resource Sharing）
* 浏览器遵守同源策略。而跨域资源共享是一种机制，它使用额外的HTTP头来告诉浏览器允许跨域访问服务器资源
* 简单点说就是允许前端发起跨域请求，因为正常情况下跨域请求会被浏览器拦截

### 同源策略
* 所谓同源是指：**协议、域名、端口相同**

### CORS处理方式
1. **服务端处理**：Access-Control-Allow-Origin: *
2. **Nginx反向代理**：add_header Access-Control-Allow-Origin *

### 主要headers参数
* **Access-Control-Allow-Origin**：*代表允许任何域名请求，也可以配置允许访问的域名
* **Access-Control-Allow-Credentials**：表示是否允许发送 Cookie。如果要发送Cookie，Access-Control-Allow-Origin就不能设为*。
* **Access-Control-Expose-Headers**：CORS 请求时，只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、Expires、
Last-Modified、Pragma。如果想拿到其他字段，就必须在 Access-Control-Expose-Headers 里面指定。

### 跨站和跨域的区别
* 跨站：二级域名不同，例如 a.com 和 b.com
* 跨域：二级域名相同（app.com），例如 a.app.com 和 b.app.com
* 跨站一定跨域，跨域不一定跨站

### 跨域请求携带cookie分两种情况
#### 假设服务端已经配置好了**Access-Control-Allow-Origin**与**Access-Control-Allow-Credentials**，并且前端也设置了**withCredentials为true**

* 第一种情况（都是http请求）（**跨域**）
  * 访问 a.app.com 并且在 domain = a.app.com 下设置Cookie
  * b.app.com 往 a.app.com 发起ajax请求，**注意此时是会自动带上a.app.com的Cookie的**
* 第二种情况（都是http请求）（**跨站**）
  * 访问 a.com 并且在domain = a.com下设置Cookie
  * b.com 往 a.com 发起ajax请求，**注意此时是不会带上 a.com 的Cookie的**
* 原因：Cookie中的SameSite属性会决定在**跨站**请求时cookie是否被发送，它有三个属性值
  * Strict 完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie（Safari的默认值）
  * Lax 允许部分第三方请求携带 Cookie（Chrome的默认值）
  * None 无论是否跨站都会发送 Cookie

|  请求类型   | 示例                                      | 正常情况     | Lax |
|  ----      | -----                                    | -----       | ----- |
|  链接       | \<a href="..."></a>                      | 发送 Cookie | 发送 Cookie |
|  预加载     | \<link rel="prerender" href="..."/>      | 发送 Cookie | 发送 Cookie |
|  GET表单    | \<form method="GET" action="...">        | 发送 Cookie | 发送 Cookie |
|  POST表单   | \<form method="POST" action="...">        | 发送 Cookie | 不发送 |
|  iframe    | \<iframe src="..."></iframe>              | 发送 Cookie | 不发送 |
|  AJAX      | \$.get("...")                             | 发送 Cookie | 不发送 |
|  Image     | \<img src="...">                          | 发送 Cookie | 不发送 |

* **因此针对上面第二种情况，如果想跨站请求自动带上cookie**
  * 在domain = a.com下设置Cookie时，Secure设置为true（表示通过https才能发送）同时上https，然后SameSite设置为None


::: tip 参考链接

[跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)

[【误】Ajax不会自动带上cookie/利用withCreadentials带上cookie](https://zhuanlan.zhihu.com/p/28818954)

[http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)

[Cookie Samesite简析](https://zhuanlan.zhihu.com/p/266282015)

:::