# 二叉树遍历
---

### 先序遍历
```ruby
# Definition for a binary tree node.
# class TreeNode
#     attr_accessor :val, :left, :right
#     def initialize(val)
#         @val = val
#         @left, @right = nil, nil
#     end
# end

# @param {TreeNode} root
# @return {Integer[]}
def preorder_traversal(root)
  result = []
  return result unless root

  result << root.val
  result += preorder_traversal(root.left) if root.left
  result += preorder_traversal(root.right) if root.right

  result
end
```
---

### 中序遍历
```ruby
# Definition for a binary tree node.
# class TreeNode
#     attr_accessor :val, :left, :right
#     def initialize(val)
#         @val = val
#         @left, @right = nil, nil
#     end
# end

# @param {TreeNode} root
# @return {Integer[]}
def preorder_traversal(root)
  result = []
  return result unless root

  result += preorder_traversal(root.left) if root.left
  result << root.val
  result += preorder_traversal(root.right) if root.right

  result
end
```
---

### 后序遍历
```ruby
# Definition for a binary tree node.
# class TreeNode
#     attr_accessor :val, :left, :right
#     def initialize(val)
#         @val = val
#         @left, @right = nil, nil
#     end
# end

# @param {TreeNode} root
# @return {Integer[]}
def preorder_traversal(root)
  result = []
  return result unless root

  result += preorder_traversal(root.left) if root.left
  result += preorder_traversal(root.right) if root.right
  result << root.val

  result
end
```