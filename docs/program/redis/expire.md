# key过期策略以及内存淘汰策略
---

### Redis过期key处理策略
* **定期删除**：redis默认是每隔 100ms 就随机抽取一些设置了过期时间的key，检查其是否过期，如果过期就删除。**注意这里是随机抽取的，并不是遍历所有key**。
* **惰性删除**：Redis 会在每次 get key 的时候先判断该 key 的过期时间，如果已经过期，则删除。
* **redis使用的过期键值删除策略是：定期删除 + 惰性删除。**
---

### Redis内存淘汰策略
* [https://cllc.fun/2020/02/07/redis-eviction-policy/](https://cllc.fun/2020/02/07/redis-eviction-policy/)