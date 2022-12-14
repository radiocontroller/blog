# searchkick使用
* [https://github.com/ankane/searchkick](https://github.com/ankane/searchkick)
---

### 基本用法
```ruby
class Account < ApplicationRecord
  has_one :idcard

  searchkick word_start: %i[name],
             searchable: %i[name],              # searchable用在搜索关键字的时候
             filterable: %i[region],            # filterable用在where过滤的时候
             batch_size: 5000,                  # 批量reindex的数量
             settings: { number_of_shards: 3, number_of_replicas: 5 }, # 分片数量，副本数量
             callbacks: false,                  # 关闭自动同步，用下面的手动同步
             language: "chinese"                # 语言

  scope :search_import, -> { includes(:point) } # 批量建立索引时避免N+1

  after_commit do
    # :async表示异步建立索引，会通过ReindexV2Job执行，注意配置sidekiq queue
    reindex(mode: Rails.env.development? || :async)
  end

  def search_data                     # 表示建立索引的数据
    slice(:name, :region).merge(idcard_number: idcard.number)
  end

  def should_index?                   # 该记录能否建立索引
    true
  end
end

Account.search(
  "Tom",                    # 查询全部用 "*"
  where: { region: "cn" },  # where条件
  load: false               # 表示返回所有数据，否则只返回id，需要自己再查数据库
)
```
---

### 一些命令
```ruby
# 可通过rake进行重建索引
bundle exec rake searchkick:reindex CLASS=Account &

# rails c
# 可以看到关键字是怎么被分词的（可以修改分词器模式）
Game.search_index.tokens("荒野大镖客", analyzer: "searchkick_index")
=> ["荒野", "大", "镖客"]

Game.search_index.tokens("荒野大镖客", analyzer: "searchkick_search")
=> ["荒野", "大", "镖客"]

Game.search_index.tokens("荒野大镖客", analyzer: "searchkick_search2")
=> ["荒野", "大", "镖客"]
```
* [ik_max_word和ik_smart的区别](https://zhuanlan.zhihu.com/p/52543633)
---

### 缺陷
* searchkick利用异步ReindexV2Job执行时，是没有版本号或者时间戳的机制去保证更新的顺序。
比如一个订单状态连续更新了两次，会触发两个ReindexV2Job执行，正常情况状态更新顺序为：A -> B -> C。假如第一个job开始执行，但是第一个job在第二个job后结束，也就是说ES中的订单状态其实是先更新成C，再更新为B，结果导致最终订单状态有误。
---

### 提高性能方面
```ruby
gem "oj"        # json序列化
gem "typhoeus"  # 持久化HTTP连接
```
