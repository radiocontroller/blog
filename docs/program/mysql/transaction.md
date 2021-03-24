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
> 我认为是解决了的，并且是【当前读】的幻读，具体原因看MVCC一章
  
### 4、串行化（serializable）

* 它是最高的隔离级别，它通常通过强制事务串行，避免了前面的所有问题。
    
::: tip 关于幻读

[https://github.com/Yhzhtk/note/issues/42](https://github.com/Yhzhtk/note/issues/42)

[https://www.jianshu.com/p/97f2a6e8f57c](https://www.jianshu.com/p/97f2a6e8f57c)

:::