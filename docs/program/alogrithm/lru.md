# LRU
#### Least Recently Used
---

### [LRU 缓存机制](https://leetcode-cn.com/problems/lru-cache/)
* LRU在mysql, redis等等系统中使用频率非常高，这个是一个最简单的demo
* 利用链表 + 哈希表解决
* 时间复杂度：对于 put 和 get 都是 O(1)
* 空间复杂度：O(capacity)


<details>

<summary>点击展开ruby实现</summary>

```ruby
class Node
    attr_accessor :prev, :next, :key, :value
    def initialize(key = nil, value = nil)
        @key = key
        @value = value
    end
end

class LRUCache
    attr_accessor :head, :tail, :size, :capacity, :cache

    def initialize(capacity)
        @size = 0
        @capacity = capacity
        @cache = {}
        @head = Node.new
        @tail = Node.new
        @head.next = @tail
        @tail.prev = @head
    end

    def get(key)
        node = @cache[key]
        if node
            move_to_head(node)
            node.value
        else
            -1
        end
    end

    def put(key, value)
        node = @cache[key]
        if node
            node.value = value
            move_to_head(node)
        else
            node = Node.new(key, value)
            @cache[key] = node
            add_to_head(node)
            @size += 1
            if @size > @capacity
                @cache[@tail.prev.key] = nil
                remove(@tail.prev)
                @size -= 1
            end
        end
    end

    def remove(node)
        node.prev.next = node.next
        node.next.prev = node.prev
    end

    def add_to_head(node)
        first = @head.next
        node.prev = @head
        node.next = first
        first.prev = node
        @head.next = node
    end

    def move_to_head(node)
        remove(node)
        add_to_head(node)
    end
end
```

</details>


<details>

<summary>点击展开go实现</summary>

```go
type Node struct {
	prev, next *Node
	key, value int
}

type LRUCache struct {
	size, capacity int
	cache map[int]*Node
	head, tail *Node
}

func Constructor(capacity int) LRUCache {
	head := Node {}
	tail := Node {}
	head.next = &tail
	tail.prev = &head

	lruCache := LRUCache {
		size: 0,
		capacity: capacity,
		cache: make(map[int]*Node, capacity),
		head: &head,
		tail: &tail,
	}

	return lruCache
}

func (this *LRUCache) Get(key int) int {
	node, ok := this.cache[key]
	if !ok {
		return -1
	}

	moveToHead(node, this)
	return node.value
}

func (this *LRUCache) Put(key int, value int)  {
	node, ok := this.cache[key]
	if ok {
		node.value = value
		moveToHead(node, this)
	} else {
		node := Node {
			key: key,
			value: value,
		}
		this.cache[key] = &node
		this.size ++
		addToHead(&node, this)

		if this.size > this.capacity {
			delete(this.cache, this.tail.prev.key)
			remove(this.tail.prev)
			this.size --
		}
	}
}

func remove(node *Node) {
	node.prev.next = node.next
	node.next.prev = node.prev
}

func addToHead(node *Node, this *LRUCache) {
	first := this.head.next
	node.prev = this.head
	node.next = first
	first.prev = node
	this.head.next = node
}

func moveToHead(node *Node, this *LRUCache) {
	remove(node)
	addToHead(node, this)
}
```

</details>
