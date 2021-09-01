# 双指针
---

### [三数之和](https://leetcode-cn.com/problems/3sum/)
* 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
* **注意：答案中不可以包含重复的三元组。**

```go
import (
  "sort"
)

func threeSum(nums []int) [][]int {
  sort.Ints(nums) // 先排序
  res := make([][]int, 0)

  for i := 0; i < len(nums) - 2; i++ {
    if nums[i] > 0 {
      break
    }

    // 对于重复的，都是选用第一个（不能选最后一个，因为重复的可以多次利用，比如[-1, -1, 2]，所以不能像下面那么写）
    if i > 0 && nums[i] == nums[i - 1] {
      continue
    }
    // 不能这么写
    // if nums[i] == nums[i+1] {
    //   continue
    // }

    j, k, target := i + 1, len(nums) - 1, -nums[i]

    for j < k {
      if nums[j] + nums[k] > target {
        k --
      } else if nums[j] + nums[k] < target {
        j ++
      } else {
        for j < k && nums[j] == nums[j + 1] {
          j ++
        }
        for j < k && nums[k] == nums[k - 1] {
          k --
        }
        res = append(res, []int { nums[i], nums[j], nums[k] })
        j ++
        k --
      }
    }
  }

  return res
}
```
