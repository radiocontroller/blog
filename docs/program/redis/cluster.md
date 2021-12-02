# Redis Cluster原理以及搭建
---

### 1. 原理
* [https://juejin.cn/post/6844903984294002701](https://juejin.cn/post/6844903984294002701)

### 2. mac环境搭建
* [http://wintercloud.tech/2020/05/07/Mac%E6%90%AD%E5%BB%BARedisCluster/](http://wintercloud.tech/2020/05/07/Mac%E6%90%AD%E5%BB%BARedisCluster/)

```shell
cd /usr/local/etc/redis-cluster

redis-server 7000/redis.conf & redis-server 7001/redis.conf & \
redis-server 7002/redis.conf & redis-server 7003/redis.conf & \
redis-server 7004/redis.conf & redis-server 7005/redis.conf &

redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 --cluster-replicas 1

# 查看master和slave关系
redis-cli -h 127.0.0.1 -p 7000 -c cluster slots | xargs  -n8 | awk '{print $3":"$4"->"$6":"$7}' | sort -nk2 -t ':' | uniq

# 进入某个节点
redis-cli -p 7004

# 其他命令（进入节点后执行）
info replication
cluster nodes
```

* 用redis-cli连接时要加个 -c 参数，否则会报类似错误：(error) MOVED 5798 127.0.0.1:7000

* 报错：[ERR] Node 127.0.0.1:7000 is not empty. Either the node already knows other nodes (check with CLUSTER NODES) or contains some key in database 0. 将 /usr/local/var/db/redis 该目录下内容清空

::: tip 相关链接

[https://github.com/redisson/redisson/issues/956](https://github.com/redisson/redisson/issues/956)

[https://github.com/antirez/redlock-rb/blob/master/redlock.rb](https://github.com/antirez/redlock-rb/blob/master/redlock.rb)

:::
