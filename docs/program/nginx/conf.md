# conf配置文件
---

### 例子
```Nginx
server {
  server_name xxx.com;
  listen 443 ssl; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/mini.rcer666.cn/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/mini.rcer666.cn/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  # 上面Certbot是用到了letsencrypt

  # 相关访问日志
  access_log /etc/nginx/log/motor-mini/access.log;
  error_log /etc/nginx/log/motor-mini/error.log;

  # 该项用于反向代理到某个服务
  location / {
  	proxy_redirect     off;
  	proxy_set_header   Host $host;
  	proxy_set_header   X-Forwarded-Host $host;
  	proxy_set_header   X-Forwarded-Server $host;
  	proxy_set_header   X-Real-IP        $remote_addr;
  	proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
  	proxy_buffering    on;
  	proxy_pass         http://127.0.0.1:3000;
  }

  # dns解析
  resolver 8.8.8.8;

  # 例如访问xxx.com/download?url=https://www.baidu.com 就会跳到百度
  location ~/download {
      if ($query_string ~*  ^(.*)url=(.*)$){
          set $url $2;
          proxy_pass $url;
      }
  }

  # 这里开放访问的图片地址
  location ~ .*\.(jpg|png)$  {
  	root /etc/nginx/images;
  	#expires	7d;
  }
}

# 该项可以重定向http到https
#server {
#  listen 80;
#  server_name xxx.com;
#
#  rewrite ^(.*)$  https://$host$1 permanent;
#}
```
