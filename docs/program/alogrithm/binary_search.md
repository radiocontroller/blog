# 二分查找及变种
---

* 假设数组arr已排好序（非递减顺序），key为查找目标

### 1. 基础二分查找
```go
func binarySearch(arr []int, key int) int {
  left, right := 0, len(arr)-1
  // 注意是 <=，例如：arr = [1, 3, 5]，key为5，此时在(left < right)条件下就会找不到
  for left <= right {
    mid := (left+right)>>1
    if arr[mid] == key {
      return mid
    }
    if key > arr[mid] {
      left = mid+1
    } else {
      right = mid-1
    }
  }
  return -1 // 找不到返回-1
}

func main() {
  arr := []int{1, 7, 15}
  fmt.Println(binarySearch(arr, 7)) // 返回：1
  fmt.Println(binarySearch(arr, 8)) // 返回：-1
}
```

### 2. 查找第一个 >= key 的元素
* 查找第一个 >= key 的元素，也就是说等于查找key值的元素有好多个，返回这些元素最左边的元素下标；如果没有等于key值的元素，则返回大于key的最左边元素下标。
```go
func firstGteq(arr []int, key int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := (left+right)>>1
    if arr[mid] >= key {
      right = mid-1
    } else {
      left = mid+1
    }
  }
  return left
}

func main() {
  arr := []int{1, 7, 7, 15}
  fmt.Println(firstGteq(arr, 7))  // 返回：1
  fmt.Println(firstGteq(arr, 10)) // 返回：3
}
```

### 3. 查找第一个 > key 的元素
* 查找第一个 > key 的元素，也就是说返回大于key的最左边元素下标。
```go
func firstGt(arr []int, key int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := (left+right)>>1
    if arr[mid] > key {
      right = mid-1
    } else {
      left = mid+1
    }
  }
  return left
}

func main() {
  arr := []int{1, 7, 7, 15}
  fmt.Println(firstGt(arr, 5))  // 返回：1
  fmt.Println(firstGt(arr, 10)) // 返回：3
}
```
### 4. 查找最后一个 <= key 的元素
* 查找最后一个 <= key的元素，也就是说等于查找key值的元素有好多个，返回这些元素最右边的元素下标；如果没有等于key值的元素，则返回小于key的最右边元素下标。
```go
func lastLteq(arr []int, key int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := (left+right)>>1
    if arr[mid] <= key {
      left = mid+1
    } else {
      right = mid-1
    }
  }
  return right
}

func main() {
  arr := []int{1, 7, 7, 15}
  fmt.Println(lastLteq(arr, 7))   // 返回：2
  fmt.Println(lastLteq(arr, 10))  // 返回：2
  fmt.Println(lastLteq(arr, 5))   // 返回：0
}
```

### 5. 查找最后一个 < key 的元素
```go
func lastLt(arr []int, key int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := (left+right)>>1
    if arr[mid] < key {
      left = mid+1
    } else {
      right = mid-1
    }
  }
  return right
}

func main() {
  arr := []int{1, 7, 7, 15}
  fmt.Println(lastLt(arr, 7))   // 返回：0
  fmt.Println(lastLt(arr, 10))  // 返回：2
  fmt.Println(lastLt(arr, 5))   // 返回：0
}
```

### 6. 查找第一个 = key 的元素
* 查找第一个相等的元素，也就是说等于查找key值的元素有好多个，返回这些元素最左边的元素下标。
```go
func firstEq(arr []int, key int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := (left+right)>>1
    if arr[mid] >= key {
      right = mid-1
    } else {
      left = mid+1
    }
  }
  if (left < len(arr) && arr[left] == key) {
    return left
  }
  return -1
}

func main() {
  arr := []int{1, 7, 7, 7, 15}
  fmt.Println(firstEq(arr, 7))   // 返回：1
  fmt.Println(firstEq(arr, 5))   // 返回：-1
}
```

### 7. 查找最后一个 = key 的元素
* 查找最后一个相等的元素，也就是说等于查找key值的元素有好多个，返回这些元素最右边的元素下标。
```go
func lastEq(arr []int, key int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := (left+right)>>1
    if arr[mid] <= key {
      left = mid+1
    } else {
      right = mid-1
    }
  }
  if (right >= 0 && arr[right] == key) {
    return right
  }
  return -1
}

func main() {
  arr := []int{1, 7, 7, 7, 15}
  fmt.Println(firstEq(arr, 7))   // 返回：3
  fmt.Println(firstEq(arr, 5))   // 返回：-1
}
```

### 总结
* 模板
```go
func search(arr []int, key int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := (left+right)>>1
    if key ? arr[mid] {
      // left = mid+1
    } else {
      // right = mid-1
    }
  }
  return left or right
}
```

::: tip 相关链接

[https://www.cnblogs.com/luoxn28/p/5767571.html](https://www.cnblogs.com/luoxn28/p/5767571.html)

:::
