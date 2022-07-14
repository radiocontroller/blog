# 二叉树遍历
---

### TreeNode定义
```go
type TreeNode struct {
   Val int
   Left *TreeNode
   Right *TreeNode
}
```

### 先序遍历(DFS)
```go
func preorder(root *TreeNode) {
  if root == nil {
    return
  }
  fmt.Printf("%d ", root.Val)
  preorder(root.Left)
  preorder(root.Right)
  return
}

// 迭代法
func preorderTraversal(root *TreeNode) (ans []int) {
  stack := []*TreeNode{}
  for root != nil || len(stack) > 0 {
    for root != nil {
      ans = append(ans, root.Val)
      stack = append(stack, root)
      root = root.Left
    }
    root = stack[len(stack)-1].Right
    stack = stack[:len(stack)-1]
  }
  return
}
```
---

### 中序遍历(DFS)
```go
func inorder(root *TreeNode) {
  if root == nil {
    return
  }
  inorder(root.Left)
  fmt.Printf("%d ", root.Val)
  inorder(root.Right)
  return
}

// 迭代法，维护一个栈，每次一直往左查下去，查不到了再往右
func inorderTraversal(root *TreeNode) (ans []int) {
  stack := []*TreeNode{}
  for root != nil || len(stack) > 0 {
    for root != nil {
      stack = append(stack, root)
      root = root.Left
    }
    last := stack[len(stack)-1]
    stack = stack[:len(stack)-1]
    ans = append(ans, last.Val)
    root = last.Right
  }
  return
}
```
---

### 后序遍历(DFS)
```go
func postorder(root *TreeNode) {
  if root == nil {
    return
  }
  postorder(root.Left)
  postorder(root.Right)
  fmt.Printf("%d ", root.Val)
  return
}
```

### 输出

```
     1
   /   \
  2     3
 /  \   / \
4    5 6   7
```

```go
n4 := TreeNode{Val: 4}
n5 := TreeNode{Val: 5}
n6 := TreeNode{Val: 6}
n7 := TreeNode{Val: 7}
n2 := TreeNode{Val: 2}
n3 := TreeNode{Val: 3}
n1 := TreeNode{Val: 1}
n1.Left = &n2
n1.Right = &n3
n2.Left = &n4
n2.Right = &n5
n3.Left = &n6
n3.Right = &n7
preorder(&n1)
//输出 1 2 4 5 3 6 7
fmt.Println()
inorder(&n1)
//输出 4 2 5 1 6 3 7
fmt.Println()
postorder(&n1)
//输出 4 5 2 6 7 3 1
fmt.Println()
```

### 层序遍历(BFS，一维数组)
```
     3
   /   \
  9     20
        / \
       15   7
```

<details>

<summary>点击展开go实现</summary>

```go
type TreeNode struct {
   Val int
   Left *TreeNode
   Right *TreeNode
}

func BFS(root *TreeNode) (res []int) {
  queue := []*TreeNode{root}
  for(len(queue) > 0) {
    vertex := queue[0]
    queue = queue[1:]
    res = append(res, vertex.Val)
    if vertex.Left != nil {
      queue = append(queue, vertex.Left)
    }
    if vertex.Right != nil {
      queue = append(queue, vertex.Right)
    }
  }
  fmt.Println(res)
  return res
}

func main() {
  root := &TreeNode{Val: 3}
  r1 := &TreeNode{Val: 9}
  r2 := &TreeNode{Val: 20}
  r3 := &TreeNode{Val: 15}
  r4 := &TreeNode{Val: 7}
  root.Left = r1
  root.Right = r2
  r2.Left = r3
  r2.Right = r4
  BFS(root)
  //输出 [3 9 20 15 7]
}
```

</details>

### 层序遍历(BFS，二维数组)
```
     3
   /   \
  9     20
        / \
       15   7
```

<details>

<summary>点击展开go实现</summary>

```go
type TreeNode struct {
   Val int
   Left *TreeNode
   Right *TreeNode
}

// 原理就是queue每次都是保存一层的节点，并且每次用newQueue替换queue
func BFS(root *TreeNode) [][]int {
  queue := []*TreeNode{root}
  res := [][]int{}
  for len(queue) > 0 {
    length := len(queue)
    newQueue := []*TreeNode{}
    subRes := []int{}
    for i := 0; i < length; i++ {
      vertex := queue[i]
      subRes = append(subRes, vertex.Val)
      if vertex.Left != nil {
        newQueue = append(newQueue, vertex.Left)
      }
      if vertex.Right != nil {
        newQueue = append(newQueue, vertex.Right)
      }
    }
    res = append(res, subRes)
    queue = newQueue
  }
  fmt.Println(res)
  return res
}

func main() {
  root := &TreeNode{Val: 3}
  r1 := &TreeNode{Val: 9}
  r2 := &TreeNode{Val: 20}
  r3 := &TreeNode{Val: 15}
  r4 := &TreeNode{Val: 7}
  root.Left = r1
  root.Right = r2
  r2.Left = r3
  r2.Right = r4
  BFS(root)
  //输出 [[3] [9 20] [15 7]]
}
```

</details>

### [508. 出现次数最多的子树元素和](https://leetcode.cn/problems/most-frequent-subtree-sum/)

```go
func findFrequentTreeSum(root *TreeNode) (ans []int) {
 cntMap := map[int]int{}
 var maxCnt int
 postorder(root, &cntMap, &maxCnt)

 for sum, cnt := range cntMap {
   if cnt < maxCnt {
     delete(cntMap, sum)
   }
 }
 for sum, _ := range cntMap {
   ans = append(ans, sum)
 }

 return
}

// 后序遍历（先访问左右节点，再访问根节点）
func postorder(root *TreeNode, cntMap *map[int]int, maxCnt *int) int {
  if root == nil {
    return 0
  }

  left := postorder(root.Left, cntMap, maxCnt)   // 如果没有左节点，会返回0
  right := postorder(root.Right, cntMap, maxCnt) // 如果没有右节点，会返回0

  sum := root.Val + left + right         // 统计当前节点 + 左节点 + 右节点的总和
  (*cntMap)[sum]++                       // 存储sum到cntMap中
  *maxCnt = Max(*maxCnt, (*cntMap)[sum]) // 记录出现次数最大值

  return sum                             // 返回当前子树节点总和
}

func Max(a, b int) int {
  if a > b {
    return a
  }
  return b
}
```
