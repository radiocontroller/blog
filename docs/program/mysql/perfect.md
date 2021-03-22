# Sql优化
---

### 1、分页查询优化(通过覆盖索引 + join)
* 原来：**select * from flows order by type limit 1000000,20;**
* 现在：**select * from flows a inner join (select id from flows order by type limit 1000000,20) b on a.id = b.id;**

### 2、FROM子查询优化
* 原来：**select count(*) from flows where type in ('Flow::Income', 'Flow::Expenditure', 'Flow::Points', 'Flow::PartRefund');**
* 现在：**select sum(f.c) from (select type, count(*) as c from flows group by type) f where type in ('Flow::Income', 'Flow::Expenditure', 'Flow::Points', 'Flow::PartRefund');**