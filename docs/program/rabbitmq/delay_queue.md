# 延时任务

#### 借助RabbitMQ的死信队列可以实现延时任务，比如5分钟后取消订单
---

### 1. 实现原理
![](/images/program/rabbitmq/delay_queue1.png)

* 1. 创建一个普通交换器和队列，并且队列设置如下参数
  * x-dead-letter-exchange: 死信交换器，也就是消息不被消费并且过期时转发的交换器
  * x-dead-letter-routing-key: 路由键，和死信交换器相关
  * x-message-ttl: 队列消息过期时间（最终消息的过期时间会取该时间与消息自身过期时间的最小值）
* 2. 创建上面提到的死信交换器和死信队列，并设置routing_key
* 3. 只要消费者不去消费普通队列，那么队列中的消息就会过期，然后会被转发到死信交换器绑定的死信队列

### 2. ruby代码

```ruby
# 封装一下连接
class RabbitMQ
  class << self
    def connection
      @connection ||= Bunny.new('amqp://guest:guest@localhost:5672').start
    end

    def channel
      @channel = connection.create_channel
      @channel.confirm_select
      @channel
    end

    def direct(name, option = {})
      channel.direct(name, option)
    end
  end
end
```

```ruby
STDOUT.sync = true

BIZ_EX = 'direct.biz'   # 业务交换器
BIZ_QUEUE = "queue.biz" # 业务队列

DLX_EX = 'direct.dlx'   # 死信交换器
DLX_QUEUE = "queue.dlx" # 死信队列

ex_biz = RabbitMQ.direct(BIZ_EX, { durable: true })
ex_dlx = RabbitMQ.direct(DLX_EX, { durable: true })

channel = RabbitMQ.channel
q1 = channel.queue(BIZ_QUEUE, durable: true, arguments: {
  "x-dead-letter-exchange" => DLX_EX,
  'x-dead-letter-routing-key' => 'key.dlx',
  'x-message-ttl' => 60 * 1000  # 队列消息统一设定1分钟过期时间（最终消息的过期时间会取该时间与消息自身过期时间的最小值）
  }
)
q2 = channel.queue(DLX_QUEUE, durable: true)

q1.bind(BIZ_EX, routing_key: "key.biz") # 业务队列绑定业务交换器，但是不去消费，让消息过期

q2.bind(DLX_EX, routing_key: "key.dlx").subscribe do |delivery_info, metadata, payload|
  puts "dlx queue Received #{payload}, #{Time.now}"
end

puts "#{Time.now}"

# 生产者消息发到业务交换器上，然后会转发到死信交换器绑定的队列中进行消费（6*1000代表6秒）
ex_biz.publish({msg: 'hello'}.to_json, expiration: 6*1000, routing_key: 'key.biz')
```

* 如下是RabbitMQ管理页面看到的队列信息

![](/images/program/rabbitmq/delay_queue2.png)

* TTL代表有过期时间，DLX代表绑定了死信队列，DLK代表转发私信队列的routing_key

::: tip 参考链接

[https://juejin.cn/post/6998325022112612388](https://juejin.cn/post/6998325022112612388)

:::
