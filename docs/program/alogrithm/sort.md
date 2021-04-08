# 排序
---

### 冒泡排序
```ruby
def sort_array(nums)
    (1..(nums.size - 1)).each do |_| # 外层循环少一次，因为其他都排序好了，最后一个自然就排序好了
        (0..(nums.size - 2)).each do |i| # 因为要用到nums[i+1]，所以循环的最后一个是nums.size - 2
            if nums[i] > nums[i+1]
                nums[i], nums[i+1] = nums[i+1], nums[i]
            end
        end
    end
    nums
end
```