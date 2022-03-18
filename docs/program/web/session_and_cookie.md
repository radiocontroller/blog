# session和cookie的关系
---

### http是一个无状态协议
* 这一次请求和上一次请求是没有任何关联的，因此要想产生关联就需要借助一些手段和工具

### session和cookie
* 由于http的无状态性，为了使某个域名下的所有网页能够共享某些数据，session和cookie出现了。客户端访问服务器的流程如下
* 【1】首先，客户端会发送一个请求到服务端
* 【2】服务端接受客户端请求后，建立一个session，并响应到客户端，这个响应头中就包含Set-Cookie，它包含了sessionId
* 【3】接着客户端发起第二次请求，浏览器会自动在请求头中带上cookie
* 【4】服务端接收请求，根据cookie中的sessionId，就可以拿到第【2】步中保存的session信息，核对成功后响应客户端

### session存储
* session需要有个地方存储来做持久化，否则服务重启就丢失了用户的登录信息
* session可以存在数据库，缓存，文件等地方
* Rails中有个cookie-based session的概念，它的session是存在cookie中的，这样就没有sessionId的概念了，直接从cookie中拿数据就可以了，
但是这样做要保证cookie的安全性，也就是服务端用于加密cookie的secret_key不能泄露。

::: tip 参考链接

[https://segmentfault.com/a/1190000017831088](https://segmentfault.com/a/1190000017831088)

:::