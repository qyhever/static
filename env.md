CentOS 7

## Docker

1. 卸载旧版本（如有）：
```sh
sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
```

2. 安装依赖包：
```sh
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

3. 添加 Docker 官方仓库：
```sh
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

4. 安装 Docker Engine：
```sh
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

5. 启动 Docker 并设置开机自启：
```sh
sudo systemctl start docker
sudo systemctl enable docker
```

6. 验证安装：
```sh
docker --version
sudo docker run hello-world
```
如无报错即安装成功。
#### 问题
https://download.docker.com/linux/centos/7/x86_64/stable/repodata/repomd.xml: [Errno 14] curl#35 - "TCP connection reset by peer"

这个错误通常是网络问题导致无法连接 Docker 官方仓库，常见原因和解决办法如下：

1. **网络被墙/被限制**  
   Docker 官方源在中国大陆经常无法直接访问。建议切换为国内镜像源。

2. **使用阿里云 Docker 镜像源**  
   替换为阿里云镜像仓库，步骤如下：

```sh
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

然后再执行安装命令：

```sh
sudo yum makecache fast
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

3. **检查服务器防火墙和网络**  
   确保服务器能正常访问外网，必要时联系网络管理员。

4. **尝试多次或更换网络环境**  
   有时是临时网络波动，多试几次或更换网络环境。


## docker部署前端项目
推荐的 Dockerfile 写法如下，可以在镜像构建时自动执行 npm run build：

```dockerfile
# 构建阶段
FROM node:18-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:stable-alpine AS production-stage

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 拷贝自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝前端静态文件
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

nginx.conf 示例
```
server {
    listen 80;
    server_name localhost;
    # gzip config
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

这样只需将 Dockerfile 和 nginx.conf 放在项目根目录，直接构建镜像即可，无需手动本地 build。  
构建命令：
```sh
docker build -t my-vue3-app .
```
运行命令：
```sh
docker run -d -p 80:80 --name vue3-app my-vue3-app
```

### node:20-alpine拉取超时失败
可以在本地下载 node:20-alpine 镜像，然后上传到云服务器并导入，步骤如下：

1. 本地拉取镜像（有外网环境的电脑）：
```sh
docker pull node:20-alpine
```

2. 保存为 tar 文件：
```sh
docker save -o node20-alpine.tar node:20-alpine
```

3. 上传 node20-alpine.tar 到云服务器（用 scp、ftp、rz 等工具）。

4. 云服务器导入镜像：
```sh
docker load -i node20-alpine.tar
```

这样云服务器就有 node:20-alpine 镜像，无需在线拉取，可直接用于 Dockerfile 构建。  
同理，nginx 镜像也可以这样操作。
