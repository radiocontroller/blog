# before_action原理
---

### 利用到了prepend
```ruby
module BeforeAction
  def self.included(klass)
    klass.extend(ClassMethods)
  end

  module ClassMethods
    def before_action(method_name, options)
      action_module = Module.new do
        send :define_method, options[:for] do |*args, &block|
          send method_name

          super(*args, &block)
        end
      end

      prepend action_module # 这里很关键
    end
  end
end

class Speaker
  include BeforeAction

  before_action :chinese_self_intro, for: :speak

  def speak
    puts 'I am speaking...'
  end

  private

  def chinese_self_intro
    puts 'Hello, I come from china.'
  end
end

Speaker.new.speak
# 下面是输出结果
# Hello, I come from china.
# I am speaking...
```

* **解释：** before_action方法定义了一个模块，并通过prepend把这个模块加到Speaker的祖先链前面。
因此在调用Speaker.new.speak时，根据向右再向上规则会先调用这个模块中定义的options[:for]方法，
也就是speak方法，然后在里面动态调用chinese_self_intro，最后再通过super调用Speaker类中的speak方法。
