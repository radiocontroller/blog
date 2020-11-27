# 微信oauth授权的几点说明
---

* scope: snsapi_login，这个配置是在微信开放平台申请的，用于二维码扫码登录

* scope: snsapi_base（静默授权，用户无感知）, snsapi_userinfo，这个配置是在微信公众号平台申请的，用户微信浏览器，app内部，授权登录

* 但是拿到code之后去请求access_token的接口都是同一个：https://api.weixin.qq.com/sns/oauth2/access_token