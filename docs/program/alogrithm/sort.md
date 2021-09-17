# 排序
---

### 冒泡排序

<details>

<summary>点击展开ruby实现</summary>

```ruby
def sort_array(nums)
    (1..(nums.size - 1)).each do |_| # 外层表示循环次数，少一次，因为其他都排序好了，最后一个自然就排序好了
        (0..(nums.size - 2)).each do |i| # 因为要用到nums[i+1]，所以循环的最后一个是nums.size - 2
            if nums[i] > nums[i+1]
                nums[i], nums[i+1] = nums[i+1], nums[i]
            end
        end
    end
    nums
end
```

</details>

<details>

<summary>点击展开go实现</summary>

```go
func sort(nums []int) []int {
  for i := 1; i < len(nums); i++ {
    for j := 0; j < len(nums) - 1; j++ {
      if nums[j] > nums[j+1] {
        nums[j], nums[j+1] = nums[j+1], nums[j]
      }
    }
  }
  return nums
}
```

</details>

### 快速排序

* 最好情况每次中分，时间复杂度O(nlogn)，最坏情况数组已排好序，退化为冒泡排序，时间复杂度O(n^2)

<details>

<summary>点击展开go实现</summary>

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
    exchange(arr, i, j)
  }
  exchange(arr, left, j)
  fmt.Println("arr: ", arr, "pivot: ", pivot)

  quickSort(arr, left, j-1)
  quickSort(arr, j+1, right)
}

func exchange(arr []int, i, j int) {
  tmp := arr[i]
  arr[i] = arr[j]
  arr[j] = tmp
}
```

</details>

### 归并排序

* 时间复杂度O(nlogn)

<details>

<summary>点击展开go实现</summary>

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

</details>
