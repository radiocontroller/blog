# 二分查找
---

### 简单二分查找
* 假设nums已排好序，target为查找目标，找到返回下标，找不到返回-1

```ruby
def search(nums, target)
  l = 0
  r = nums.length - 1
  while(l <= r) do
    mid = (l + r) / 2
    if nums[mid] < target
      l = mid + 1
    elsif nums[mid] > target
      r = mid - 1
    else
      return mid
    end
  end
  -1
end
```

* 每次移动l和r指针的时候，需要在mid的基础上+1或者-1，防止出现死循环
* 代码中的判断条件必须是while(l <= r)，否则的话判断条件不完整，比如：nums = [1, 3, 5]，target为5，此时在(l < r)条件下就会找不到，
必须 l == r 才能找到。

### 查找第一个与key相等的元素
* 假设nums数组之中的数据可以重复，要求返回匹配的数据的最小下标

```ruby
def search_first(nums, target)
  l = 0
  r = nums.length - 1
  while(l <= r) do
    mid = (l + r) / 2
    if target <= nums[mid]
      r = mid - 1
    else
      l = mid + 1
    end
  end

  return l if l < nums.size && nums[l] == target
  # 上面要判断 l < nums.size，假设nums = [1, 1, 1]，target为2，那么l最终为3，超出数组下标
  
  -1
end
```

### 查找最后一个与key相等的元素
* 假设nums数组之中的数据可以重复，要求返回匹配的数据的最大下标

```ruby
def search_last(nums, target)
  l = 0
  r = nums.length - 1
  while(l <= r) do
    mid = (l + r) / 2
    if target >= nums[mid]
      l = mid + 1
    else
      r = mid - 1
    end
  end

  return r if r >= 0 && nums[r] == target
  # 上面要判断 r >= 0，假设nums = [1, 1, 1]，target为0，那么r会变成-1
 # 
  -1
end
```
