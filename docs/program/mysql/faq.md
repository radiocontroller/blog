# FAQ
---

### 1、如何解决回表查询

* 如果索引包含所有满足查询需要的数据的索引成为覆盖索引(Covering Index)，也就是平时所说的不需要回表操作。

* 假设（a，b）字段建立联合索引，以下sql：select id, b from t where a = 1；会用到覆盖索引，

* **注：遇到以下情况，执行计划不会选择覆盖查询**
  * 1.select选择的字段中含有不在索引中的字段。
  * 2.where条件中不能含有对索引进行like的操作。

### 2、Mysql中ACID的D是如何实现的
* 例如update t set name = 'xx' where id = 1这么一条数据Mysql是如何写到数据库中的

* 首先读取id为1所在页的数据到内存，然后修改内存中的数据，并写入到redo log中，这时就认为写入完成。
然后等到空闲的时候再刷到数据库中，这其中有一些优化，要比直接往库中写快一些，本质上还是提高磁盘IO效率。

### 3、Mysql中的MRR是什么
* [https://zhuanlan.zhihu.com/p/110154066](https://zhuanlan.zhihu.com/p/110154066)

### 4、索引下推

* **select * from where name like 'xx%' and age = 20 and sex = 'male';**

* 假如有（name，age）联合索引，但是以上sql只会用到name索引，然后获得id回表查询再过滤age和sex，而MySQL 5.6 引入的索引下推优化
（index condition pushdown)， 可以在索引遍历过程中，对索引中包含的字段先做判断，直接过滤掉不满足条件的记录，减少回表次数。即以上sql
先通过name查询出来的结果根据age过滤一次，然后回表去过滤sex，加快了查询的速度。

* explain中extra列为：Using Index Condition

### 5、SQL中过滤条件放在on和where中的区别
* 对于inner join都一样，对于左连接的话，会得到左表的所有数据。on不会过滤左表的信息，但是on能过滤右表信息。

* [https://pigfly88.github.io/mysql/2020/06/30/mysql-on-vs-where.html](https://pigfly88.github.io/mysql/2020/06/30/mysql-on-vs-where.html)

### 6、MDL元数据锁（metadata lock）
* [https://juejin.cn/post/6844904014769979400](https://juejin.cn/post/6844904014769979400)

### 7、数据库中表大小倒序排序
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

### 8、explain extra显示的索引扫描方式
* **using where：一般发生在全表扫描，或走了索引但是有些查询字段不在索引中的情况下，需要回表。它是MySQL服务器层面进行的一层where过滤**
* **using index condition：索引下推(需要回表)**
* **using index：使用了覆盖索引**