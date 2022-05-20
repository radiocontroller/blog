# 链表
---

### [反转链表](https://leetcode.cn/problems/reverse-linked-list/)
```go
type ListNode struct {
   Val int
   Next *ListNode
}

func reverseList(cur *ListNode) *ListNode {
  var prev *ListNode
  for cur != nil {
    next := cur.Next // next变量是为了后面赋值给cur进行下一次循环
    cur.Next = prev  // 反转某一次关系
    prev = cur      // 反转完成后prev向后移动，对于下一次循环，prev就是cur
    cur = next
  }
  return prev
}
```

### [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)
```go
type ListNode struct {
   Val int
   Next *ListNode
}

func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
  dummy := &ListNode{}
  cur := dummy
  for l1 != nil && l2 != nil {
    if l1.Val <= l2.Val {
      cur.Next = l1
      l1 = l1.Next
    } else {
      cur.Next = l2
      l2 = l2.Next
    }
    cur = cur.Next // 指向下个节点
  }
  for l1 != nil {
    cur.Next = l1
    l1 = l1.Next
    cur = cur.Next // 指向下个节点
  }
  for l2 != nil {
    cur.Next = l2
    l2 = l2.Next
    cur = cur.Next // 指向下个节点
  }
  return dummy.Next
}
```

### 两个链表的第一个公共节点
* 互相走对方的路，如果中间相遇就返回，否则双方最后都是nil
```go
type ListNode struct {
   Val int
   Next *ListNode
}

func getIntersectionNode(headA, headB *ListNode) *ListNode {
  curA, curB := headA, headB
  for curA != curB {
    if curA == nil {
      curA = headB
    } else {
      curA = curA.Next
    }
    if curB == nil {
      curB = headA
    } else {
      curB = curB.Next
    }
  }
  return curA
}
```
