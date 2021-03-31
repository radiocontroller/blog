# Sql相关
---

### 1、分页查询优化(通过覆盖索引 + join)
* 原来：**select * from flows order by type limit 1000000,20;**
* 现在：**select * from flows a inner join (select id from flows order by type limit 1000000,20) b on a.id = b.id;**

### 2、FROM子查询优化
* 原来：**select count(*) from flows where type in ('Flow::Income', 'Flow::Expenditure', 'Flow::Points', 'Flow::PartRefund');**
* 现在：**select sum(f.c) from (select type, count(*) as c from flows group by type) f where type in ('Flow::Income', 'Flow::Expenditure', 'Flow::Points', 'Flow::PartRefund');**

### 3、查询用户连续日期超过多少天（例如：超过4天）
* 可用于场景：查询最近3年内连续24个月缴纳社保的用户

<details>

<summary>点击展开</summary>

```sql
mysql> select * from shebao;
+----+---------+------------+
| id | user_id | date       |
+----+---------+------------+
|  1 |       1 | 2021-03-01 |
|  2 |       1 | 2021-03-02 |
|  3 |       1 | 2021-03-03 |
|  4 |       1 | 2021-03-04 |
|  5 |       1 | 2021-03-05 |
|  6 |       1 | 2021-02-01 |
|  7 |       1 | 2021-03-07 |
|  8 |       1 | 2021-03-08 |
|  9 |       1 | 2021-03-09 |
| 10 |       1 | 2021-03-10 |
| 11 |       2 | 2021-03-10 |
| 12 |       2 | 2021-03-11 |
| 13 |       2 | 2021-03-12 |
| 14 |       2 | 2021-03-13 |
| 15 |       2 | 2021-03-14 |
| 16 |       2 | 2021-03-15 |
| 17 |       2 | 2021-03-15 |
+----+---------+------------+

SELECT user_id, max(days) AS conti_days, min(dt) AS start_date
	, max(dt) AS end_date
FROM (
	SELECT user_id
		, @conti_day := CASE
			WHEN @last_uid = user_id
				AND DATEDIFF(date, @last_dt) = 1
			THEN @conti_day + 1
			WHEN @last_uid = user_id
				AND DATEDIFF(date, @last_dt) < 1
			THEN @conti_day + 0
			ELSE 1
		END AS days
		, @conti_count := @conti_count + IF(@conti_day = 1, 1, 0) AS conti_count
		, @last_uid := user_id, @last_dt := date AS dt
	FROM (
		SELECT user_id, date
		FROM shebao
		ORDER BY user_id, date
	) t, (
			SELECT @last_uid := '', @last_dt := '', @conti_count := 0, @conti_day := 0
		) t1
) t2
GROUP BY user_id, conti_count
HAVING conti_days > 4
ORDER BY conti_days DESC;

内部子查询结果为
+---------+------+-------------+----------------------+------------+
| user_id | days | conti_count | @last_uid := user_id | dt         |
+---------+------+-------------+----------------------+------------+
|       1 |    1 |           1 |                    1 | 2021-02-01 |
|       1 |    1 |           2 |                    1 | 2021-03-01 |
|       1 |    2 |           2 |                    1 | 2021-03-02 |
|       1 |    3 |           2 |                    1 | 2021-03-03 |
|       1 |    4 |           2 |                    1 | 2021-03-04 |
|       1 |    5 |           2 |                    1 | 2021-03-05 |
|       1 |    1 |           3 |                    1 | 2021-03-07 |
|       1 |    2 |           3 |                    1 | 2021-03-08 |
|       1 |    3 |           3 |                    1 | 2021-03-09 |
|       1 |    4 |           3 |                    1 | 2021-03-10 |
|       2 |    1 |           4 |                    2 | 2021-03-10 |
|       2 |    2 |           4 |                    2 | 2021-03-11 |
|       2 |    3 |           4 |                    2 | 2021-03-12 |
|       2 |    4 |           4 |                    2 | 2021-03-13 |
|       2 |    5 |           4 |                    2 | 2021-03-14 |
|       2 |    6 |           4 |                    2 | 2021-03-15 |
|       2 |    6 |           4 |                    2 | 2021-03-15 |
+---------+------+-------------+----------------------+------------+

最终查询结果为
+---------+------------+------------+------------+
| user_id | conti_days | start_date | end_date   |
+---------+------------+------------+------------+
|       2 |          6 | 2021-03-10 | 2021-03-15 |
|       1 |          5 | 2021-03-01 | 2021-03-05 |
+---------+------------+------------+------------+
```

</details>

* 参考 [MySQL中row_number的实现](https://www.jianshu.com/p/32e8c40372b3)