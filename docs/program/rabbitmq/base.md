# 基本概念
---

### 1. 基本概念
* **Message**: 消息
* **Publisher**: 生产者
* **Consumer**: 消费者
* **Exchange**: 交换器，接收生产者发送的消息并将消息路由给队列。
* **Binding**: 绑定，用于队列和交换器之间的关联。
* **Queue**: 队列，用来保存消息直到发送给消费者。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。
* **Connection**: 网络连接，比如一个TCP连接。
* **Channel**: 信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内地虚拟连接，AMQP 命令都是通过信道发出去的，
不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说建立和销毁 TCP 都是非常昂贵的开销，所以引入了信道的概念，以复用一条 TCP 连接。
* **Virtual Host**: 虚拟主机，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。
每个 vhost 本质上就是一个 mini 版的 RabbitMQ 服务器，拥有自己的队列、交换器、绑定和权限机制。
vhost 是 AMQP 概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是 / 。
* **Broker**: 表示消息队列服务器实体。

### 2、Exchange常用类型
* **fanout**: 把所有发送到该Exchange的消息投递到所有与它绑定的队列中。
* **direct**: 把消息投递到那些binding key与routing key**完全匹配**的队列中。
* **topic**: 将消息路由到binding key与routing key**模式匹配**的队列中。

### 3、exchange、bingding key、routing key
* 在绑定Exchange与Queue的同时，一般会指定一个binding key。在绑定多个Queue到同一个Exchange的时候，这些Binding允许使用相同的binding key。
生产者在将消息发送给Exchange的时候，一般会指定一个routing key，通过指定routing key来决定消息流向哪里。

### 4、多个消费者订阅同一个队列
* 这时队列中的消息会被**平均分摊**给多个消费者进行处理，而不是每个消费者都收到所有消息。
![](/images/program/rabbitmq/1.png)

### 5、多个消费者订阅不同队列
* 假如exchange和routing_key都一样的情况下，每个消费者都会收到所有消息。
![](/images/program/rabbitmq/2.png)
