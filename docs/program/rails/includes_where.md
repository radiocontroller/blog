# includes和where搭配的小问题
---

### 模型定义
```ruby
class CartGame < ApplicationRecord
  belongs_to :cart
  belongs_to :sku, class_name: 'Game', foreign_key: :game_id
  delegate :account, to: :cart
end

class Game < ApplicationRecord
  enum cate: %i[game physical wallet iap virtual]
end

class Account < ApplicationRecord
  has_one :cart
  has_many :cart_skus, through: :cart
end
```

* 问题描述：想获取某个用户下面购物车中周边类型的购物车信息，我们一般会这么写
```ruby
# where后面用games而不是skus，是因为games对应的是实际的表名
account.cart_skus.includes(:sku).where(games: { id: [4783, 2758], cate: :physical }).count
```

* 生成SQL如下
```SQL
SELECT COUNT(DISTINCT `cart_games`.`id`)
FROM `cart_games`
LEFT OUTER JOIN `games` ON `games`.`id` = `cart_games`.`game_id`
INNER JOIN `carts` ON `cart_games`.`cart_id` = `carts`.`id`
WHERE `carts`.`account_id` = 2 AND `games`.`id` IN (4783, 2758) AND `games`.`cate` = 'physical'
```

* 到这里已经发现问题了，就是SQL最后 games.cate = 'physical'，而cate在games表中其实是int类型，
所以应该变成 games.cate = 1，这样才对。

* 解决方式：在CartGame里面加上原始game的关联
```ruby
belongs_to :game
```
