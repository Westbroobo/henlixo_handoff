# Ubuntu Docker Deployment Notes

Server checked on 2026-06-02:

- Ubuntu 24.04.4 LTS
- Docker is not installed
- Ports 80, 443, 8000, 5174 are free
- Local PostgreSQL listens on 127.0.0.1:5432 and is not used by this first version

## Install Docker With Mirrors

Run on the server:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Configure Docker Hub mirror. This server appears to be on Tencent Cloud, so Tencent mirror is listed first.

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now docker
sudo systemctl restart docker
docker --version
docker compose version
```

## Deploy

After the repository is pulled on the server:

```bash
cd ~/henlixo_handoff
docker compose build
docker compose up -d
docker compose ps
```

Check:

```bash
curl -i http://127.0.0.1/api/health
curl -I http://127.0.0.1/
```

The first version exposes:

- Frontend: `http://SERVER_IP/`
- API through Nginx proxy: `http://SERVER_IP/api/health`

## Mirror Overrides

The compose file supports overriding package mirrors:

```bash
PIP_INDEX_URL=https://mirrors.cloud.tencent.com/pypi/simple \
NPM_REGISTRY=https://registry.npmmirror.com \
docker compose build
```

The backend Docker image uses `backend/requirements-prod.txt`, not the local test dependency file.
This keeps production builds smaller and avoids optional `uvicorn[standard]` packages that are slow to download.
