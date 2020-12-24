# doorkeeper使用
---

### config/initializers/doorkeeper.rb先加以下配置，支持三种模式
* grant_flows %w[authorization_code client_credentials password]

#### 一、Authorization Code（授权码模式）
* 先通过授权拿到code：[http://localhost:3000/oauth/authorize?client_id=g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=public](http://localhost:3000/oauth/authorize?client_id=g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=public)
* 然后根据code拿token
```ruby
body = {
  "code"=>"rd3Ned3A-SszIHYLYkwb3ofHqKoHxwYdaFD7O67Zxas",
  "grant_type"=>"authorization_code",
  "redirect_uri"=>"urn:ietf:wg:oauth:2.0:oob",
  "client_id"=>"g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic",
  "client_secret"=>"_AipOvmDrY86vDTsGFbnn771ihCKwEvmbbK-gEoHW5w"
}
JSON.parse(RestClient.post('http://localhost:3000/oauth/token', body))

返回
{
    "access_token": "nL4rKlvzEuBS25BnvsUoBOCn0pmLbUUJCKrnI3xbajE",
    "token_type": "Bearer",
    "expires_in": 7200,
    "refresh_token": "9_A-B-K2OIu9pQS56ZB2sF7oVf4vMVX2398h4W6UWNY",
    "scope": "code",
    "created_at": 1608803274
}
```
* 创建application时，其中的scope是和doorkeeper_authorize!(:xx)配合使用的
* [https://github.com/doorkeeper-gem/doorkeeper/wiki/Authorization-Code-Flow](https://github.com/doorkeeper-gem/doorkeeper/wiki/Authorization-Code-Flow)
---

#### 二、Password Credentials（密码模式，不关联application）
* 使用时添加配置来查询用户名密码对应的用户
```ruby
resource_owner_from_credentials do |routes|
  User.authenticate!(params[:username], params[:password])
end
```
* 请求token
```ruby
body = { grant_type: 'password', username: 'y', password: '123456' }
JSON.parse(RestClient.post('http://localhost:3000/oauth/token', body))

返回
{
  "access_token"=>"Zco7lhMF_HezKHOrQjh52B0egSGmpTpYplj1toJr9bs",
  "token_type"=>"Bearer",
  "expires_in"=>7200,
  "refresh_token"=>"-54ZQ2rDQrFUM5HIRVTdJOI2Km_sJ7gNQWM16GL-ZFY",
  "created_at"=>1608799840
}
```
* [https://github.com/doorkeeper-gem/doorkeeper/wiki/Client-Credentials-flow](https://github.com/doorkeeper-gem/doorkeeper/wiki/Client-Credentials-flow)
---

#### 三、Client Credentials（客户端模式，不关联resource_owner）
* 请求token
```ruby
body = {
  grant_type: 'client_credentials',
  client_id: 'g_mPbdbAzKnxh40bELkzFM1LdOXehg_80F-A2p17bic',
  client_secret: '_AipOvmDrY86vDTsGFbnn771ihCKwEvmbbK-gEoHW5w'
}
JSON.parse(RestClient.post('http://localhost:3000/oauth/token', body))

返回
{
  "access_token"=>"2kuAblp9pej3jh5s5wyUltcETjj17gzVoYvLlxVTtjg",
  "token_type"=>"Bearer",
  "expires_in"=>7200,
  "created_at"=>1608800298
}
```
* [https://github.com/doorkeeper-gem/doorkeeper/wiki/Client-Credentials-flow](https://github.com/doorkeeper-gem/doorkeeper/wiki/Client-Credentials-flow)
---

#### 四、调用接口传递token
* 在request headers中传
```ruby
{
  "Authrozation" => "Bearer xbtIoxLhobcLtjagL_8GnEOw_i08sW1XJFzmOaXnd9g"    
}
```
* 在controller中通过doorkeeper_authorize!进行认证
---
