# 排序
---

### 冒泡排序

* **ruby实现**

```ruby
def sort_array(nums)
    (1..(nums.size - 1)).each do |_| # 外层表示循环次数，少一次，因为其他都排序好了，最后一个自然就排序好了
        (0..(nums.size - 2)).each do |i| # 因为要用到nums[i+1]，所以循环的最后一个是nums.size - 2
            if nums[i] > nums[i+1]
                nums[i], nums[i+1] = nums[i+1], nums[i]
            end
        end
    end
    nums
end
```

* **go实现**

```go
func sort(nums []int) []int {
  for i := 1; i < len(nums); i++ {
    for j := 0; j < len(nums) - 1; j++ {
      if nums[j] > nums[j+1] {
        nums[j], nums[j+1] = nums[j+1], nums[j]
      }
    }
  }
  return nums
}
```