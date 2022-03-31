# FAQ
---

### 1、如何解决回表查询

* 如果索引包含所有满足查询需要的数据的索引成为覆盖索引(Covering Index)，也就是平时所说的不需要回表操作。

* 假设（a，b）字段建立联合索引，以下sql：select id, b from t where a = 1；会用到覆盖索引，

### 2、Mysql中ACID的D是如何实现的
* 例如 update t set name = 'xx' where id = 1 这么一条数据Mysql是如何写到数据库中的

* 首先读取id为1所在页的数据到内存中(如果内存中不存在)，然后修改内存中的数据，并写入到redo log中，这时就认为写入完成。
然后等到空闲的时候再刷到磁盘中。

### 3、Mysql中的MRR是什么
* 简单说：MRR 通过把「随机磁盘读」，转化为「顺序磁盘读」，从而提高了索引查询的性能。

* [https://zhuanlan.zhihu.com/p/110154066](https://zhuanlan.zhihu.com/p/110154066)

### 4、索引下推

* **select * from where name like 'xx%' and age = 20 and sex = 'male';**

* 假如有（name，age）联合索引，但是以上sql只会用到name索引，然后获得id回表查询再过滤age和sex，而MySQL 5.6 引入的索引下推优化
（index condition pushdown)， 可以在索引遍历过程中，对索引中包含的字段先做判断，直接过滤掉不满足条件的记录，减少回表次数。即以上sql
先通过name查询出来的结果根据age过滤一次，然后回表去过滤sex，加快了查询的速度。

* explain中extra列为：Using Index Condition

### 5、SQL中过滤条件放在on和where中的区别
* on是在生成临时表时过滤，而where是在生成临时表之后过滤。
* 对于inner join它们都一样。但是对于左连接，on始终会得到左表的所有数据，on只会过滤右表数据(右连接同理)，而此时where会过滤条件不符合的数据，只保留条件符合的数据。

* [https://pigfly88.github.io/mysql/2020/06/30/mysql-on-vs-where.html](https://pigfly88.github.io/mysql/2020/06/30/mysql-on-vs-where.html)

### 6、数据库中表大小倒序排序
```sql
SET @table=(SELECT DATABASE());
select @table;
SELECT
     table_schema as `Database`,
     table_name AS `Table`,
     round(((data_length + index_length) / 1024 / 1024), 2) `Size in MB`
FROM information_schema.TABLES
WHERE table_schema = @table
ORDER BY (data_length + index_length) DESC;
```

### 7、explain extra显示的索引扫描方式
* **using where：一般发生在全表扫描，或走了索引但是有些查询字段不在索引中的情况下，需要回表。它是MySQL服务器层面进行的一层where过滤**
* **using index condition：索引下推(需要回表)**
* **using index：使用了覆盖索引**

### 8、MySQL InnoDB锁原理
* [https://zhuanlan.zhihu.com/p/58695491](https://zhuanlan.zhihu.com/p/58695491)

### 9、删除
* 在 InnoDB 的删除操作实现中通常实现为伪删除，仅仅标记delete flag并未真正地物理删除记录，所以需要在Purge阶段对记录和相关索引进行清理.

### 10、MDL（元数据锁）
* 当修改表结构时，例如增删改字段时，会触发MDL锁
* 1. 假如session1，在事务中先select，那么session2中执行增删改字段会阻塞，直到session1事务提交，否则session1前后select得到的结果会不一致
* 2. 假如session1，先执行增删改字段，在这之间session2执行select，不会阻塞，但是会过滤掉session1中修改字段不为null的数据（但是session2执行更新就会阻塞）
* [https://juejin.cn/post/7038096395248599053](https://juejin.cn/post/7038096395248599053)

### 11、MySQL死锁原因与解决方案
* 1. 两个事务交替更新; 例如事务A先2记录，事务B先更新1记录，事务A更新1记录，然后事务B再更新2记录，此时事务B发生死锁直到超时
* 2. 索引不当导致的死锁; 如果在事务中执行了一条不满足条件的语句，执行全表扫描，把行级锁上升为表级锁，多个这样的事务执行后，就很容易产生死锁和阻塞。
* 避免死锁方式
  * 以固定的顺序进行更新，这样就不会造成互相等待的场面。
  * 大事务拆小。大事务更倾向于死锁，如果业务允许，将大事务拆小。
  * 为表添加合理的索引。如果不走索引将会为表的每一行记录添加上锁，死锁的概率大大增大。
* [https://www.jianshu.com/p/7401cb087651](https://www.jianshu.com/p/7401cb087651)
* show engine innnodb status可排查死锁日志

### 12、ON_DUPLICATE_KEY_UPDATE
* [https://www.jianshu.com/p/bd32a8a56b0f](https://www.jianshu.com/p/bd32a8a56b0f)
