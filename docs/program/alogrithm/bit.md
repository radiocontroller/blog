# 位运算
---

### [2135. 统计追加字母可以获得的单词数](https://leetcode-cn.com/problems/count-words-obtained-after-adding-a-letter/)
```go
func wordCount(startWords []string, targetWords []string) (ans int) {
  has := map[int]bool{}
  for _, word := range startWords {
    mask := 0
    for _, ch := range word {
      mask |= 1 << (ch - 'a')
    }
    has[mask] = true  // 每个字符串每个字符的位存都起来，利用位运算就不用关心字符顺序了
  }
  for _, word := range targetWords {
    mask := 0
    for _, ch := range word {
      mask |= 1 << (ch - 'a')
    }
    for _, ch := range word {
      if has[mask^(1 << (ch-'a'))] { // ^代表异或操作（相同为0，不同为1），因此将该位取反，也就是删除该字符
        ans++
        break
      }
    }
  }
  return
}
```
