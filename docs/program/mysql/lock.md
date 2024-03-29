# 乐观锁和悲观锁的区别及使用场景
---

### 基本概念

乐观锁和悲观锁是两种思想，用于解决并发场景下的数据竞争问题。它们的使用是非常广泛的，不局限于某种编程语言或数据库。

* 乐观锁：乐观锁在操作数据时非常乐观，认为别人不会同时修改数据。因此乐观锁不会上锁，只是在执行更新的时候判断一下在此期间别人是否修改了数据；
如果别人修改了数据则放弃操作，否则执行操作。

* 悲观锁：悲观锁在操作数据时比较悲观，认为别人会同时修改数据。因此操作数据时直接把数据锁住，直到操作完成后才会释放锁；
上锁期间其他人不能修改数据。

### 实现方式

* 乐观锁
  1. CAS（compare and swap）
  2. 版本号机制：基本思路是在数据中增加一个字段version，表示该数据的版本号，每当数据被修改，版本号加1。
  当某个线程查询数据时，将该数据的版本号一起查出来；当该线程更新数据时，判断当前版本号与之前读取的版本号是否一致，
  如果一致才进行操作。

* 悲观锁：利用数据库层面的行锁

### 区别

* 乐观锁如果有人在你之前更新了，你的更新应当是被拒绝的，可以提示用户重新操作。悲观锁则会等待前一个更新完成，再进行更新，具体业务具体分析。

::: tip 参考链接

[https://www.cnblogs.com/kismetv/p/10787228.html](https://www.cnblogs.com/kismetv/p/10787228.html)

:::
