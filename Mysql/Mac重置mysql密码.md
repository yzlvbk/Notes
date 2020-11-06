### Mac重置mysql密码

##### 1.关闭mysql服务器

```bash
sudo /usr/local/mysql/support-files/mysql.server stop
```

##### 2.进入目录

```bash
cd /usr/local/mysql/bin
```

##### 3.获取权限

```bash
sudo su
```

##### 4.重启服务器

```bash
./mysqld_safe --skip-grant-tables &
```

##### 5.control + D退出编辑

##### 6.配置短命令

```bash
alias mysql=/usr/local/mysql/bin/mysql
```

##### 7.进入mysql命令模式

```bahs
mysql
```

##### 8.进入mysql数据库

```bash
use mysql
```

##### 9.获取更改权限

```bash
flush privileges;
```

##### 10.重置密码

```bash
SET PASSWORD FOR root@localhost = '123456';
```

