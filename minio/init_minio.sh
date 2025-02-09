#!/bin/sh

echo "Aguardando o MinIO iniciar..."
sleep 5  # Wait setup minio

mc alias set local http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

mc mb local/products || echo "Bucket 'products' já existe."

mc anonymous set public local/products