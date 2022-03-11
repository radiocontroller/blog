# Sql相关
---

### 1、分页查询优化(通过覆盖索引 + join)
```sql
原来：select * from flows order by type limit 1000000,20;

现在：select * from flows a inner join (select id from flows order by type limit 1000000,20) b on a.id = b.id;
```

### 2、FROM子查询优化
* 因为type的枚举值很多，直接根据给定的枚举值统计很慢，因此先统计再过滤枚举值

```sql
原来：select count(*) from flows where type in ('Flow::Income', 'Flow::Expenditure', 'Flow::Points', 'Flow::PartRefund');

现在：select sum(f.c) from (select type, count(*) as c from flows group by type) f where type in ('Flow::Income', 'Flow::Expenditure', 'Flow::Points', 'Flow::PartRefund');
```

### 3、列为null带来的影响
```sql
mysql> select * from users;
+----+--------+------+------+
| id | name   | age  | num  |
+----+--------+------+------+
|  1 | 张三   |    1 | 11   |
|  2 | NULL   |    2 | 22   |
|  3 | test1  | NULL | 33   |
|  4 | test2  |    4 | 44   |
|  5 | test3  |    5 | 55   |
|  6 | test4  |    6 | 66k  |
+----+--------+------+------+

1. name列为null，将不统计
mysql> select count(*), count(name) from users;
+----------+-------------+
| count(*) | count(name) |
+----------+-------------+
|        6 |           5 |
+----------+-------------+

2. name列或age列为null，将不统计
mysql> select count(distinct name,age) from users;
+--------------------------+
| count(distinct name,age) |
+--------------------------+
|                        4 |
+--------------------------+

3. name列为null，将不统计，null列需要用is null或者函数isnull判断
mysql> select * from users where name <> 'hello';
+----+--------+------+------+
| id | name   | age  | num  |
+----+--------+------+------+
|  1 | 张三   |    1 | 11   |
|  3 | test1  | NULL | 33   |
|  4 | test2  |    4 | 44   |
|  5 | test3  |    5 | 55   |
|  6 | test4  |    6 | 66k  |
+----+--------+------+------+
```
### 4. 当查询列和查询值类型不一致时，mysql会默认将字符串那一列转为数值一列
```sql
mysql> select cast('0345aabc123' as signed);
+-------------------------------+
| cast('0345aabc123' as signed) |
+-------------------------------+
|                           345 |
+-------------------------------+

mysql> select cast('aabc123' as signed);
+---------------------------+
| cast('aabc123' as signed) |
+---------------------------+
|                         0 |
+---------------------------+

mysql> select cast('a123abc' as signed);
+---------------------------+
| cast('a123abc' as signed) |
+---------------------------+
|                         0 |
+---------------------------+

总结：从字符串最前面开始读取数值，一直到字母。如果字符串一开始为字母，则为0
```

### 5、查询用户连续日期超过多少天（例如：超过4天）
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

### 6、[查询第二高的薪水（不存在返回null）](https://leetcode-cn.com/problems/second-highest-salary/)
* 薪水可能会重复，用distinct去重，然后使用limit 1, 1表示偏移量1，取1条

```sql
select ifNull((select distinct salary from Employee order by salary desc limit 1, 1), null) as SecondHighestSalary
```

### 7、[部门工资前三高的员工](https://leetcode-cn.com/problems/department-top-three-salaries)
* 利用子查询查找比当前工资高2位的数量，再加上自身，就是前三高

```sql
select d.name as Department, e1.name as Employee, e1.salary as Salary
from Employee e1 join Department d on e1.departmentId = d.id
where 3 > (
	select count(distinct e2.salary) from Employee e2 where e1.departmentId = e2.departmentId and e1.salary < e2.salary
)
```

### 8、[分数排名](https://leetcode-cn.com/problems/rank-scores/)

```sql
这种是用变量写的
select r.score, cast(r.rank as unsigned) as 'rank' from (
    select s.score, @row_num := case
                                    when @prev_score != -1 and @prev_score != s.score
                                        then @row_num + 1
                                    else @row_num
                                end as 'rank', @prev_score := s.score
    from Scores s, (select @row_num := 1, @prev_score := -1) t
    order by s.score desc
) r

比较直接，但有性能问题
SELECT Score,
 (SELECT count(DISTINCT score) FROM Scores WHERE score >= s.score) AS 'rank'
FROM Scores s
ORDER BY Score DESC;

最后可以用mysql高版本的四大排名函数中的dense_rank
SELECT Score,
dense_rank() over(order by Score desc) as 'rank'
FROM Scores
```
