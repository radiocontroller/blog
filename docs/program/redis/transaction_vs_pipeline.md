# 事务 vs 管道
---

### 1. 事务
* 涉及命令：MULTI, EXEC, DISCARD, WATCH
* Redis事务并不保证 **原子性**，也就是说其中某个命令执行失败之后还是可以继续往下执行的，Redis事务只保证了 **隔离性**。也就是说，事务中的一批命令在执行过程中不会执行其他命令。

### 2. 管道
* Redis执行一次命令会导致一次客户端 <-> 服务端的来回请求，而管道可以将多个命令一起发送和接收，相当于多个命令也是占用一次客户端 <-> 服务端的来回请求，极大的提高了性能。管道可以和事务搭配使用。
* 管道的本质就是改变客户端对命令的读写顺序。

::: tip 参考链接

[https://stackoverflow.com/questions/29327544/pipelining-vs-transaction-in-redis](https://stackoverflow.com/questions/29327544/pipelining-vs-transaction-in-redis)

:::
