# binlog、redo log和undo log
---

### 一、binlog（默认不开启）

* **用于记录数据库执行的写入性操作(不包括查询)信息，它由Server 层处理，适用mysql所有引擎。**

* **binlog 是通过追加的方式进行写入的，可以通过 max_binlog_size 参数设置每个 binlog 文件的大小，当文件大小达到设定值之后，
会写入新的文件来保存日志。**

* **binlog使用场景**
  * 1. 主从复制 ：在 Master 端开启 binlog ，然后将 binlog 发送到各个 Slave 端， Slave 端重放 binlog 从而达到主从数据一致。
  * 2. 数据恢复 ：通过使用 mysqlbinlog 工具来恢复数据。

* **binlog刷盘时机**
  * **对于 InnoDB 存储引擎来说，只有在事务提交时才会记录 binlog ，此时记录还在内存中，那么 binlog是什么时候刷到磁盘中的呢？ 
mysql 通过 sync_binlog 参数控制 binlog 的刷盘时机，取值范围是 0-N**
    * 0：不强制要求，由系统自行判断何时写入磁盘；
    * 1：每次 commit 的时候都将 binlog 写入磁盘；（默认值）
    * N：每N个事务，才会将 binlog 写入磁盘。
    
### 二、redo log
* **redo log是InnoDB存储引擎特有的，它的主要目的是保证数据的完整性。如数据库由于某种原因突然宕机，InnoDB存储引擎可以使用redo log恢复到宕机之前的状态。**
* **redo log在事务中的作用**
  * InnoDB存储引擎通过预写日志的方式来保证事务的完整性。也就是说磁盘上存储的数据页和内存缓冲池中的页**不是同步的**，对于内存缓冲池中页的修改，
    是先写入redo log文件，再写入磁盘，这种 **先写日志，再写磁盘** 的技术就是 MySQL 里经常说到的 WAL(Write-Ahead Logging) 技术。
  * innodb_flush_log_at_trx_commit：用来控制redo log刷盘的策略，可设的值有0、1、2。
    * 0：mysql主线程定时刷新到磁盘
    * 1：在事务提交时，将redo log从缓冲区同步刷新到磁盘（默认值）
    * 2：事务提交后，异步刷新到磁盘
    
### 三、bin log和redo log的区别
* 1. **redo log 是物理日志，记录的是【在某个数据页上做了什么修改】；binlog 是逻辑日志，记录的是这个语句的原始逻辑，比如【给 id=2 这一行的 c 字段加 1】。**
* 2. **redo log 是循环写的，空间固定会用完；binlog 是可以追加写入的。**
* 3. **redo log 是 InnoDB 引擎特有的；binlog 是 MySQL 的 Server 层实现的，所有引擎都可以使用。**

### 四、undo log
* **1. 实现事务的原子性**
  * 在执行事务的过程中可能会失败，这个时候就可以利用undo log将数据回滚到修改之前的样子
  * 利用undo回滚采取的是类似补偿的方式，比如对每个insert，InnoDB存储引擎会完成一个delete；对每个delete，会完成一个insert；对每个update，
会执行一个相反的update。也就是说回滚不是物理上的恢复，而是逻辑上的恢复，保证回滚的事务没有更改数据库数据。

* **2. 作用于MVCC快照读**
  * 每条数据都会有指向历史数据的undo log指针，并且可以有很多历史版本，其中有事务ID的字段，然后各个事务通过历史版本的事务ID字段进行查找属于自己
  当前事务可见的数据

### 五、三个log之间的联系
* **假设现在进行一个更新操作：update T set a = 1 where id = 2，顺序为：**
  * 1. 事务开始（任何一个操作都是事务），写**undo log** ，记录上一个版本数据，并更新记录的回滚指针和事务ID；
  * 2. 执行器先调用引擎取id=2这一行。id是主键，引擎直接用树搜索找到这一行；
    * 1. 如果id=2这一行所在的数据页本来就在内存中，就直接返回给执行器更新；
    * 2. 如果记录不在内存，接下来会判断索引是否是唯一索引；
      * 如果是唯一索引，将数据页从磁盘读入到内存，返回给执行器；
      * 如果不是唯一索引，InnoDB会将更新操作写到**change buffer**中；
  * 3. 引擎将这行数据更新到内存中（如果内存中有的话），同时将这个更新操作记录到**redo log**里面；
  * 4. 执行器生成这个操作的**binlog**；
  * 5. 执行器调用引擎的提交事务接口；
  * 6. 事务的两阶段提交：commit的prepare阶段：引擎把刚刚写入的**redo log**刷盘；
  * 7. 事务的两阶段提交：commit的commit阶段：引擎**binlog**刷盘。
 
![更新过程](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/update_process.jpeg)
 
* **事务的两阶段提交，目的是为了保证redo log和binlog一致（假设binlog开启）**
  * 1、prepare阶段，写redo log到磁盘，此时状态为prepared；
  * 2、commit阶段，写binlog并且将redo log的状态改成commit；

* **为什么是需要两阶段呢？**
  * 1. 假设是先写redo log，后写binlog。如果这个时候MySQL发生了进程的异常重启，由于redo Log已经写完，MySQL崩溃之后通过crash_safe能力，
  能够把数据恢复回来。但是由于binlog还没写完就crash了，所以binlog里面并没有记录该SQL语句，所以使用binlog回档数据的时候，
  恢复出来的数据其实是少了一次更新操作的，这样就造成了灾难恢复出来的库和原库数据不一致；
  * 2. 假设是先写binlog，后写redo log。binlog写完之后发生了crash，由于redo log还没有写，崩溃恢复之后这个事务的更新是无效的。
  但是binlog里面记录了这条更新的语句，所以使用binlog回档的时候就多了一条事务的更新。造成回档出来的数据和原库的数据不一致。     

* **redo log和binlog怎么联系起来？**
  * 1. 它们有一个共同的数据字段，叫XID。
  * 2. 崩溃恢复的时候，会按顺序扫描redo log。如果碰到既有**prepare**又有**commit**的redo log，就直接提交；如果碰到只有**prepare**
  而没有**commit**的redo log，就拿着XID去binlog找对应的记录；如果binlog中有完整记录，那么提交事务，否则就回滚事务。

::: tip 相关链接

[https://gsmtoday.github.io/2019/02/08/how-update-executes-in-mysql/](https://gsmtoday.github.io/2019/02/08/how-update-executes-in-mysql/)

[https://zhuanlan.zhihu.com/p/267377055](https://zhuanlan.zhihu.com/p/267377055)

[https://www.jianshu.com/p/4bcfffb27ed5](https://www.jianshu.com/p/4bcfffb27ed5)

[https://segmentfault.com/a/1190000023635286](https://segmentfault.com/a/1190000023635286)

:::