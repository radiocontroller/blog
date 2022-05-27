# 滑动窗口

#### 参考模板
```go
var l, r int
for r < length {
  更新窗口内信息

  for 不满足条件时 {
    缩小窗口（例如：l++）
  }

  更新结果（例如：res = Max(res, r-l+1)

  r++
}
```
---

### [无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)
* 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
* 核心思路：维护一个i到j的滑动窗口和一个遍历过的字符下标map，j每次后移一位，如果移动后发现map中存在，
则将start定位到上一个存在的下标+1位置，同时记录map

```go
func lengthOfLongestSubstring(s string) int {
  length := len(s)
  if length <= 1 {
    return length
  }

  var l, r, res int
  chrMap := map[byte]int{}
  for r < length {
    if idx, ok := chrMap[s[r]]; ok {
      // 这里要取最大值是因为idx+1有可能会小于i导致i后退
      // 例如：..a..b..a..a..b.. 当j遍历到第三个a时，i会跳到第二个a下标+1，
      // 当j遍历到第二个b时，如果不取最大值，直接取上一个b的下标+1，i就会倒退到第一个b下标+1
      l = Max(idx+1, l)
    }
    chrMap[s[r]] = r
    res = Max(res, r-l+1)
    r++
  }
  return res
}

func Max(a, b int) int {
  if a > b {
    return a
  }
  return b
}
```

### [乘积小于 K 的子数组](https://leetcode-cn.com/problems/subarray-product-less-than-k/)
* 思路：维护left到right的滑动窗口，统计以right结尾乘积 >= k的数组个数（right - left + 1），当不符合时，乘积除以left对应的值并且left右移
* 参考题解：https://leetcode-cn.com/problems/subarray-product-less-than-k/solution/jian-dan-yi-dong-xiang-xi-zhu-jie-shuang-jvy3/
```go
func numSubarrayProductLessThanK(nums []int, k int) (res int) {
    if k <= 1 {
        return
    }
    var l, r int
    sum := 1
    for r < len(nums) {
        sum *= nums[r]
        for sum >= k {
            sum /= nums[l]
            l++
        }
        res += r - l + 1
        r++
    }
    return
}
```

### [长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)
* 给定一个含有 n 个正整数的数组和一个正整数 target 。
* 找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。
```go
func minSubArrayLen(target int, nums []int) int {
  var l, r, sum int
  res := len(nums)+1
  for r < len(nums) {       // 右指针作为判断条件
    sum += nums[r]          // 更新窗口信息
    for sum >= target {     // 满足条件，l往后移动
      res = Min(res, r-l+1) // 计算结果
      // fmt.Println("l:", l, ", r:", r, ", res:", res)
      sum -= nums[l]
      l++
    }
    r++                     // 不满足条件，r往后移动
  }
  if res == len(nums)+1 {   // 排除无解的情况
    return 0
  }
  return res
}

func Min(a, b int) int {
  if a < b {
      return a
  }
  return b
}
```
