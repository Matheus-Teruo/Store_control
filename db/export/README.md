This file will exist to export the csv or another files type

### Comand to mysqldump

```
mysqldump -u root -p -T/var/lib/mysql-files store_control users --fields-terminated-by=,
```

Note: mysql have a --secure-file-priv and the file are destinated only to this path