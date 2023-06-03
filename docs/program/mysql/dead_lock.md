# MySQL死锁原因与解决方案
---

#### 1. 两个事务交替更新
* 例如事务A先更新记录1，再更新记录2，而事务B先更新记录2，再更新记录1，此时事务B发生死锁直到超时

#### 2. 索引不当导致的死锁
* 如果在事务中执行了一条不满足条件的语句，执行全表扫描，把行级锁上升为表级锁，多个这样的事务执行后，就很容易产生死锁和阻塞。

#### 3. 外键也有可能导致死锁
* 报错类型：Mysql2::Error: Deadlock found when trying to get lock; try restarting transaction
* 发生过程如下
  1. session1插入ignores记录，其中operator_id是关联users表id的外键，因为有外键，此时会对用户id: 9加S锁
  ```
  INSERT INTO `ignores` (`operator_id`, `target_id`, `reason`, `created_at`, `updated_at`) VALUES (9, 1, 1, now(), now());
  ```
  2. 此时另一个session2对id: 9这个用户进行update，获取X锁，但是X锁和S锁不能共存，因此这里发生等待
  ```
  UPDATE users SET status = 1 WHERE id = 9;
  ```
  3. session1再对operator_id: 9进行更新，此时S锁会升级为X锁，但是因为session2在等session1，因此session1又会等session2，最终发生死锁，session2报错

#### 4. [避免死锁方式](https://www.jianshu.com/p/7401cb087651)
  * 以固定的顺序进行更新，这样就不会造成互相等待锁的场面。
  * 大事务拆小。大事务更倾向于死锁，如果业务允许，将大事务拆小。
  * 为表添加合理的索引。如果不走索引将会为表的每一行记录添加上锁，死锁的概率大大增大。
  * 不用外键
  * show engine innodb status可排查死锁日志(Rails可通过以下命令打印)
    ```
    ActiveRecord::Base.connection.execute("SHOW ENGINE INNODB STATUS").each{|row| puts row}
    ```
