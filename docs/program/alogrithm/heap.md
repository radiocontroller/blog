# 堆
---

### 小根堆（小顶堆）
* **可用于场景：例如10亿个数，找出最大的10个。先取前10个建立小根堆，第11个数开始每个数去和根节点比较，如果小了进行下一个数比较，
大了就替换小根堆的根节点，然后重新构造小根堆**
```ruby
def heapify(tree, n, i)
  c1 = 2 * i + 1
  c2 = 2 * i + 2
  min = i
  min = c1 if c1 < n && tree[c1] < tree[min]
  min = c2 if c2 < n && tree[c2] < tree[min]

  if min != i
    tree[min], tree[i] = tree[i], tree[min]
    heapify(tree, n, min)
  end
end

def build_heap(tree, n)
  parent = (n - 1) / 2
  parent.downto(0).each do |i|
    c1 = 2 * i + 1
    c2 = 2 * i + 2
    heapify(tree, n, i)
  end
end

def heap_sort(tree, n)
  build_heap(tree, n)
  (n-1).downto(0).each do |i|
    tree[0], tree[i] = tree[i], tree[0]
    heapify(tree, i, 0)
  end
end

tree = [1, 5, 4, 2, 10, 3, 7]
build_heap(tree, 7)
puts "build_heap, tree: #{tree}"

tree << 11
heap_sort(tree, 8)
puts "heap_sort, tree: #{tree}"

# 输出结果
# build_heap, tree: [1, 2, 3, 5, 10, 4, 7]
# heap_sort, tree: [11, 10, 7, 5, 4, 3, 2, 1]
```

### 大根堆（大顶堆）
```ruby
def heapify(tree, n, i)
  c1 = 2 * i + 1
  c2 = 2 * i + 2
  max = i
  max = c1 if c1 < n && tree[c1] > tree[max]
  max = c2 if c2 < n && tree[c2] > tree[max]

  if max != i
    tree[max], tree[i] = tree[i], tree[max]
    heapify(tree, n, max)
  end
end

def build_heap(tree, n)
  parent = (n - 1) / 2
  parent.downto(0).each do |i|
    c1 = 2 * i + 1
    c2 = 2 * i + 2
    heapify(tree, n, i)
  end
end

def heap_sort(tree, n)
  build_heap(tree, n)
  (n-1).downto(0).each do |i|
    tree[0], tree[i] = tree[i], tree[0]
    heapify(tree, i, 0)
  end
end

tree = [1, 5, 4, 2, 10, 3, 7]
build_heap(tree, 7)
puts "build_heap, tree: #{tree}"

tree << 11
heap_sort(tree, 8)
puts "heap_sort, tree: #{tree}"

# 输出
# build_heap, tree: [1, 2, 3, 5, 10, 4, 7]
# heap_sort, tree: [11, 10, 7, 5, 4, 3, 2, 1]
```

::: tip 相关链接

[https://www.bilibili.com/video/av47196993/](https://www.bilibili.com/video/av47196993/)

:::