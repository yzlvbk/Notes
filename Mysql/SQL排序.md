# SQL排序

- 为了方便查看数据，可以对数据进行排序
- 语法：

```
select * from 表名
order by 列1 asc|desc,列2 asc|desc,...
```

- 将行数据按照列1进行排序，如果某些行列1的值相同时，则按照列2排序，以此类推
- 默认按照列值从小到大排列
- asc从小到大排列，即升序
- desc从大到小排序，即降序
- 查询未删除男生学生信息，按学号降序

```
select * from students
where gender=1 and isdelete=0
order by id desc;
```

- 查询未删除科目信息，按名称升序

```
select * from subject
where isdelete=0
order by stitle;
```