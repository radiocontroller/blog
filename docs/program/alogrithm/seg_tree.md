# 线段树
#### 线段树可用来查找数组中某个范围的和
#### 线段树查找和更新的时间复杂度都是O(logn)
---

![seg_tree](http://motor.rcer666.cn/program/alogrithom/seg_tree.png)

### 构造线段树
* arr代表原数组
* tree代表线段树数组
* arr的下标最终会体现在线段树叶子节点上

```go
// node代表红色的tree节点下标
// start, end代表tree节点[]里面的范围(也就是arr数组的下标范围)
func buildTree(arr *[]int, tree *[]int, node, start, end int) {
  if start == end {                                      // 递归出口为叶子节点
    (*tree)[node] = (*arr)[start]
    return
  }
  mid := (start + end) >> 1
  leftNode := 2 * node + 1
  rightNode := 2 * node + 2
  buildTree(arr, tree, leftNode, start, mid)             // 构建左树
  buildTree(arr, tree, rightNode, mid+1, end)            // 构建右树
  (*tree)[node] = (*tree)[leftNode] + (*tree)[rightNode] // 最终目的就是为了计算出node节点的值
}
```

### 线段树更新

```go
// idx代表数组arr要修改的下标
// val代表数组arr idx下标修改后的值
func updateTree(arr *[]int, tree *[]int, node, start, end, idx, val int) {
  if start == end {                                     // 更新叶子节点，也就是arr中的值
    (*arr)[idx] = val
    (*tree)[node] = val
    return
  }
  mid := (start + end) >> 1
  leftNode := 2 * node + 1
  rightNode := 2 * node + 2
  if idx >= start && idx <= mid {
    updateTree(arr, tree, leftNode, start, mid, idx, val)
  } else {
    updateTree(arr, tree, rightNode, mid+1, end, idx, val)
  }
  (*tree)[node] = (*tree)[leftNode] + (*tree)[rightNode] // 最终目的就是为了修改node节点的值
}
```

### 线段树查找

```go
// l, r代表要找的范围，例如2, 5，也就是arr[2]+arr[3]+arr[4]+arr[5]
func queryTree(arr *[]int, tree *[]int, node, start, end, l, r int) int {
  if r < start || end < l { // 查找范围和线段树的范围没有交集，返回0
    return 0
  }
  if l <= start && end <= r { // 查找范围包含线段树某个节点，返回该节点值
    return (*tree)[node]
  }
  mid := (start + end) >> 1
  leftNode := 2 * node + 1
  rightNode := 2 * node + 2
  sumLeft := queryTree(arr, tree, leftNode, start, mid, l, r)
  sumRight := queryTree(arr, tree, rightNode, mid+1, end, l, r)
  return sumLeft + sumRight
}
```

### main函数

```go
func main() {
  arr := []int{1, 3, 5, 7, 9, 11}
  tree := make([]int, len(arr)*4)
  buildTree(&arr, &tree, 0, 0, len(arr)-1)
  fmt.Println("tree = ", tree)
  for i := 0; i < 15; i++ {
    fmt.Printf("tree[%d] = %d\n", i, tree[i])
  }
  fmt.Println("-----")
  arr[4] = 6
  updateTree(&arr, &tree, 0, 0, len(arr)-1, 4, 6)
  for i := 0; i < 15; i++ {
    fmt.Printf("tree[%d] = %d\n", i, tree[i])
  }
  fmt.Println("-----")
  fmt.Println("query:", queryTree(&arr, &tree, 0, 0, len(arr)-1, 2, 5))
}
```

::: tip 相关链接

[https://www.bilibili.com/video/BV1cb411t7AM](https://www.bilibili.com/video/BV1cb411t7AM)

:::
