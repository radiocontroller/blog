# 堆（构造堆时间复杂度O(n)，替换根节点然后堆化时间复杂度O(nlogn)）
#### 堆是完全二叉树，底层数据结构是数组，父元素和子元素下标有公式
* 父元素下标为 i
* 左子节点为 2*i + 1
* 右子节点为 2*i + 2
---

### 小根堆（小顶堆）(最小元素放到最后，所以排序是降序)
* **可用于场景：例如10亿个数，找出最大的10个。先取前10个建立小根堆，第11个数开始每个数去和根节点比较，如果小于根节点则进行下一个，
大了就替换小根堆的根节点，然后重新构造小根堆(相当于大的数下沉到堆的底部去了)**

<details>

<summary>点击展开go实现</summary>

```go
func buildHeap(arr []int) {
  lastNode := (len(arr) - 1) / 2
  for i := lastNode; i >= 0; i-- {
    heapify(arr, i)
  }
  fmt.Println("buildHeap: ", arr)
  return
}

// 自顶向下递归进行heapify，前提是本身已经构造好了小顶堆，替换根节点时，只需要对根节点调用heapify函数即可
func heapify(arr []int, i int) {
  c1 := 2 * i + 1 // 左子节点
  c2 := 2 * i + 2 // 右子节点
  min := i
  if c1 < len(arr) && arr[c1] < arr[min] {
    min = c1
  }
  if c2 < len(arr) && arr[c2] < arr[min] {
    min = c2
  }
  if min != i {
    swap(arr, min, i)
    heapify(arr, min)
  }
  return // 没有进行替换递归出口
}

// 堆排序：每次将最小值的根节点与最后一个节点互换，然后砍断最后一个节点（即之前的根节点），然后对根节点调用heapify
func heapSort(arr []int) {
  length := len(arr)
  for i := length-1; i >= 0; i-- {
    swap(arr, 0, i)
    arr = arr[:i]
    heapify(arr, 0)
  }
  return
}

func swap(arr []int, i, j int) {
  temp := arr[i]
  arr[i] = arr[j]
  arr[j] = temp
  return
}

func main() {
  arr := []int{4,3,2,5,6,1,10}
  buildHeap(arr)
  heapSort(arr)
  fmt.Println("heapSort: ", arr)
}

// 输出
// buildHeap:  [1 3 2 5 6 4 10]
// heapSort:  [10 6 5 4 3 2 1]
```

</details>

### 大根堆（大顶堆）(最大元素放到最后，所以排序是升序)

<details>

<summary>点击展开go实现</summary>

```go
func buildHeap(arr []int) {
  lastNode := (len(arr) - 1) / 2
  for i := lastNode; i >= 0; i-- {
    heapify(arr, i)
  }
  fmt.Println("buildHeap: ", arr)
  return
}

// 自顶向下递归进行heapify，前提是本身已经构造好了大顶堆，替换根节点时，只需要对根节点调用heapify函数即可
func heapify(arr []int, i int) {
  c1 := 2 * i + 1 // 左子节点
  c2 := 2 * i + 2 // 右子节点
  max := i
  if c1 < len(arr) && arr[c1] > arr[max] {
    max = c1
  }
  if c2 < len(arr) && arr[c2] > arr[max] {
    max = c2
  }
  if max != i {
    swap(arr, max, i)
    heapify(arr, max)
  }
  return // 没有进行替换递归出口
}

// 堆排序：每次将最大值的根节点与最后一个节点互换，然后砍断最后一个节点（即之前的根节点），然后对根节点调用heapify
func heapSort(arr []int) {
  length := len(arr)
  for i := length-1; i >= 0; i-- {
    swap(arr, 0, i)
    arr = arr[:i]
    heapify(arr, 0)
  }
  return
}

func swap(arr []int, i, j int) {
  temp := arr[i]
  arr[i] = arr[j]
  arr[j] = temp
  return
}

func main() {
  arr := []int{4,3,2,5,6,1,10}
  buildHeap(arr)
  heapSort(arr)
  fmt.Println("heapSort: ", arr)
}

// 输出
// buildHeap:  [10 6 4 5 3 1 2]
// heapSort:  [1 2 3 4 5 6 10]
```

</details>

::: tip 相关链接

[https://www.bilibili.com/video/av47196993/](https://www.bilibili.com/video/av47196993/)

:::
