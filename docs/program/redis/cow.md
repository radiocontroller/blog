# COW(Copy On Write)
---

### rdb快照
* redis程序每隔一段时间或者手动执行bgsave都会创建rdb快照，具体做法是fork一个子进程出来将内存中的数据以rdb格式保存到磁盘中，而不是直接在
主进程中做这个操作，否则主进程会阻塞导致无法响应客户端请求

### fork
![fork](http://motor.rcer666.cn/program/redis/fork.png)

```c
int main() {
    if (fork() == 0) {
        // child process
    } else {
        // parent process
    }
}
```

* 当程序调用了 fork 方法之后，我们就可以通过 fork 的返回值确定父子进程，以此来执行不同的操作：
  * fork 是从一个进程变成两个进程，每个进程的返回值不一样  
  * fork 函数返回 0 时，意味着当前进程是子进程
  * fork 函数返回非 0 时，意味着当前进程是父进程，返回值是子进程的 pid
  
* fork创建出的子进程，与父进程共享内存空间。也就是说，如果子进程不对内存空间进行写入操作的话，内存空间中的数据并不会复制给子进程，
这样创建子进程的速度就很快了！(不用复制，直接引用父进程的物理空间)

* 当父进程或者子进程对共享的内存进行修改时，共享的内存才会以页为单位进行拷贝，父进程会保留原有的物理空间，而子进程会使用拷贝后的新物理空间，
这时候子进程的内存空间就是共享的内存空间 + 拷贝的部分内存空间，这就是所谓的写时复制（copy on write）

### COW在其他地方的应用
* docker：基于一个image启动多个Container，让所有的容器共享image的文件系统，所有数据都从image中读取，只有当要对文件进行写操作时，
才从image里把要写的文件复制到自己的文件系统进行修改，这样可以有效的提高磁盘的利用率

::: tip 相关链接

[为什么 Redis 快照使用子进程](https://draveness.me/whys-the-design-redis-bgsave-fork/)

[COW奶牛！Copy On Write机制了解一下](https://juejin.cn/post/6844903702373859335)

:::