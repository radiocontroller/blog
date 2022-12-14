# MySQL死锁原因与解决方案
---

#### 1. 两个事务交替更新
* 例如事务A先更新记录1，再更新记录2，而事务B先更新记录2，再更新记录1，此时事务B发生死锁直到超时

#### 2. 索引不当导致的死锁
* 如果在事务中执行了一条不满足条件的语句，执行全表扫描，把行级锁上升为表级锁，多个这样的事务执行后，就很容易产生死锁和阻塞。

#### 3. [避免死锁方式](https://www.jianshu.com/p/7401cb087651)
  * 以固定的顺序进行更新，这样就不会造成互相等待锁的场面。
  * 大事务拆小。大事务更倾向于死锁，如果业务允许，将大事务拆小。
  * 为表添加合理的索引。如果不走索引将会为表的每一行记录添加上锁，死锁的概率大大增大。
  * show engine innnodb status可排查死锁日志