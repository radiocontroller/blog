# 事务隔离级别
---

### 1、读未提交（read uncommitted）

* 一个事务的修改，即使没有提交，对其他事务也都是可见的

* 产生的问题：一个事务可以读取其他事务未提交的数据，称为脏读

* 举例：

  ![read_uncommitted](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/read_uncommitted.png)
  
### 2、读已提交（read committed）

* 一个事务只能看见已经提交的事务的修改结果。

* 举例：

  ![read_committed](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/read_committed.png)
  
* 产生的问题：在同一个事务中的两次相同查询结果可能会不一样，称为不可重复读，重点在于update和delete

### 3、可重复读（repeatable read，MySQL的默认事务隔离级别）

* 该级别保证了在同一次事务中多次查询相同的语句结果是一致的（无论其他事务怎么提交）

* 举例：
  ![repeatable_read](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/repeatable_read.png)
  
* 产生的问题：幻读，幻读的重点在于insert。举例：
  ![phantom_read](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/phantom_read.png)
  
### 4、串行化（serializable）

* 它是最高的隔离级别，它通常通过强制事务串行，避免了前面说的幻读问题。简单来说，"可串行化"会在读取的每一行数据上都加锁，
所以可能会导致大量的锁等待和超时问题，所以在实际的生产环境中也很少会用到这个隔离级别，只有在非常需要确保数据的一致性切可以接受没有并发的情况下，
才会考虑使用这个隔离级别。

### 5、区别总结

| 隔离级别 | 脏读| 不可重复读 | 幻读 |
| ------- |:-----:| -----:|------:|
| 读未提交 | 可能   | 可能  |可能 |
| 读已提交 | 不可能 | 可能   |可能 |
| 可重复读 | 不可能 | 不可能 | 可能 |
| 串行化   | 不可能 | 不可能 | 不可能 |
 