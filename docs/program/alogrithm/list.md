# 链表
---

### 反转链表
```ruby
# Definition for singly-linked list.
# class ListNode
#     attr_accessor :val, :next
#     def initialize(val = 0, _next = nil)
#         @val = val
#         @next = _next
#     end
# end
# @param {ListNode} head
# @return {ListNode}
def reverse_list(head)
    cur = nil
    pre = head
    while(pre) do
      pre_next = pre.next

      pre.next = cur

      cur = pre
      pre = pre_next
    end
    cur
end
```

### 合并两个有序链表
```ruby
# @param {ListNode} l1
# @param {ListNode} l2
# @return {ListNode}
def merge_two_lists(l1, l2)
    dummy = ListNode.new
    l3 = dummy

    while(!l1.nil? && !l2.nil?) do
        if l1.val <= l2.val
            l3.next = l1
            l1 = l1.next
        else
            l3.next = l2
            l2 = l2.next
        end
        l3 = l3.next
    end

    l3.next = l1.nil? ? l2 : l1

    dummy.next
end
```