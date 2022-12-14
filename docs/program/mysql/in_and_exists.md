# 区分in和exists
---

```sql
select * from 表A where id in (select id from 表B)
```

#### 上面sql语句相当于

```sql
select * from 表A where exists (select * from 表B where 表B.id=表A.id)
```

#### 区分in和exists主要是造成了驱动顺序的改变（这是性能变化的关键）
* 如果是exists，那么以外层表为驱动表，先被访问
* 如果是in，那么先执行子查询（内层查询）
* 所以exists适合于外表小而内表大的情况，in适合于外表大而内表小的情况

::: tip 参考链接

[https://mp.weixin.qq.com/s/pOMoV1nH1WFuFqDBz_gvJw](https://mp.weixin.qq.com/s/pOMoV1nH1WFuFqDBz_gvJw)

:::
