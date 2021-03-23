# CORS
---

### 全称“跨域资源共享”（Cross-Origin Resource Sharing）
* 浏览器遵守同源策略。而跨域资源共享是一种机制，它使用额外的HTTP头来告诉浏览器允许跨源访问服务器资源

### 同源策略
* 所谓同源是指：**协议、域名、端口相同**

### CORS处理方式
1. **服务端处理**：Access-Control-Allow-Origin: *（也可以配置允许访问的域名）
2. **Nginx反向代理**：add_header Access-Control-Allow-Origin *

### CORS设定的headers参数
* **Access-Control-Allow-Origin**：*代表允许任何域名请求
* **Access-Control-Allow-Credentials**：表示是否允许发送 Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。
* **Access-Control-Expose-Headers**：CORS 请求时，只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、Expires、
Last-Modified、Pragma。如果想拿到其他字段，就必须在 Access-Control-Expose-Headers 里面指定。

### ajax请求
* ajax会自动带上同源的cookie，不会带上不同源的cookie
* 可以通过前端设置withCredentials为true，后端配置Access-Control-Allow-Credentials的方式来让ajax自动带上不同源的cookie