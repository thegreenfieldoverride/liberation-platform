# 🛡️ Liberation Guardian Deployment Guide

**Independent Guardian deployment for the Liberation Platform**

## 🎯 **Overview**

Liberation Guardian is deployed separately from the main Liberation Platform to allow:
- **Independent updates** - Update Guardian without redeploying web app/analytics
- **Version pinning** - Deploy specific Guardian versions for stability  
- **Secure secrets** - Keep API keys in private platform repo, not open source Guardian repo
- **Proven approach** - Build from Dockerfile until Docker Hub deployment is validated

## 🚀 **Deployment Options**

### **Option 1: GitHub Actions** ⭐ **RECOMMENDED FOR PRODUCTION**

**Location**: `.github/workflows/deploy-guardian.yml`

**Usage**:
1. Go to GitHub → Actions → "Deploy Liberation Guardian"
2. Click "Run workflow"
3. Select Guardian branch/tag (e.g., `main`, `v1.2.0`)
4. Choose environment (`production` or `staging`)
5. Click "Run workflow"

**Benefits**:
- ✅ Secure secrets management
- ✅ Deployment history and logs
- ✅ Automated health checks
- ✅ Rollback capability

### **Option 2: Manual Script** 

**Location**: `scripts/deploy-guardian.sh`

**Usage**:
```bash
# Deploy main branch to production
./scripts/deploy-guardian.sh main production

# Deploy specific version to staging  
./scripts/deploy-guardian.sh v1.2.0 staging
```

**Benefits**:
- ✅ Quick for testing and development
- ✅ Direct server access
- ✅ Immediate feedback

## ⚙️ **Required Secrets**

Add these to your GitHub repository secrets:

```bash
# GitHub Repository Settings → Secrets → Actions

# Required for Guardian AI functionality
GOOGLE_API_KEY=your_gemini_api_key_here

# Required for GitHub integration  
GUARDIAN_GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_WEBHOOK_SECRET=dbf9ef9c94b29bc90b18e1232f886a7bb91b3d07d0ae474f71808fe4912a1e60

# Optional for enhanced AI capabilities
ANTHROPIC_API_KEY=your_claude_api_key_here

# Your existing Hetzner server credentials
HETZNER_HOST=your_server_ip
HETZNER_USER=deploy-bot  
HETZNER_SSH_KEY=your_private_ssh_key
```

## 🔧 **How It Works**

### **Build Process**:
1. **Clone/update** Guardian repo on server at specific branch/tag
2. **Build Docker image** from Guardian's Dockerfile  
3. **Stop old Guardian** container gracefully
4. **Start new Guardian** with secrets as environment variables
5. **Health check** to ensure Guardian is responding
6. **Clean up** old Docker images to save space

### **Service Architecture**:
```
Liberation Platform (Hetzner Server)
├── Web App (port 3000/3001) - Deployed via platform pipeline
├── Analytics (port 8082) - Deployed via platform pipeline  
└── Guardian (port 9000) - Deployed independently ⭐
```

## 🎯 **Guardian Configuration**

Guardian gets these environment variables during deployment:

```bash
# AI Configuration
GOOGLE_API_KEY=your_key
ANTHROPIC_API_KEY=your_key (optional)

# GitHub Integration
GITHUB_TOKEN=your_token
GITHUB_WEBHOOK_SECRET=your_secret

# Platform Integration
LIBERATION_ANALYTICS_URL=http://host.docker.internal:8082
LIBERATION_ANALYTICS_TOKEN=analytics_109b9bad825a594847af51abd7b0fa25469239ef24c33fc220d4dcd7038101f3

# Application Settings
ENVIRONMENT=production
LOG_LEVEL=info
PORT=9000
TRUST_LEVEL=2

# Redis Settings (for local Redis)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📊 **Guardian Endpoints**

After deployment, Guardian provides:

- **Health**: `http://your-server:9000/health`
- **GitHub Webhooks**: `http://your-server:9000/webhook/github`
- **Custom Webhooks**: `http://your-server:9000/webhook/custom/[source]`
- **Status API**: `http://your-server:9000/api/v1/status`

## 🔍 **Verification & Monitoring**

### **Quick Health Check**:
```bash
curl http://your-server:9000/health
```

**Expected Response**:
```json
{
  "ai_client_healthy": true,
  "service": "liberation-guardian", 
  "status": "healthy",
  "timestamp": "2025-10-28T16:32:04.733279-07:00",
  "uptime": "56.886558375s",
  "version": "1.0.0"
}
```

### **Monitor Logs**:
```bash
ssh your-server
docker logs liberation-guardian-production -f
```

### **Check Container Status**:
```bash
ssh your-server  
docker ps | grep guardian
```

## 🚀 **Next Steps After Deployment**

1. **Test Guardian health endpoint**
2. **Configure GitHub webhooks** for repositories you want Guardian to monitor
3. **Monitor Guardian logs** for initial events
4. **Create test PR** to verify dependency automation
5. **Adjust trust level** based on comfort with automation

## 🔄 **Future: Docker Hub Deployment**

Once Guardian is proven stable, we can switch to:
- **Guardian repo pushes** to Docker Hub/GHCR on releases
- **Platform repo pulls** pre-built images instead of building
- **Faster deployments** and consistent images across environments

## 📞 **Troubleshooting**

### **Common Issues**:

**Guardian won't start**: Check environment variables and Docker logs
**Port conflicts**: Ensure port 9000 is available
**GitHub webhooks failing**: Verify webhook secret matches
**AI API errors**: Check API key validity and quotas

### **Rollback**:
```bash
# Via GitHub Actions: Deploy previous working version
# Via manual script: ./scripts/deploy-guardian.sh [previous-working-ref] production
```

---

**Guardian deployment is now independent and secure!** 🛡️