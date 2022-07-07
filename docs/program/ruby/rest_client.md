# RestClient调用方式区别

---

### 最近使用RestClient发送get请求报【414 URI Too Long】错误
* 调用方式如下
```ruby
RestClient.get(url, params: { key: value })
```

* 因为params里面的参数太多，利用上面这种方式，实际上是把参数拼接在url中，这就会导致url过长，因此被RestClient拦截了。

* 一般人会想到把接口改成post就好了，参数放到body里面，其实get和post本质上唯一区别就是get是幂等而post不是，因此get也是可以把参数放到body里面的。

### 改写如下

```ruby
RestClient::Request.execute(url: url, method: :get, payload: { key: value })
```

### 总结
* 以上两种调用方式也是看了源码才发现区别，第一种拼接url，第二种放到body当中。上述两种方式在rails中都可以通过params获取到参数，平时使用并没有觉得两者有什么差异，直到这次发现两者区别
