# 中心扩散
---

### [最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)
```go
func longestPalindrome(s string) string {
	result := ""
	for i := 0; i < len(s); i++ {
		str := expand(s, i, i)
		if len(str) > len(result) {
			result = str
		}

		str = expand(s, i, i + 1)
		if len(str) > len(result) {
			result = str
		}
	}

	return result
}

func expand(s string, i int, j int) string {
	for {
		if i < 0 || j >= len(s) || s[i] != s[j] {
			break
		}
		i--
		j++
	}

	return s[i+1:j]
}
```