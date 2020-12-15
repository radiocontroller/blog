# 事务隔离级别
---

### 1、读未提交（read uncommitted）

* 一个事务的修改，即使没有提交，对其他事务也都是可见的

* 产生的问题：一个事务可以读取其他事务未提交的数据，称为【脏读】

* 举例：

  ![read_uncommitted](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/read_uncommitted.png)
  
### 2、读已提交（read committed）

* 一个事务只能看见已经提交的事务的修改结果。

* 举例：

  ![read_committed](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/read_committed.png)
  
* 产生的问题：在同一个事务中的两次相同查询结果可能会不一样，称为【不可重复读】。

### 3、可重复读（repeatable read，MySQL的默认事务隔离级别）

* 该级别解决了【不可重复读】（通过MVCC的快照读解决）

* 举例：
  ![repeatable_read](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/repeatable_read.png)
  
* 产生的问题：幻读。
> 幻读，并不是说两次读取获取的结果集不同，幻读侧重的方面是某一次的 select 操作得到的结果所表征的数据状态无法支撑后续的业务操作。
  更为具体一些：select 某记录是否存在，不存在，准备插入此记录，但执行 insert 时发现此记录已存在，无法插入，此时就发生了幻读。
  
### 4、串行化（serializable）

* 它是最高的隔离级别，它通常通过强制事务串行，避免了前面说的幻读问题。简单来说，"可串行化"会在读取的每一行数据上都加锁，
所以可能会导致大量的锁等待和超时问题，所以在实际的生产环境中也很少会用到这个隔离级别，只有在非常需要确保数据的一致性切可以接受没有并发的情况下，
才会考虑使用这个隔离级别。

### 5、Mysql rr 隔离级别是怎么解决幻读的

#### 1. 幻读针对的是当前读，不要把快照读和当前读混在一起去比较

* 当前读有以下情况
  * select * from table where ? lock in share mode
  * select * from table where ? for update
  * insert into table values (…)
  * update table set ... where ?
  * delete from table where ?
  
#### 2. 当前读使用next-key锁，即：行锁 + gap锁。行锁防止别的事务修改或删除，gap锁防止别的事务新增，行锁和gap锁结合共同解决了rr级别在写数据时的幻读问题。

![gap_lock](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/gap_lock.png)
从图中可以看到，左边的事务通过当前读t_id = 50的数据，然后锁住了30-50和50-70的区间；因此右边的事务插入71和29都能成功，但是插入60会阻塞

#### 3. 注意：update语句中假如where后面的字段没有索引，那么gap锁会锁住整张表。因为没有索引，则这些字段也就没有排序，也就没有区间

::: tip 相关链接

[https://github.com/Yhzhtk/note/issues/42](https://github.com/Yhzhtk/note/issues/42)

[https://tech.meituan.com/2014/08/20/innodb-lock.html](https://tech.meituan.com/2014/08/20/innodb-lock.html)

[https://www.jianshu.com/p/97f2a6e8f57c](https://www.jianshu.com/p/97f2a6e8f57c)

:::