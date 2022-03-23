# Mutex和ConditionVariable
#### Mutex: 互斥锁
#### ConditionVariable: 条件变量
---

## 两个线程交替打印数字

```ruby
mutex = Mutex.new
resource = ConditionVariable.new

t1 = Thread.new {
	i = 1
	while i < 100 do
		mutex.synchronize {
			resource.wait(mutex) # 当前线程休眠，等待被唤醒
			puts "i = #{i}"
			resource.signal      # 唤醒一个等待该互斥锁的线程
		}
		i += 2
	end
}

t2 = Thread.new {
	i = 2
	while i <= 100 do
		mutex.synchronize {
			resource.signal      # 唤醒一个等待该互斥锁的线程
			resource.wait(mutex) # 当前线程休眠，等待被唤醒
			puts "i = #{i}"
		}
		i += 2
	end
}
```
