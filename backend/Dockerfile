FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ARG PIP_INDEX_URL=https://mirrors.cloud.tencent.com/pypi/simple

WORKDIR /app

COPY requirements-prod.txt .
RUN pip install --no-cache-dir --timeout 60 -i "${PIP_INDEX_URL}" -r requirements-prod.txt \
    || pip install --no-cache-dir --timeout 60 -i "https://pypi.tuna.tsinghua.edu.cn/simple" -r requirements-prod.txt \
    || pip install --no-cache-dir --timeout 60 -i "https://pypi.org/simple" -r requirements-prod.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
