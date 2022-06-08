# 本地Mysql连接不上
---

### 1. 问题描述
* Rails连接数据库时提示：Lost connection to MySQL server at 'reading initial communication packet', system error: 0 (Mysql2::Error::ConnectionError)
* 数据库配置文件 config/database.yml

```
defaults: &defaults
  adapter: mysql2
  collation: utf8_general_ci
  encoding: utf8
  username: root
  host: 127.0.0.1
  pool: 5

test:
  <<: *defaults
  database: songuo_test
```

* Mysql配置文件 /usr/local/etc/my.cnf

```
# Default Homebrew MySQL server config
[mysqld]
# Only allow connections from localhost
bind-address = 127.0.0.1
```

### 2. 问题原因
* 通过查看数据库用户信息发现，root用户的Host为localhost，并不是上面使用的127.0.0.1

```
mysql> SELECT User, Host FROM mysql.user;
+---------------+-----------+
| User          | Host      |
+---------------+-----------+
| root          | localhost |
| primary_read  | localhost |
| primary_root  | localhost |
+---------------+-----------+
```

### 3. 解决方法
* 把root用户的Host改成127.0.0.1

```
mysql> update mysql.user set Host = '127.0.0.1' where User = 'root';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```
