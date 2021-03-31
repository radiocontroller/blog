# binlog、redo log和undo log
---

### 一、binlog（默认不开启）

* **用于记录数据库表结构和表数据变更，比如update/delete/insert/truncate/create，它由Server层处理，适用mysql所有引擎。**

* **binlog使用场景**
  * **主从复制**：在 Master 端开启 binlog ，然后将 binlog 发送到各个 Slave 端， Slave 端重放 binlog 从而达到主从数据一致。
  * **数据恢复**：通过使用 mysqlbinlog 工具来恢复数据。

* **binlog 是通过追加的方式进行写入的，可以通过 max_binlog_size 参数设置每个 binlog 文件的大小**
    
### 二、redo log
* redo log的存在为了：当我们修改的时候，写完内存了，但数据还没真正写到磁盘的时候。此时我们的数据库挂了，我们可以根据redo log来对数据进行恢复。
因为redo log是顺序IO，所以写入的速度很快，并且redo log记载的是物理变化（xx页做了xx修改），文件的体积很小，恢复速度很快。
    
### 三、bin log和redo log的区别
* **redo log 是物理日志，记录的是【在某个数据页上做了什么修改】；binlog 是逻辑日志，记录的是这个语句的原始逻辑，比如【给 id=2 这一行的 c 字段加 1】。**
* **redo log 是循环写的，空间固定会用完；binlog 是可以追加写入的（产生新文件）。**
* **redo log 是 InnoDB 引擎特有的；binlog 是 MySQL 的 Server 层实现的，所有引擎都可以使用。**

### 四、undo log
* **回滚**
  * 在执行事务的过程中可能会失败，这个时候就可以利用undo log将数据回滚到修改之前的样子
  * 利用undo回滚采取的是类似补偿的方式，比如对每个insert，InnoDB存储引擎会完成一个delete；对每个delete，会完成一个insert；对每个update，
还是执行一个update，更新为原来的值。

* **用于MVCC快照读**
  * [快照读和当前读](/program/mysql/read.html) 这一章里有

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

::: tip 相关链接

[https://gsmtoday.github.io/2019/02/08/how-update-executes-in-mysql/](https://gsmtoday.github.io/2019/02/08/how-update-executes-in-mysql/)

[https://zhuanlan.zhihu.com/p/267377055](https://zhuanlan.zhihu.com/p/267377055)

[https://www.jianshu.com/p/4bcfffb27ed5](https://www.jianshu.com/p/4bcfffb27ed5)

:::