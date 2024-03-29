# ActiveSupport::Concern源码解析
---

::: tip 使用目的

解决模块之间的依赖, 具体代码可以直接查看源码上面的注释

:::

### 源码分析前置说明
* 源码分析前，我们先看下两个方法，append_features和included

* 通过阅读 ruby 的文档和源码得知，ruby 在 include 一个 module 时，实际会触发两个方法，一个是 append_features，进行实际的 mixing 操作，
包括增加常量，方法和变量到模块中，另外一个是 included 方法，也就是我们常用来作为 include 钩子的方法，默认的 included 是一个空方法，
我们通过重载它使钩子起作用。

* 我们通过代码来看下两个的区别

```rb
module MyModule
  def self.append_features(base)
    puts "IN 'append_features':"
    puts "  - BEFORE execution: #{base.instance_methods.include? :some_method}"
    super
    puts "  - AFTER  execution: #{base.instance_methods.include? :some_method}"
  end

  def self.included(base)
    puts "IN 'included':  #{base.instance_methods.include? :some_method}"
  end

  def some_method() end
end

class MyClass
  include MyModule
end

# Output:
#
#   IN 'append_features':
#     - BEFORE execution: false
#     - AFTER  execution: true
#   IN 'included':  true
```

* 通过这个输出，我们能够看到append_features在included之前执行

### 源码分析(copy自ruby-2.5.1，puts是我加的，用于后面查看输出结果)

```rb
module Concern
  def self.extended(base)
    puts "#{base} extended #{self}, #{base} set :@_dependencies = []"
    base.instance_variable_set(:@_dependencies, [])
  end

  def append_features(base)
    if base.instance_variable_defined?(:@_dependencies)
      puts "append_features, #{base} @_dependencies << #{self}"
      base.instance_variable_get(:@_dependencies) << self
      false
    else
      return false if base < self
      @_dependencies.each { |dep| puts "append_features, #{base}.include #{dep}"; base.include(dep) }
      super
      base.extend const_get(:ClassMethods) if const_defined?(:ClassMethods)
      base.class_eval(&@_included_block) if instance_variable_defined?(:@_included_block)
    end
  end

  def included(base = nil, &block)
    if base.nil?
      if instance_variable_defined?(:@_included_block)
        if @_included_block.source_location != block.source_location
          raise MultipleIncludedBlocks
        end
      else
        @_included_block = block
      end
    else
      super
    end
  end

  def class_methods(&class_methods_module_definition)
    mod = const_defined?(:ClassMethods, false) ?
      const_get(:ClassMethods) :
      const_set(:ClassMethods, Module.new)

    mod.module_eval(&class_methods_module_definition)
  end
end
```

* 首先分析extended这个钩子方法，当一个模块去extend ActiveSupport::Concern便会触发，这时候base是当前模块，然后给这个模块设置@_dependencies变量，值为空数组（后面会用来存放它涉及到的依赖）

* 然后我们分析included，触发它有两种情况

  1. 一种是
     ```rb
     klass.include(module)
     ```
     这个时候base就是klass，然后执行super，相当于什么都没做。（ruby中定义的included本身是空方法，其实这里不调用super也可以，但是为了完整性还是加上）

  2. 另一种是
     ```rb
     included do

     end
     ```
     这个时候走上面的逻辑，设置@_included_block变量，值为传递的block（后面会调用这个block）

* 然后我们分析append_features，也是最关键的，它有两个逻辑分支

  1. 第一种，如果base定义了@_dependencies变量（也就是extend Concern)，就把自己加到base的@_dependencies中。
     ```rb
     module A
       extend Concern
       include B
     end
     # 这时候 A 的 @_dependencies = [B]
     ```

  2. 第二种，如果base没有定义@_dependencies变量（即没有extend Concern，其实base就是最终的类，对应下面的A）。
     ```rb
     class A
       include B
     end
     # 这时候循环 B 中的 @_dependencies，A一个个去include dep，然后走super，
     # 把 dep 里面的变量，方法，常量等加载到 A 中，
     # 最后把 dep 模块中的 ClassMethods 定义成 A 的类方法，
     # 再把 dep 模块上保存的 @_included_block 变量放到 A class_eval中执行
     ```

  3. 解释     
     1. return false if base < self 这行代码是为了避免重复include，所以判断了一下祖先链的一个继承关系
     ```rb
     class A
       include B
     end
     # A.ancestors => [A, B, Object, PP::ObjectMixin, Kernel, BasicObject]
     # 所以 A < B 返回 true
     ```

* 最后是我测试的用例，加了puts输出

```rb
puts '--------------Foo1 Module--------------'
module Foo1
  extend Concern
  included do
    def self.method_injected_by_foo
    end
  end
end

puts '--------------Foo2 Module--------------'
module Foo2
  extend Concern
  include Foo1
end

puts '--------------Bar Module--------------'
module Bar
  extend Concern
  include Foo2

  included do
    self.method_injected_by_foo
  end
end

puts '--------------Host Class--------------'
class Host
  include Bar
end
```


* 运行后我们直接看结果，就能很好的理解这个源码了

```rb
--------------Foo1 Module--------------
Foo1 extended Concern, Foo1 set :@_dependencies = []
--------------Foo2 Module--------------
Foo2 extended Concern, Foo2 set :@_dependencies = []
append_features, Foo2 @_dependencies << Foo1
--------------Bar Module--------------
Bar extended Concern, Bar set :@_dependencies = []
append_features, Bar @_dependencies << Foo2
--------------Host Class--------------
append_features, Host.include Foo2
append_features, Host.include Foo1
Host call Foo1 @_included_block
Host call Bar @_included_block
```

::: tip 参考链接

[http://xiewenwei.github.io/blog/2014/01/13/how-activesupport-corncern-work/](http://xiewenwei.github.io/blog/2014/01/13/how-activesupport-corncern-work/)
[https://gist.github.com/uzbekjon/34eb00c52668c2049ded](https://gist.github.com/uzbekjon/34eb00c52668c2049ded)

:::
