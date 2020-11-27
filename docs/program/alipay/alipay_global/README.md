# alipay_global接口的一些参数说明
---

::: tip 涉及参数
rmb_fee, total_fee, currency
:::

1. 如果你的商品是以人民币标价的，那么接口中传rmb_fee，currency决定你的结算货币

2. 如果你的商品不是以人民币标价的，例如HKD，那么接口中传total_fee，同时currency传HKD，
   用户扫码支付看到的金额会自动转为人民币，但是支付宝那边会以港币进行结算