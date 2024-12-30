import os
import mysql.connector
from mysql.connector import Error

# Set your database connection parameters
db_config = {
    'host': os.getenv('LANGUAGE_LEARNING_DB_HOST', '127.0.0.1'),  # or 'host.docker.internal' if on host
    'user': os.getenv('LANGUAGE_LEARNING_DB_USER', 'lang_user'),
    'password': os.getenv('LANGUAGE_LEARNING_DB_PASSWORD', 'tC/g0ZTzkVSBj4Mq'),
    'database': os.getenv('LANGUAGE_LEARNING_DB', 'language_learning'),
    'port': os.getenv('LANGUAGE_LEARNING_DB_PORT', '3306')
}

try:
    # Attempt to connect to the database
    connection = mysql.connector.connect(**db_config)
    if connection.is_connected():
        print("Successfully connected to the database")
except Error as e:
    print(f"Error: {e}")
finally:
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("Database connection closed")