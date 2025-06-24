import pymysql
import csv

# Conexão com o banco
conn = pymysql.connect(
    host='127.0.0.1',
    port=3308,
    user='root',
    password='root5007',
    database='root',
    cursorclass=pymysql.cursors.DictCursor
)

# Query para pegar todos os stands ativos
GET_STANDS_QUERY = """
    SELECT s.uuid AS stand_uuid, f.function_name
    FROM stands s
    JOIN functions f ON f.uuid = s.uuid
    WHERE f.valid = 1;
"""

# Template da query de vendas por estande com colunas novas
DATA_QUERY_TEMPLATE = """
    SELECT 
        p.product_name,
        i.quantity,
        i.unit_price,
        i.discount AS unit_discount,
        (i.unit_price - i.discount) AS final_price,
        (i.quantity * (i.unit_price - i.discount)) AS total,
        DATE_SUB(pu.purchase_time_stamp, INTERVAL 3 HOUR) AS timestamp
    FROM items i
    JOIN products p ON p.uuid = i.product_uuid
    JOIN purchases pu ON pu.uuid = i.purchase_uuid
    JOIN volunteers v ON v.uuid = pu.voluntary_uuid
    WHERE i.valid = 1
      AND pu.stand_uuid = %s
    ORDER BY pu.purchase_time_stamp ASC;
"""

try:
    with conn.cursor() as cursor:
        cursor.execute(GET_STANDS_QUERY)
        stands = cursor.fetchall()

        for stand in stands:
            stand_uuid = stand['stand_uuid']
            name = stand['function_name'].replace(' ', '_').replace('/', '_').lower()
            filename = f"{name}_log.csv"
            print(f"Exportando: {filename}")

            cursor.execute(DATA_QUERY_TEMPLATE, (stand_uuid,))
            results = cursor.fetchall()

            fieldnames = [
                "product_name",
                "quantity",
                "unit_price",
                "unit_discount",
                "final_price",
                "total",
                "timestamp"
            ]

            with open(filename, mode='w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(results)

        print("✅ Exportações finalizadas!")

finally:
    conn.close()
