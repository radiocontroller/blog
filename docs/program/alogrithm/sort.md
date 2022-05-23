# 排序
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

* 最好情况每次中分，时间复杂度O(nlogn)，最坏情况数组已排好序，退化为冒泡排序，时间复杂度O(n^2)

```go
func quickSort(arr []int, left int, right int) {
  if left >= right {
    return
  }

  pivot := arr[left]
  i, j := left+1, right
  for {
    for i < right && arr[i] < pivot {
      i++
    }

    for j > left && arr[j] > pivot {
      j--
    }

    if i >= j {
      break
    }
    swap(arr, i, j)
  }
  swap(arr, left, j)
  fmt.Println("arr: ", arr, "pivot: ", pivot)

  quickSort(arr, left, j-1)
  quickSort(arr, j+1, right)
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
  i, j := 0, 0
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
