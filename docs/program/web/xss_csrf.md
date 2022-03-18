# 总结 XSS 与 CSRF
---

### XSS（Cross-site scripting）
* XSS 全称“跨站脚本攻击”，是注入攻击的一种。其特点是通过一些正常的站内交互途径，例如发布评论，文章等提交含有 JavaScript 的内容文本。
这时服务器端如果没有过滤或转义掉这些脚本，作为内容发布到了页面上，其他用户访问这个页面的时候就会运行这些脚本。
通过这些脚本，攻击者可以将用户cookie等信息发送给自己网站。因此正确处理方式是服务端过滤或转义这些恶意文本。

### CSRF（Cross-site request forgery）
* CSRF 全称“跨站请求伪造”。即伪造用户身份，向目标网站发起请求，一般是在攻击者自己的网站发起的，常发生在Cookie/Session认证下表单提交的伪造。
* **假设目标网站【A】有个退出登录的路由，地址为：/logout，method为：get。**
* 攻击者在自己的网站【B】伪造一个按钮（通过构造一个form表单，url为：/logout，method为get），
并引导用户点击，点击后用户就退出了【A】网站的登录（cookie会自动带上）。同理，假设【A】网站暴露了一些账户相关的路由，那么就很危险了。
* **正确处理方式，这里分两种情况**
  * 服务端渲染的情况：在请求form页面的时候，服务端生成一个随机csrf_token，放到form的隐藏域里面，同时保存该csrf_token到session中，
  客户端提交表单的时候，服务端对form中的csrf_token和session中的csrf_token进行判断，如果一致认为是合理的请求。拓展一下，前面说服务端将csrf_token
  放到session中，也可以改成放到cookie中。因为攻击者虽然可以在自己的网站构造form表单，并且设置csrf_token到隐藏域，但是他没办法在目标域名的cookie中设值。
  * 前后端分离的情况：由客户端去生成这个随机csrf_token，然后放到form的隐藏域里面，以及cookie中即可。
* **特别说明一下**：现在很多服务端设计了rest api，它是用cookie中的token去获取用户信息的，这种方式本来就能防范CSRF。
假设token存储在cookie的键值叫token_demo，后台验证的Header键值为Authorization，这样伪造的请求到了后台，就取不到token

::: tip 参考链接

[https://blog.techbridge.cc/2017/02/25/csrf-introduction/](https://blog.techbridge.cc/2017/02/25/csrf-introduction/docs/.vuepress/conf/sidebar/program.js)

:::