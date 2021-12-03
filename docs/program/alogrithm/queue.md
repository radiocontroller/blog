# 队列
---

### [滑动窗口最大值](https://leetcode-cn.com/problems/sliding-window-maximum/)
* 算法思想：维护一个单调递减队列，滑动一次就pop(离开的那个元素)，push(进来的元素)，然后取一次最大值，
[可参考链接](https://programmercarl.com/0239.%E6%BB%91%E5%8A%A8%E7%AA%97%E5%8F%A3%E6%9C%80%E5%A4%A7%E5%80%BC.html)

```
输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
解释：
滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

<details>

<summary>点击展开go实现</summary>

```go
type DeQueue struct {
  queue []int
}

func (q *DeQueue) Length() int {
  return len(q.queue)
}

func (q *DeQueue) Empty() bool {
  return q.Length() == 0
}

func (q *DeQueue) Front() int {
  return q.queue[0]
}

func (q *DeQueue) End() int {
  return q.queue[q.Length()-1]
}

func (q *DeQueue) Pop(target int) {
  if !q.Empty() && q.Front() == target {
    q.queue = q.queue[1:]
  }
  return
}

func (q *DeQueue) Push(target int) {
  // 只需要维护一个从最大值开始递减的队列
  // 例如：[1, 5, 4, 3, 0]，k = 3
  // 对于[1, 5, 4]元素，[5, 4]是我们要的，因为在最大值"5"之前的元素，在向右进行滑动直到"5"离开，只可能会去取"5"，不可能取比它小的"1"
  // 而[5, 4]之所以需要保留后面的"4"，是因为，在"5"离开之后，"4"会是接下来的最大值
  for !q.Empty() && target > q.End() {
    q.queue = q.queue[:q.Length()-1]
  }
  q.queue = append(q.queue, target)
  return
}

func maxSlidingWindow(nums []int, k int) []int {
  q := &DeQueue {
    queue: make([]int, 0),
  }
  res := make([]int, 0)
  // 初始化队列
  for i := 0; i < k; i++ {
    q.Push(nums[i])
  }
  res = append(res, q.Front())
  // 从第k个元素开始，pop一次，push一次，然后取最大值
  for i := k; i < len(nums); i++ {
    q.Pop(nums[i-k])
    q.Push(nums[i])
    res = append(res, q.Front())
  }
  return res
}
```

</details>
