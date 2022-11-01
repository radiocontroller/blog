# doorkeeper使用
---

### 前置说明
* config/initializers/doorkeeper.rb添加以下配置，支持四种模式
```ruby
grant_flows %w[authorization_code client_credentials password implicit]
```
* 回跳地址为了方便测试，我们使用：urn:ietf:wg:oauth:2.0:oob
* 客户端调用我们使用[oauth2](https://github.com/oauth-xx/oauth2)这个gem获取clent，后续我们用它进行处理
```ruby
client_id = 'g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic'
client_secret = '_AipOvmDrY86vDTsGFbnn771ihCKwEvmbbK-gEoHW5w'
client = OAuth2::Client.new(client_id, client_secret, :site => 'http://localhost:3000')
```
---

#### 一、Authorization Code（授权码模式，支持刷新token）
* 获取授权url，打开url即可获得code
```ruby
client.auth_code.authorize_url(redirect_uri: 'urn:ietf:wg:oauth:2.0:oob')
# => http://localhost:3000/oauth/authorize?client_id=g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code
```

* 再根据code拿token
```ruby
code = '9biPPhdbw19txt6nNGTwZbHrvbNPrKOkm5eP1So9mtM' # 上面授权得到的code
token = client.auth_code.get_token(code, :redirect_uri => 'urn:ietf:wg:oauth:2.0:oob')
token.token         # => "KHoUWPyjbkUGGvswC6JcJvrkvjmfoUZIJBeVXqgMGH4"
token.refresh_token # => "71ChQ2BTO0SrQpS2II2pIyjIjSwKX8xSjteZ3CMxCKI"
```
---

#### 二、Password Credentials（密码模式，支持刷新token）
* config/initializers/doorkeeper.rb处理resource_owner_from_credentials
```ruby
resource_owner_from_credentials do |routes|
  User.authenticate!(params[:username], params[:password])
end
```
* 请求token
```ruby
token = client.password.get_token('username', 'password')
```
---

#### 三、Client Credentials（客户端模式，不支持刷新token）
* 请求token
```ruby
token = client.client_credentials.get_token
```
---

#### 四、implicit（隐式模式，不支持刷新token）
* 获取授权url
```ruby
client.implicit.authorize_url(redirect_uri: 'urn:ietf:wg:oauth:2.0:oob')
# => http://localhost:3000/oauth/authorize?client_id=g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=token
```

* 授权后可得到以下结果
```json
{
    "resource_owner_id": 1,
    "scope": [
        "public"
    ],
    "expires_in": 7200,
    "application": {
        "uid": "g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic"
    },
    "created_at": 1608958888
}
```
---

#### 五、刷新token（获取新token）
```ruby
new_token = token.refresh!
```
---

#### 六、接口调用以及认证
* 因为在上面我们根据client获取到了token，那么我们直接请求接口
```ruby
resp = token.get('users.json')
resp.parsed # => 得到json解析后结果
```
* 在controller中通过doorkeeper_authorize!进行认证
* 创建application时，其中的scope是和doorkeeper_authorize!(:xx)配合使用的

#### 七、controller helpers的应用
* 在controller中经常会用到以下几个方法
```ruby
doorkeeper_authorize! # 用来校验Authorization token是否有效
doorkeeper_token      # 用来获取token对应的对象(Doorkeeper::AccessToken)
```
* 下面这两个方法的引入逻辑
  * helpers文件所在位置：[lib/doorkeeper/rails/helpers.rb](https://github.com/doorkeeper-gem/doorkeeper/blob/main/lib/doorkeeper/rails/helpers.rb)
  * 引入helpers文件逻辑：[lib/doorkeeper/engine.rb](https://github.com/doorkeeper-gem/doorkeeper/blob/main/lib/doorkeeper/engine.rb)
    ```
    # 关键代码
    ActiveSupport.on_load(:action_controller) do
      include Doorkeeper::Rails::Helpers
    end
    ```
