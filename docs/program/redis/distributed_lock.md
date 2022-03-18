# 分布式锁
---

#### redis分布式锁要考虑两种情况，一种是redis集群，另一种是各自独立，毫无相关性的redis实例

### 第一种情况：redis集群
* redis集群在写入和读取某个key的时候，key会计算好放到哪个slot中，因此这种情况和单机redis是一样的
* 加锁解锁思想：set key value nx px，value为随机生成的一个值，目的是为了确保删除key的时候，删的是自己的key，防止自己的key过期了，删了别人的key

### 第二种情况：各自独立，毫无相关性的redis实例
* redlock算法大致思想：记录当前时间t1，对所有redis实例进行加锁，如果加锁成功的个数超过一半，即 >= N/2 + 1，就认为获取锁成功。获取
当前时间t2，同时还要判断t2-t1要小于超时时间，具体细节可以参考下面的链接

### java中redisson库有个看门狗的机制，对锁起一个线程去监控，每隔10秒为分布式锁续期30秒，防止业务没执行完锁过期了

::: tip 参考链接

[https://juejin.cn/post/6844904083623510029](https://juejin.cn/post/6844904083623510029)

[https://github.com/redisson/redisson/issues/956](https://github.com/redisson/redisson/issues/956)

[https://github.com/antirez/redlock-rb/blob/master/redlock.rb](https://github.com/antirez/redlock-rb/blob/master/redlock.rb)

:::
