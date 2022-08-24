# kafka常用命令
---

### [Topics CLI](https://www.conduktor.io/kafka/kafka-topics-cli-tutorial)
```shell
# 查看topic list
# 可选参数：--exclude-internal
kafka-topics --bootstrap-server localhost:9092 --list

# 查看某个topic
kafka-topics --bootstrap-server localhost:9092 --describe --topic yourTopic

# 创建topic
kafka-topics --bootstrap-server localhost:9092 --topic yourTopic --create --partitions 3 --replication-factor 1

# 删除topic
kafka-topics --bootstrap-server localhost:9092 --delete --topic yourTopic
```

### [Producer CLI](https://www.conduktor.io/kafka/kafka-producer-cli-tutorial)
```shell
# 生产消息(如果没有topic会自动创建，并配置默认的paritions数和副本数)
kafka-console-producer --bootstrap-server localhost:9092 --topic yourTopic

# 使用文件生产消息
kafka-console-producer --bootstrap-server localhost:9092 --topic yourTopic < topic-input.txt
```

### [Consumer CLI](https://www.conduktor.io/kafka/kafka-consumer-cli-tutorial)
```shell
# 消费消息(--from-beginning 表示从头拉取消息)
kafka-console-consumer --bootstrap-server localhost:9092 --topic yourTopic --from-beginning
```
