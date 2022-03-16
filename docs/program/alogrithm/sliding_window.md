# 滑动窗口
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
  var i, j, res int
  chrMap := map[byte]int{}
  for j < length {
    if idx, ok := chrMap[s[j]]; ok {
      // 这里要取最大值是因为idx+1有可能会小于i导致i后退
      // 例如：..a..b..a..a..b.. 当j遍历到第三个a时，i会跳到第二个a下标+1，
      // 当j遍历到第二个b时，如果不取最大值，直接取上一个b的下标+1，i就会倒退到第一个b下标+1
      i = Max(idx+1, i)
    }
    chrMap[s[j]] = j
    res = Max(res, j-i+1)
    j++
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
