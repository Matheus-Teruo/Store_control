# Create and configurate bucket

To create a bucket using mc script use the following command on cmd:

### CMD

```
docker exec -i store_control_storage_1 sh -c "
  mc alias set local http://localhost:9000 ***USERNAME*** ***PASSWORD*** &&
  mc mb local/products &&
  mc anonymous set download local/products
"
```

### Inside storage container

First you need to get inside container, with command:

```
docker exec -it store_control_storage_1 bash
```

Second login with mc:

```
mc alias set local http://localhost:9000 ***USERNAME*** ***PASSWORD***
```

Third create the bucket:

```
mc mb local/products
```

Last run the command to execute the script:

```
mc anonymous set download local/products
```
