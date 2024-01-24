# ruby/rails实用代码片段
---

#### Rails console 中 ActiveRecord 相关
```ruby
# 执行SQL
ActiveRecord::Base.connection.execute "your sql"

# 生产环境打印SQL及耗时
ActiveRecord::Base.logger = ActiveSupport::Logger.new(STDOUT)
```

#### Rails console 禁止多行输出
```shell
bin/rails console -e staging -- --nomultiline

bin/rails console -e production -- --nomultiline
```

#### 查看rspec最慢的10个
```shell
bin/rspec --profile 10
```

#### 用于创建密码的BCrypt gem, 我们可以直接使用它, 在Rails和Devise中都已经默认包含了
```ruby
def get_secure_password(password)
   BCrypt::Password.create(password).to_s
end

def check_password(password, hash)
  BCrypt::Password.new(hash) == password
end
```

#### 相当于java中的hashCode()
```ruby
def hash_code(str) 
  str.each_char.reduce(0) do |result, char| 
    [((result << 5) - result) + char.ord].pack('L').unpack('l').first 
  end 
end
```

#### ip地址和十进制转换
```ruby
require 'ipaddr'

IPAddr.new('1.2.3.4').to_i # => 16909060
IPAddr.new(16909060, Socket::AF_INET).to_s # => "1.2.3.4"
```

#### 经典概率算法
```ruby
def draw_prize(prizes = {})
  chance = prizes.values.sum
  prizes.each do |prize_id, prize_chance|
    rand_num = 1 + rand(chance)
    if rand_num <= prize_chance
      return prize_id
    else
      chance -= prize_chance
    end
  end
end
```

#### RSA相关
```ruby
# 公私钥生成（也可1024位）（pem文件就是pkcs1格式）
key = OpenSSL::PKey::RSA.generate(2048)
key.to_s            # 私钥
key.public_key.to_s # 公钥

# RSA私钥加签（pem格式）
@pri_key = OpenSSL::PKey::RSA.new(File.read('pem文件地址'))
digest = OpenSSL::Digest::SHA256.new
signature = URI.encode_www_form_component(Base64.strict_encode64(@pri_key.sign(digest, '待加签字符串')))

# RSA公钥验签（base64格式，也就是pem文件去掉行首和行尾，中间再把换行符去掉）
digest = OpenSSL::Digest::SHA256.new
@pub_key = 'MIIBIjANBgk...'
pkey = OpenSSL::PKey::RSA.new(Base64.decode64(@pub_key))
origin_signature = Base64.strict_decode64(URI.decode_www_form_component(signature))
pkey.verify(digest, origin_signature, '加签后的字符串')

# pkcs1转pkcs8（java一般都用pkcs8）
openssl pkcs8 -topk8 -inform PEM -in xx.pem -outform PEM -nocrypt 

# pkcs8转pkcs1
openssl rsa -in pkcs8.pem -out pkcs1.pem 

# 参考链接
https://blog.iany.me/zh/2017/11/read-various-rsa-keys-in-ruby/
https://www.cnblogs.com/LiuYanYGZ/p/12518002.html
```

#### Enumerator::Lazy
```ruby
# 正常情况下这么写是必须要等全部循环结束才会取前5个，而循环永远结束不了
(1..Float::INFINITY).select { |i| i % 3 == 0 }.reject(&:even?).first(5)

# 加了lazy后，按顺序处理，如果获取到了前5个就直接退出（注意：假设只能取到4个，取不到第5个，也会一直跑下去）
(1..Float::INFINITY).lazy.select { |i| i % 3 == 0 }.reject(&:even?).first(5)

# 参考链接
https://www.junmajinlong.com/ruby/ruby_enumerator/
https://bigbinary.com/blog/ruby-2-7-adds-enumerator-lazy-eager
```

#### in_groups_of(rails c环境下)
```ruby
(1..11).to_a.in_groups_of(5)
# [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, nil, nil, nil, nil]]

(1..11).to_a.in_groups_of(5, false)
# [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11]]
```

#### 重试器
```ruby
# 重试器(默认重试1次，间隔1秒，可传参配置)
class Retryer
  DEFAULT_RETRY_TIMES = 1
  DEFAULT_RETRY_DELAY = 1
  DEFAULT_RESCUE_ERROR = StandardError

  class << self
    # source可以随便传，用于日志打印
    def call(rescue_error: nil, before_retry: nil, retry_times: nil, retry_delay: nil, source: nil)
      raise "block not given" unless block_given?

      rescue_error ||= DEFAULT_RESCUE_ERROR
      retry_times ||= DEFAULT_RETRY_TIMES
      retry_delay ||= DEFAULT_RETRY_DELAY
      begin
        yield
      rescue rescue_error => ex
        retry_times -= 1
        sleep retry_delay
        if retry_times >= 0
          before_retry.call if before_retry&.respond_to?(:call)
          Rails.logger.info("=== retrying #{source} ===")
          retry
        end
        raise ex
      end
    end
  end
end

# 使用
Retryer.call { RestClient.get('https://github.com/radiocontroller/blog') }
```
