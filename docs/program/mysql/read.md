# 快照读与当前读
---

### 快照读（MVCC实现）
* 快照读，读取的是记录的可见版本，不用加锁。
* MVCC：Multi-Version Concurrency Control，多版本并发控制
#### 实现原理
##### 1. 我们先来了解一下版本链的概念。在InnoDB引擎表中，它的聚簇索引记录中有两个必要的隐藏列：
* **trx_id**：用来存储每次对某条记录进行修改时候的事务id
* **roll_pointer**：每次对记录进行修改的时候，都会把老版本写入undo log中。这个roll_pointer就是存了一个指针，
它指向这条记录的上一个版本，通过它来获得上一个版本的记录信息。(**注意insert操作的undo log没有这个属性，因为它没有老版本**)

![mvcc](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/mvcc1.png)

假设有个**事务id是60**执行这条记录的修改语句：**update set name = '张三1' where id = 1**

此时的版本链变成

![mvcc](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/mvcc2.png)

##### 2. ReadView
* ReadView在生成时会有以下几个属性
  * **m_ids** 当前活跃所有的事务ID（活跃的意思就是事务开启了还没提交）
  * **min_trx_id** 表示当前m_ids中最小的事务ID
  * **max_trx_id** 表示当前所有事务中最大的事务ID（这里并非是m_ids的最大值了，而是所有事务）
  * **creator_trx_id** 表示ReadView生成时所在的事务ID

**假设当前m_ids为[80,100]，max_trx_id为110**

  * 如果访问的记录版本的trx_id为50，发现50比列表最小80还小，那说明这个事务在之前就提交了，所以对当前事务来说**可见**。
  * 如果访问的记录版本的trx_id为90，发现90在列表最小值80和最大值100之间。那就再判断一下是否在列表内，如果在那就说明此事务还未提交，
  所以对当前事务**不可见**。如果不在那说明事务已经提交，所以对当前事务**可见**。
  * 如果访问的记录版本的trx_id为120，发现比max_trx_id110还大，那说明这个版本是在ReadView生成之后才出现的，所以对当前事务**不可见**。
 
**为什么访问的记录版本的trx_id不能与m_ids的最大值进行比较呢？**
  * 接着上一个例子，如果访问的记录版本的trx_id为105，105比列表最大值100还大，如果认为这个版本是在ReadView生成之后才出现的，
  然后对当前事务**不可见**，那就错了。实际上这个版本是在ReadView生成之前出现的，对当前事务**可见**。（**因为事务并不一定按ID大小顺序进行提交，ID大的事务可能先提交**）
    
**这些记录都是去版本链里面找的，先找最近记录，如果最近这一条记录trx_id对当前事务不可见的话，再去找上一个版本再比较一次trx_id看版本能不能访问，
以此类推直到返回可见的版本或者结束。**

##### 3. 下面重点讲下读已提交隔离级别和可重复读隔离级别下select查询区别的原理
如果此时开启了一个事务id为100的**事务A**，将name改为**张三2**，但是事务还没提交，则此时的版本链为

![mvcc](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/mvcc3.png)

此时另一个**事务B**发起了select语句要查询id为1的记录，**此时生成的ReadView列表只有[100]**。接着去版本链找可见记录版本，首先肯定找最近的一条，
发现trx_id是100，也就是**张三2**的那条记录，发现在列表内，所以不可见。

这时候通过回滚指针继续找上一个版本，找到了**张三1**的记录，发现trx_id是60，小于列表中的最小id，所以这条记录版本可见，访问结果为**张三1**

那这时候我们把事务id为100的**事务A**提交了，并且重新开启了一个事务id为110的**事务C**，同样修改id为1的记录，将name改成**张三3**，并且不提交事务，这时候版本链为

![mvcc](https://moto-1252807079.cos.ap-shanghai.myqcloud.com/program/mysql/mvcc4.png)

这时候之前那个**事务B**又执行了一次相同查询，还是查询id为1的记录

**这个时候关键的地方来了！！！**

如果你是**读已提交隔离级别，这时候你会重新生成一个ReadView**，那你的活跃事务列表中的值就变了，变成了[110]。按照之前的做法，
你通过版本链trx_id对比查找会找到trx_id为100的**张三2**，这时候你会发现，**事务B**前后两次相同的select查询，得到了不一样的结果（**张三1和张三2**）

如果你是**可重复读隔离级别，这时候你的ReadView还是第一次select时候生成的ReadView**，也就是列表的值还是[100]。
所以select的结果还是是**张三1**，第二次select结果和第一次一样，所以叫可重复读！

**总结：读已提交隔离级别下的事务在每次查询开始都会生成一个新的ReadView，而可重复读隔离级别则在第一次读的时候生成一个ReadView，之后的读都复用之前的ReadView。**

### 当前读
* 当前读，读取的是记录的最新版本，会加锁，因为要保证其他事务不会再并发修改这些记录。
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

[https://www.cnblogs.com/rongdi/p/13378892.html](https://www.cnblogs.com/rongdi/p/13378892.html)

[https://juejin.cn/post/6844903844573380621](https://juejin.cn/post/6844903844573380621)
:::