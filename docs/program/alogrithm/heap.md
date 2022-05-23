# 堆
#### 构造堆：从最后一个非叶子节点开始从下往上调整（heapify）
#### 堆是完全二叉树，底层数据结构是数组，父元素和子元素下标有公式（注意：根节点下标必须从0开始，不能从1开始）
* 父元素下标为 i
* 左子节点为 2*i + 1
* 右子节点为 2*i + 2

#### 堆排序：每次取出堆的根结点，然后将最后一个节点替换根节点，并对根节点进行堆调整。堆排序的时间等于建堆和进行堆调整的时间，所以堆排序的时间复杂度是O(nlog n + n) = O(nlog n)。
#### 构造堆时间复杂度O(n)，一次堆调整时间复杂度O(log n)
---

### 小根堆（小顶堆，根节点的值是最小的，每个结点的值都 <= 左右孩子结点的值）
* **可用于场景：例如10亿个数，找出最大的10个。**
* 先取前10个建立小根堆，第11个数开始每个数去和根节点比较
* 如果小于根节点则忽略
* 如果大于根节点就说明这10个数构成的堆不是最大的10个数，因此将该数替换根节点，然后对根节点进行堆化
* 假设n为总数10亿，k为最大的10个数，时间复杂度为：O(nlog k)

```go
// 从倒数第一个非叶子节点开始，倒着建堆
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
    arr[min], arr[i] = arr[i], arr[min]
    heapify(arr, min)
  }
  return
}

// 堆排序：每次将最小值的根节点与最后一个节点互换，然后砍断最后一个节点（即之前的根节点），然后对根节点调用heapify
func heapSort(arr []int) {
  for i := len(arr)-1; i >= 0; i-- {
    arr[0], arr[i] = arr[i], arr[0]
    heapify(arr[:i], 0)
  }
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
// heapSort:   [10 6 5 4 3 2 1]

// 自底向上堆化，当向小根堆中添加元素时，添加在最后面，然后和父节点进行递归替换
func heapifyBottomToUp(arr []int, i int) {
  for i > 0 {
    parent := (i-1) / 2
    if arr[i] >= arr[parent] {
      return
    }
    arr[i], arr[parent] = arr[parent], arr[i]
    i = parent
    heapifyBottomToUp(arr, i)
  }
  return
}
```

### 大根堆（大顶堆，根节点的值是最大的，每个节点的值都 >= 左右孩子结点的值）

```go
// 从倒数第一个非叶子节点开始，倒着建堆
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
    arr[max], arr[i] = arr[i], arr[max]
    heapify(arr, max)
  }
  return
}

// 堆排序：每次将最大值的根节点与最后一个节点互换，然后砍断最后一个节点（即之前的根节点），然后对根节点调用heapify
func heapSort(arr []int) {
  for i := len(arr)-1; i >= 0; i-- {
    arr[0], arr[i] = arr[i], arr[0]
    heapify(arr[:i], 0)
  }
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
// heapSort:   [1 2 3 4 5 6 10]

// 自底向上堆化，当向大根堆中添加元素时，添加在最后面，然后和父节点进行递归替换
func heapifyBottomToUp(arr []int, i int) {
  for i > 0 {
    parent := (i-1) / 2
    if arr[i] <= arr[parent] {
      return
    }
    arr[i], arr[parent] = arr[parent], arr[i]
    i = parent
    heapifyBottomToUp(arr, i)
  }
  return
}
```

::: tip 参考链接

[https://www.bilibili.com/video/av47196993/](https://www.bilibili.com/video/av47196993/)

:::
