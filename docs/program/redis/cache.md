# 缓存穿透/击穿/雪崩
---

### 1、缓存穿透
::: tip 解释
正常情况下，我们去查询数据都是存在的。
那么请求去查询一条压根儿数据库中根本就不存在的数据，也就是缓存和数据库都查询不到这条数据，但是请求每次都会打到数据库上面去。
:::

* 采用布隆过滤器，将所有可能存在的数据放到一个足够大的bitmap中，一个一定不存在的数据会被这个bitmap拦截掉，从而避免了对底层存储系统的查询压力。

* 另外也有一个更为简单粗暴的方法，如果一个查询返回的数据为空，我们仍然把这个空结果进行缓存，但是过期时间比较短。
---

### 2、缓存击穿
::: tip 解释
针对缓存中没有但数据库有的数据。场景是，当Key失效后，假如瞬间突然涌入大量的请求，来请求同一个Key，这些请求不会命中Redis，都会请求到DB，
导致数据库压力过大，甚至扛不住，挂掉。
:::

* 设置热点Key永不过期。

* 加互斥锁。当发现没有命中Redis，获取锁并从数据库取数据更新到缓存。这样就防止都去数据库重复取数据，重复往缓存中更新数据的情况出现。(得到锁的线程就读数据写缓存，没得到锁的线程可以不用阻塞，继续从缓存中读数据，如果没有读到数据就sleep会再来试试。)

---

### 3、缓存雪崩
::: tip 解释
大量的key设置了相同的过期时间，导致在缓存在同一时刻全部失效，造成瞬时DB请求量大、压力骤增，引起雪崩。
:::

* 设置key过期时间时，加上一个随机数
---