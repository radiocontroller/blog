# 二叉树遍历
---

### 先序遍历
```go
type TreeNode struct {
   Val int
   Left *TreeNode
   Right *TreeNode
}
```

### 先序遍历
```go
func preorderTraversal(root *TreeNode) (result []int) {
  result = append(result, root.Val)
  if root.Left != nil {
    result = append(result, inorderTraversal(root.Left)...)
  }
  if root.Right != nil {
    result = append(result, inorderTraversal(root.Right)...)
  }
  return result
}
```
---

### 中序遍历
```go
func inorderTraversal(root *TreeNode) (result []int) {
  if root.Left != nil {
    result = append(result, inorderTraversal(root.Left)...)
  }
  result = append(result, root.Val)
  if root.Right != nil {
    result = append(result, inorderTraversal(root.Right)...)
  }
  return result
}
```
---

### 后序遍历
```go
func postorderTraversal(root *TreeNode) (result []int) {
  if root.Left != nil {
    result = append(result, inorderTraversal(root.Left)...)
  }
  if root.Right != nil {
    result = append(result, inorderTraversal(root.Right)...)
  }
  result = append(result, root.Val)
  return result
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
fmt.Println(preorderTraversal(&n1))
// [1 4 2 5 6 3 7]
fmt.Println(inorderTraversal(&n1))
// [4 2 5 1 6 3 7]
fmt.Println(postorderTraversal(&n1))
// [4 2 5 6 3 7 1]
```
