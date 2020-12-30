# 栈
---

### [给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。](https://leetcode-cn.com/problems/valid-parentheses/)
#### 有效字符串需满足：
* 1. 左括号必须用相同类型的右括号闭合。
* 2. 左括号必须以正确的顺序闭合。

```ruby
# @param {String} s
# @return {Boolean}
def is_valid(s)
  stack = []
  s.each_char do |c|
    if c == '('
      stack.push ')'
    elsif c == '{'
      stack.push '}'
    elsif c == '['
      stack.push ']'
    elsif stack.size == 0 || c != stack.pop
      return false
    else
    end
  end
  stack.size == 0
end
```