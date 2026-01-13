# How to Deploy ECR Image to EC2

This guide explains how to manually run your backend on an EC2 instance by pulling the image from ECR.

## Prerequisites
1. **EC2 Instance**: Launch an instance (Amazon Linux 2 recommended).
2. **IAM Role**: The EC2 instance must have an IAM Role attached with the `AmazonEC2ContainerRegistryReadOnly` policy. (This allows it to download your image).
3. **Security Group**: Open **Port 80** (HTTP) in the instance's Security Group (Inbound Rules).

## Steps

### 1. Connect to EC2
SSH into your instance:
```bash
ssh -i "your-key.pem" ec2-user@your-public-ip
```

### 2. Install Docker
Run these commands to install and start Docker (works on Amazon Linux 2023):
```bash
sudo dnf update -y
sudo dnf install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```
*Note: After the last command, type `exit` and SSH back in to refresh permissions.*

### 3. Login to ECR
Run this command to authenticate Docker with your ECR registry:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 156433664583.dkr.ecr.us-east-1.amazonaws.com
```

### 4. Pull your Image
Download the latest version of your backend:
```bash
docker pull 156433664583.dkr.ecr.us-east-1.amazonaws.com/elden-ring-wesite:latest
```

### 5. Run the Container
Start the server in the background, mapping port 80 (web) to 8080 (container):
```bash
docker run -d -p 80:8080 \
  --name elden-ring-backend \
  --restart always \
  -e NODE_ENV=production \
  156433664583.dkr.ecr.us-east-1.amazonaws.com/elden-ring-wesite:latest
```

### 6. Get your URL
Your API URL is now: `http://<your-ec2-public-ip>`
You can use this value for `VITE_API_URL` in your frontend configuration.
