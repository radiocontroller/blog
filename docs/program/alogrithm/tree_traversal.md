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
