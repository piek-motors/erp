import psycopg2
from config import host, user, password, db_name, port
import csv
from psycopg2.extras import Json
connection = None  

try:
    connection = psycopg2.connect(
    host=host,
    user=user,
    password=password,
    database=db_name,
    port=port
    )

    cursor = connection.cursor()
    cursor.execute(
            "SELECT version();"
    )
    print(f"Server version: {cursor.fetchone()}")

    with open('./materials.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            # print(row)
            id = row[0]
            name = row[1]
            density = row[3]
            linearMass = row[5]
            name_splited = name.split(sep='ф', maxsplit=-1)
            if (len(name_splited) < 2): 
                continue
            namespl = list(filter(None, name_splited[1].split(' ')))

            diameter = namespl[0].split(',')[0]
            alloy = f"{namespl[1]} {namespl[2]}"
            isCalibrated = "калибровка" in name
            print(diameter)

            cursor.execute("""
INSERT INTO metal_pdo.materials (id, shape_data, unit, shape)
VALUES (%s, %s, %s, %s);
""", (id, Json({
    "diameter": float(diameter),
    "alloy": alloy,
    "calibrated": isCalibrated,
    "density": int(density),
    "linearMass" : float(linearMass.replace(',', ".")) 
}), 0, 0))
    connection.commit()


except Exception as _ex:
    print("[INFO]Error while working with PostgreSQL", _ex)
finally:
    if connection:
        connection.close()
        print("[INFO] PostgreSQL connection closed")

