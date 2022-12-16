# 元数据锁MDL
---

#### 一. 简介
* **DQL**：指数据库中的select操作。
* **DML**：指数据库中的insert、update、delete等数据变更操作。
* **DDL**：指数据库中add column、change column、create index、drop index、drop table、truncate table等表结构定义操作。

#### 二. MDL锁介绍
* 从MySQL5.5版本开始引入了MDL锁，全称为metadata lock，即元数据锁。
MDL锁的主要作用是维护表 **元数据** 的数据一致性。当表上有活动事务（注意MDL锁伴随事务提交而释放）的时候，
不可以对元数据（即表结构）进行 **任何修改** 操作。
* PS：**MDL共享锁 = MDL读锁 = MDL S锁， MDL排他锁 = MDL写锁 = MDL X锁**，**S锁和S锁共享，S锁和X锁互斥**

![mvcc](/images/program/mysql/metadata_lock.png)

* 简单来说，**DDL操作** 会申请对应表上的的 **MDL X锁**，一旦申请成功，该表上的其他所有操作都无法进行（包括**DDL、DML、DQL**），因为无法再申请到该表上的MDL锁，直到 **DDL操作** 申请的 **MDL X锁** 释放为止。

* 而 **DML或DQL操作** 都只会申请 **MDL S锁**，S锁为共享锁，可以支持并发访问，因此大量相同表上的增删改查操作是可以并发执行的。

#### 三. MDL锁实验

#### 实验1. 先DML，再DDL，再DQL

| session A                          | session B                                     | session C                          |
|:----------------------------------:|:---------------------------------------------:|:----------------------------------:|
| begin;                             |                                               |                                    |
| select * from orders where id = 1; |                                               |                                    |
|                                    | alter table orders add column col tinyint(2); |                                    |
|                                    |                                               | select * from orders where id = 2; |

* 这时候 **session B和session C** 都会阻塞，因为 A 先拿到 **MDL S锁**，而 B 需要申请 **MDL X锁**，因此 B 会阻塞。
由于 **MDL锁** 申请遵循一个**优先机制**，即 **X锁** 要优先于 **S锁** 获取，因此 C不能拿到 **S锁**，所以 C 也会阻塞。
此时只有等 **session A** 事务提交或者回滚之后，B 和 C 才能继续执行。

#### 实验2. 先DDL，再DML（或DQL）

| session A                                     | session B                          |
|:---------------------------------------------:|:----------------------------------:|
| alter table orders add column col tinyint(2); |                                    |
|                                               | begin;                             |
|                                               | select * from orders where id = 1; |

* **session A** 执行 DDL 到一半，**session B** 打开事务查询，这时候 **session A和session B**都会阻塞。
因为 **session A** 申请到了 **MDL X锁** 后降级为 **MDL S锁**，然后开始执行 DDL操作，**session B** 也拿到了 **MDL S锁** 进行 DML操作，这时候大家都是持有的 **MDL S锁**，并不存在冲突。
* 过了一会当 **session A DDL操作** 完成后，想要从 **MDL S锁** 升级到 **MDL X锁** 进行 COMMIT 时，发现无法申请到，因为这时候SELECT查询还占用着 **MDL S锁**，所以处于Waiting for table metadata lock状态。

#### 四. 总结
  * 不要在业务高峰期间去做 **DDL操作**
  * 可以通过 **show processlist;** 查看数据库状态

::: tip 参考链接

[https://www.cnblogs.com/timePasser-leoli/p/14845168.html](https://www.cnblogs.com/timePasser-leoli/p/14845168.html)

:::
