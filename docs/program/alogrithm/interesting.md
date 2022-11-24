# 有趣的题
---

### [792. 匹配子序列的单词数](https://leetcode.cn/problems/number-of-matching-subsequences/)
* 给定字符串 s 和字符串数组 words, 返回  words[i] 中是s的子序列的单词个数 。
  字符串的 子序列 是从原始字符串中生成的新字符串，可以从中删去一些字符(可以是none)，而不改变其余字符的相对顺序。
  例如， “ace” 是 “abcde” 的子序列。
* [题解](https://leetcode.cn/problems/number-of-matching-subsequences/solution/by-lcbin-gwyj/)

<details>

<summary>分桶思路</summary>

```go
func numMatchingSubseq(s string, words []string) (ans int) {
  d := [26][]string{}
  for _, w := range words {
    d[w[0]-'a'] = append(d[w[0]-'a'], w)  // 根据 w 的首字符进行分桶
  }

  for _, ch := range s {                  // 对 s 的每个字符遍历
    q := d[ch-'a']                        // 取出桶
    d[ch-'a'] = nil                       // 清空桶
    for _, w := range q {
      if len(w) == 1 {                    // 如果桶内元素长度为1，即该字符就等于ch，结果+1
        ans++
      } else {
        d[w[1]-'a'] = append(d[w[1]-'a'], w[1:]) // 去掉 w 首字符，再进行分桶
      }
    }
  }
  return
}
```

</details>

<details>

<summary>二分思路</summary>

```go
func numMatchingSubseq(s string, words []string) (ans int) {
  d := [26][]int{}  // s 中字符 c 对应的下标集合
  for i, ch := range s {
    d[ch-'a'] = append(d[ch-'a'], i)
  }
  for _, w := range words {
    i := 0                      // s 开始字符下标
    for j, ch := range w {
      t := d[ch-'a']            // 找出 ch 字符对应的 s 字符下标数组
      idx := firstGteq(t, i)    // 找到第一个 >= i 的下标
      if idx == len(t) {        // 越界跳出循环
        break
      }
      if j == len(w)-1 {        // w 字符遍历结束，证明是 s 的子序列
        ans++
        break
      }
      i = t[idx]+1              // 更新 i 下标
    }
  }
  return
}

func firstGteq(arr []int, target int) int { // 查找第一个 >= target 的元素下标
  l := 0
  r := len(arr)-1
  for l <= r {
    mid := (l+r)>>1
    if arr[mid] >= target {
      r = mid-1
    } else {
      l = mid+1
    }
  }
  return l
}
```

</details>
