import os
import sys

def create_test_files():
    # Create test directory
    os.makedirs('db_test', exist_ok=True)
    
    # Create Dockerfile
    dockerfile = '''FROM python:3.10-slim
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential
WORKDIR /app
RUN pip install mysql-connector-python python-dotenv
COPY test_db.py .
ENV PYTHONUNBUFFERED=1
CMD ["python", "test_db.py"]'''
    
    # Create test_db.py
    test_script = '''import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

# Check socket
socket_path = '/cloudsql/wizling:us-central1:s-layden-mysql'
print(f"Socket exists: {os.path.exists(socket_path)}")

# Database connection
config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('CMS_DB'),
    'unix_socket': socket_path,
    'auth_plugin': 'caching_sha2_password'
}

try:
    conn = mysql.connector.connect(**config)
    print("Successfully connected to database")
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE()")
    result = cursor.fetchone()
    print(f"Connected to database: {result[0]}")
    conn.close()
except Exception as e:
    print(f"Error connecting to database: {e}")'''

    # Create .env file template
    env_template = '''DB_USER=llservice
CMS_DB=language_learning_cms
DB_PASSWORD=your_password_here'''

    # Write files
    with open('db_test/Dockerfile', 'w') as f:
        f.write(dockerfile)
    
    with open('db_test/test_db.py', 'w') as f:
        f.write(test_script)
    
    with open('db_test/.env.template', 'w') as f:
        f.write(env_template)

    print("Created test files in db_test/")
    print("To use:")
    print("1. cd db_test")
    print("2. cp .env.template .env")
    print("3. Update DB_PASSWORD in .env")
    print("4. Build: docker build -t db-test .")
    print("5. Run: docker run --env-file .env db-test")

if __name__ == '__main__':
    create_test_files()