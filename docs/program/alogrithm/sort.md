# 排序
#### 以升序为例
---

### 冒泡排序

```go
func sort(arr []int) {
  for i := 0; i < len(arr)-1; i++ {   // 外层循环少一次，因为全部排好序之后，剩下那一个就不用排了
    for j := i+1; j < len(arr); j++ {
      if arr[i] > arr[j] {
        swap(arr, i, j)
      }
    }
  }
}

func swap(arr []int, i, j int) {
  arr[i], arr[j] = arr[j], arr[i]
}
```

### 快速排序
* 快排原理：每次找一个基准点，然后把基准点左右两边的数字交换，就可以保证基准点左边小于基准点，基准点右边大于基准点，
然后对左右区间重复以上过程。
* 最好情况每次中分，时间复杂度O(nlogn)，最坏情况数组已排好序，退化为冒泡排序，时间复杂度O(n^2)

```go
func quickSort(arr []int, left int, right int) {
  if left >= right {
    return
  }

  pivot := arr[left]                  // 每次选择第一个元素作为基准点
  i, j := left+1, right               // 左右交换区间
  for {
    for i < right && arr[i] < pivot { // 从左往右找到第一个大于基准点元素
      i++
    }
    for j > left && arr[j] > pivot {  // 从右往左找到第一个小于基准点元素
      j--
    }
    if i >= j {                       
      break
    }
    swap(arr, i, j)                   // 交换两个元素
    i++                               // 交换完成之后i和j移动，否则对于[3 3 3 3]这样的情况会死循环
    j--
  }
  swap(arr, left, j)                  // 这个操作是把基准点移动到中间
  fmt.Println("arr: ", arr, "pivot: ", pivot)

  quickSort(arr, left, j-1)           // 对左边区间重复以上操作
  quickSort(arr, j+1, right)          // 对右边区间重复以上操作
}

func swap(arr []int, i, j int) {
  arr[i], arr[j] = arr[j], arr[i]
}
```

### 归并排序

* 时间复杂度O(nlogn)

```go
func mergeSort(arr []int) []int {
  length := len(arr)
  if length <= 1 {
    return arr
  }
  mid := length / 2
  left := mergeSort(arr[:mid])
  right := mergeSort(arr[mid:])
  return merge(left, right)
}

func merge(left, right []int) (result []int) {
  var i, j int
  for i < len(left) && j < len(right) {
    if left[i] < right[j] {
      result = append(result, left[i])
      i++
    } else {
      result = append(result, right[j])
      j++
    }
  }
  result = append(result, left[i:]...)
  result = append(result, right[j:]...)
  return
}
```
