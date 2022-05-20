# 栈
---

### [给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。](https://leetcode-cn.com/problems/valid-parentheses/)
#### 有效字符串需满足：
* 1. 左括号必须用相同类型的右括号闭合。
* 2. 左括号必须以正确的顺序闭合。

```go
func isValid(s string) bool {
    if len(s) % 2 == 1 {
        return false
    }
    stack := make([]byte, 0, len(s))
    pairs := map[byte]byte {
        ')': '(',
        ']': '[',
        '}': '{',
    }
    for i := 0; i < len(s); i++ {
        if pairs[s[i]] > 0 { // 遇到右括号，要找左括号
            if len(stack) == 0 || stack[len(stack)-1] != pairs[s[i]] {
                return false // 栈为空或者左括号不匹配
            }
            stack = stack[:len(stack)-1] // 移除栈顶匹配的左括号
        } else {
            stack = append(stack, s[i]) // 遇到左括号，入栈
        }
    }
    return len(stack) == 0 // 根据栈内元素判断结果
}
```
