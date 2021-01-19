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
  * 但是存在这么一种情况，事务A先select快照读，然后事务B插入一条数据，接着事务A不加where条件进行update，这时候事务A再次select快照读就会
  读到B中插入的数据，并且该数据也被更新了。
  * 解读：MVCC快照读本身就包括两部分可见：1、事务开始前已提交的可见 2、自己本事务的修改可见。
  因此这里应该是本身快照读不可见的记录，由于自己修改过变成了快照读可见。**这种情况是mysql的一个feature，不应该认为是产生了不可重复读**。

* 举例：
  ![repeatable_read](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/repeatable_read.png)
  
* **该隔离级别下到底有没有解决幻读？**
> 我认为是解决了的，并且是【当前读】的幻读，具体原因看下面的内容
  
### 4、串行化（serializable）

* 它是最高的隔离级别，它通常通过强制事务串行，避免了前面的所有问题。

### 5、MVCC（Multi-Version Concurrency Control，多版本并发控制）
#### 在MVCC中，读操作可以分成两类：快照读与当前读。快照读，读取的是记录的可见版本 (可能是历史版本)，不用加锁。当前读，读取的是记录的最新版本，并且，当前读返回的记录，都会加上锁，保证其他事务不会再并发修改这条记录。

#### 快照读(snapshot read)
* 在InnoDB中，会在每行数据后添加两个额外的隐藏的值来实现MVCC，这两个值一个记录这行数据何时被创建，另外一个记录这行数据何时过期（或者被删除）。 
在实际操作中，存储是事务的版本号，每开启一个新事务，事务的版本号就会递增。在可重复读事务隔离级别下：
  * **insert时，保存当前事务版本号为行的创建版本号**
  * **delete时，保存当前事务版本号为行的删除版本号**
  * **select时，读取创建版本号<=当前事务版本号，删除版本号为空或>当前事务版本号。**
  * **update时，插入一条新纪录，保存当前事务版本号为新行的创建版本号，同时保存当前事务版本号到原来删除行的删除版本号**

#### 当前读 (current read)
* 当前读有以下情况（第一个是共享锁，其他都是排他锁）
  * **select * from table where ? lock in share mode**
  * **select * from table where ? for update**
  * **insert into table values (…)**
  * **update table set ... where ?**
  * **delete from table where ?**

* 当前读使用next-key锁，即：行锁 + gap锁。行锁防止别的事务修改或删除，gap锁防止别的事务新增，行锁和gap锁结合**共同解决了rr级别下写数据时的幻读问题**。
![gap_lock](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/gap_lock.png)
从图中可以看到，左边的事务通过当前读t_id >= 50的数据，然后锁住了30-50和50-70的区间；因此右边的事务插入t_id=29能成功，但是插入t_id=30会阻塞，
然后左边再次通过当前读t_id >= 50，得到了相同的数据

* **加锁规则**
  * 1. 加锁的单位是 next-key 锁。 
  * 2. 如果等值查询数据存在，则进化为record(行)锁，如果不存在则退化为 gap（间隙）锁
    * 例如select * from t where t_id = 50 for update；**如果50这条记录存在，那么只锁这一条记录；如果不存在，那就锁住50左右两边区间的数据（闭区间）**
  * 3. 范围查找会锁住符合查找条件的所有记录，并锁住第一条不满足该条件的记录。
    * 例如select * from t where t_id >= 50 for update；**锁住>=50记录的同时还会锁住50左边第一个不满足记录的区间（闭区间）**
    
::: tip 相关链接

[https://github.com/Yhzhtk/note/issues/42](https://github.com/Yhzhtk/note/issues/42)

[https://tech.meituan.com/2014/08/20/innodb-lock.html](https://tech.meituan.com/2014/08/20/innodb-lock.html)

[https://www.jianshu.com/p/97f2a6e8f57c](https://www.jianshu.com/p/97f2a6e8f57c)

:::