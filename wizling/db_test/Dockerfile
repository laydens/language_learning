FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    netcat-openbsd \
    curl \
    telnet \
    procps \
    vim

WORKDIR /app
RUN pip install pymysql python-dotenv

COPY test_db.py .
COPY debug_server.py .
ENV PYTHONUNBUFFERED=1

CMD ["python", "debug_server.py"]