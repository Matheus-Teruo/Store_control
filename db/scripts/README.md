# Dump Data

To create a dump data using the script sql use the following command on cmd:

### CMD

```
docker exec -i store_control-db-1 \
 mysql -u ***USERNAME*** -p ***PASSWORD*** store-control-dev < /aux-scripts/dump_data_tokens.sql
```

or

```
docker exec -i store_control-db-1 \
 mysql -u ***USERNAME*** -p ***PASSWORD*** store-control-dev < /aux-scripts/dump_data_order.sql
```

### Inside mySQL container

First you need to get inside container, with command:

```
docker exec -it store_control-db-1 bash
```

Second login with mysql:

```
mysql -u ***USERNAME*** -p
```

Third select the database:

```
USE store-control-dev;
```

Last run the command to execute the script:

```
source /aux-scripts/dump_data_tokens.sql;
```

or

```
source /aux-scripts/dump_data_order.sql;
```
