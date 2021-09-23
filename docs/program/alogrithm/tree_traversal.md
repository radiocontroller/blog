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
