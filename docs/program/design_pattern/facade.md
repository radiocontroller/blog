# 外观模式
#### 亦称： 门面模式、Facade
#### 外观模式是一种结构型设计模式， 能为程序库、 框架或其他复杂类提供一个简单的接口。
---

## 应用场景
* 使用一个简单的接口， 来对子系统进行一些复杂的操作而不需要关心内部实现的细节。
* 如果需要将子系统组织为多层结构， 也就是多个部分， 可以使用外观。

## 优缺点
* 优点：可以让自己的代码独立于复杂子系统。
* 缺点：外观可能成为与程序中所有类都耦合的上帝对象（耦合度太高）。

## 与其他模式的关系
* 外观模式为现有对象定义了一个新接口， 适配器模式则会试图运用已有的接口。 适配器通常只封装一个对象， 外观通常会作用于整个对象子系统上。
* 外观与代理模式的相似之处在于它们都缓存了一个复杂实体并自行对其进行初始化。 代理与其服务对象遵循同一接口，
使得自己和服务对象可以互换， 在这一点上它与外观不同。
* 外观类通常可以转换为单例模式类， 因为在大部分情况下一个外观对象就足够了。

## go实现例子
* [https://refactoringguru.cn/design-patterns/facade/go/example](https://refactoringguru.cn/design-patterns/facade/go/example)

::: tip 参考链接

[https://refactoringguru.cn/design-patterns/facade](https://refactoringguru.cn/design-patterns/facade)

:::
