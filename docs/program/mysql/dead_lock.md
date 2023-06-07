# MySQL死锁原因与解决方案
---

#### 1. 两个事务交替更新导致的死锁
* 例如事务A先更新记录1，再更新记录2，而事务B先更新记录2，再更新记录1，此时事务B发生死锁直到超时

#### 2. 索引不当导致的死锁
* 如果在事务中执行了一条不满足条件的语句，执行全表扫描，把行级锁上升为表级锁，多个这样的事务执行后，就很容易产生死锁和阻塞。

#### 3. 使用外键导致的死锁
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

#### 4. 插入意向锁和X锁导致的死锁
* user_id是普通索引，加锁过程在[快照读和当前读](/program/mysql/read.html)这一章里有
![insert_dead_lock](/images/program/mysql/insert_dead_lock.png)

#### 5. 索引合并导致的死锁
* 索引合并是mysql5.0引入的优化，通过两个单独的索引查询结果，再取交集(查询过程中会锁定记录)
* 例如:
```
update t set col = "xx" where a = 1 and b = 2;
update t set col = "xx" where a = 2 and b = 1;
```
* 看似两条sql毫无关联，但仔细分析一下，如果b = 1查出来的记录和a = 1查出来有交集，b = 2的记录和a = 2查出来有交集，那么双方不就互相等待导致死锁了？

#### 6. 批量update导致的死锁

#### 7. [避免死锁方式](https://www.jianshu.com/p/7401cb087651)
  * 以固定的顺序进行更新，这样就不会造成互相等待锁的场面。
  * 大事务拆小。大事务更倾向于死锁，如果业务允许，将大事务拆小。
  * 为表添加合理的索引。如果不走索引将会为表的每一行记录添加上锁，死锁的概率大大增大。
  * 不用外键
  * 注意删除和插入的并发

#### 8. 排查死锁方式
  * show engine innodb status \G; 可以打印出最近发生的死锁信息 (Rails可通过以下命令打印)
    ```
    ActiveRecord::Base.connection.execute("SHOW ENGINE INNODB STATUS").each{|row| puts row};nil
    ```

::: tip 参考链接
[https://developer.huawei.com/consumer/cn/forum/topic/0201501471361920091](https://developer.huawei.com/consumer/cn/forum/topic/0201501471361920091)
:::
