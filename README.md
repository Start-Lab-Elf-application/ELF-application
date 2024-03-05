### ELF-前端

##### 注意事项：

1、app使用electron（自行了解），打包很方便，几乎只需要编写前端

2、ui，布局另行讨论，暂定左右布局，左侧是菜单栏，选择压缩和解压，右侧是选取文件和提交部分

3、修改、提交前先拉取一次

4、默认下载的electron版本太高了，很多东西不兼容，使用渲染进程很多bug

##### 搭建流程：

1、下载node.js,配置环境变量（csdn上应该就有）

[node.js官网](https://nodejs.org/en)

2、安装cnpm

```shell
npm install cnpm -g  --registry=https://registry.npm.taobao.org
```

3、安装electron

```shell
cnpm install electron -g
```

4、使用 ide 连接 github 远程仓库

5、预览
```shell
electron .
```

###### TODO

打包的时候下载太tmd慢了，需要研究一下打包
