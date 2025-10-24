# 🚀 Liberation Platform - Deployment Guide

**Complete deployment guide for AI agents and developers**

## 📋 **Overview**

The Liberation Platform uses **GitHub Flow** with **zero-downtime blue-green deployments** via GitHub Actions. All deployments are triggered through GitHub's web interface or API - no manual server access required.

### **Deployment Architecture**
- **Branch Strategy**: Single `main` branch (GitHub Flow)
- **Environments**: `staging` (auto) + `production` (manual)
- **Strategy**: Blue-green containers for zero downtime
- **CI/CD**: GitHub Actions with automated testing
- **Dependencies**: Dependabot with auto-staging for security updates

---

## 🎯 **Quick Reference**

| Action | Method | Downtime | Use Case |
|--------|--------|----------|----------|
| **Development** | Push to `main` | 0 seconds* | Auto-deploy to staging |
| **Production** | GitHub Actions UI | ~1 second | Manual production releases |
| **Emergency** | GitHub Actions UI | ~1 second | Rollback to any commit |
| **Rollback** | GitHub Actions UI | ~1 second | Deploy previous version |

*Staging environment only

---

## 🔄 **Standard Deployment Workflow**

### **Daily Development (Automatic)**
```bash
# 1. Work on main branch
git checkout main
git pull origin main

# 2. Make changes
git add .
git commit -m "Add new feature"
git push origin main

# 3. Automatic staging deployment triggered
# ✅ Site automatically deployed to staging.greenfieldoverride.com
```

### **Production Release (Manual)**
1. **Navigate to GitHub Actions**
   - URL: `https://github.com/thegreenfieldoverride/liberation-platform/actions`

2. **Select Deployment Workflow**
   - Click: `🔄 Blue-Green Liberation Platform Deploy`

3. **Configure Deployment**
   - Click: `Run workflow` button
   - **Environment**: `production`
   - **Git ref**: `main` (or specific commit SHA)
   - **Strategy**: `blue-green` (recommended)

4. **Execute Deployment**
   - Click: `Run workflow`
   - Monitor progress in Actions tab
   - Deployment completes in ~5-7 minutes
   - Actual downtime: ~1 second

---

## 🏗 **Deployment Environments**

### **Staging Environment**
- **URL**: `https://staging.greenfieldoverride.com`
- **Port**: `3001`
- **Trigger**: Automatic on push to `main`
- **Purpose**: Integration testing, Dependabot validation
- **Container**: `liberation-platform-staging`

### **Production Environment**
- **URL**: `https://greenfieldoverride.com`
- **Port**: `3000`
- **Trigger**: Manual via GitHub Actions
- **Purpose**: Live user-facing site
- **Container**: `liberation-platform-production-blue` OR `liberation-platform-production-green`

---

## 🔧 **Technical Implementation**

### **Blue-Green Deployment Process**
1. **Build Phase** (no downtime)
   ```bash
   # New image built with timestamp
   docker build -t liberation-platform:production-20241024-143022
   ```

2. **Green Deployment** (no downtime)
   ```bash
   # Start new container on temporary port
   docker run -d --name liberation-platform-production-green -p 3100:3000 [image]
   # Health check on temporary port
   curl http://localhost:3100/api/health
   ```

3. **Traffic Switch** (~1 second downtime)
   ```bash
   # Stop blue container
   docker stop liberation-platform-production-blue
   # Start green on production port
   docker run -d --name liberation-platform-production-green -p 3000:3000 [image]
   ```

4. **Cleanup** (no downtime)
   ```bash
   # Remove old blue container
   docker rm liberation-platform-production-blue
   # Clean old images (keep 3 most recent)
   ```

### **Health Check System**
- **Endpoint**: `/api/health`
- **Timeout**: 3 seconds per check
- **Retries**: 3 attempts
- **Interval**: 30 seconds (running containers)
- **Startup**: 10 seconds (new containers)

### **Image Management**
- **Naming**: `liberation-platform:{environment}-{timestamp}`
- **Retention**: Keep current + 2 previous versions
- **Cleanup**: Automatic during deployment
- **Rollback**: Any previous image can be redeployed

---

## 🤖 **API-Based Deployment**

### **GitHub CLI (Recommended for Automation)**
```bash
# Install GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# Authenticate
gh auth login

# Deploy to production
gh workflow run "deploy-blue-green.yml" \
  --repo thegreenfieldoverride/liberation-platform \
  --ref main \
  --field environment=production \
  --field git_ref=main \
  --field strategy=blue-green

# Deploy specific commit
gh workflow run "deploy-blue-green.yml" \
  --repo thegreenfieldoverride/liberation-platform \
  --ref main \
  --field environment=production \
  --field git_ref=a1b2c3d4 \
  --field strategy=blue-green
```

### **REST API (For Custom Integration)**
```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/thegreenfieldoverride/liberation-platform/actions/workflows/deploy-blue-green.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "environment": "production",
      "git_ref": "main",
      "strategy": "blue-green"
    }
  }'
```

---

## 🧪 **Testing & Validation**

### **Pre-Deployment (Automatic)**
- **Linting**: Code style validation
- **Type Checking**: TypeScript compilation
- **Build Test**: Next.js production build
- **Security Audit**: NPM vulnerability scan
- **Docker Build**: Container creation test
- **Container Test**: Startup and health check

### **Post-Deployment (Automatic)**
- **Health Check**: `/api/health` endpoint verification
- **Response Test**: HTTP 200 status confirmation
- **Container Status**: Docker health check validation
- **Port Binding**: Network connectivity verification

### **Manual Testing Checklist**
- [ ] Site loads correctly
- [ ] Navigation functions properly
- [ ] Liberation tools are accessible
- [ ] AI Co-Pilot initializes
- [ ] No console errors
- [ ] SSL certificate valid

---

## 🚨 **Emergency Procedures**

### **Immediate Rollback**
If production deployment fails or causes issues:

1. **Quick Rollback via GitHub Actions**
   ```
   Workflow: 🔄 Blue-Green Liberation Platform Deploy
   Environment: production
   Git ref: [previous working commit SHA]
   Strategy: blue-green
   ```

2. **Find Previous Working Commit**
   ```bash
   # View recent commits
   git log --oneline -10
   
   # Use commit before problematic deploy
   # Example: abc123d (working) -> def456e (broken)
   # Deploy abc123d
   ```

### **Server-Level Emergency Access**
```bash
# SSH to server (emergency only)
ssh deploy-bot@liberation-server

# Check container status
docker ps
docker logs liberation-platform-production-green

# Manual container restart (if needed)
docker restart liberation-platform-production-green

# Check server resources
htop
df -h
```

---

## 🔒 **Security Configuration**

### **Required GitHub Secrets**
| Secret Name | Purpose | Example Value |
|-------------|---------|---------------|
| `HETZNER_SSH_KEY` | Server access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `HETZNER_HOST` | Server IP | `your.server.ip` |
| `HETZNER_USER` | SSH username | `deploy-bot` |

### **Branch Protection Rules**
```
Branch: main
☑️ Require pull request before merging
☑️ Require status checks: "✅ CI Success"
☑️ Require up-to-date branches
☑️ Restrict pushes that create large files
☑️ Include administrators
```

### **Environment Protection**
- **Staging**: No protection (auto-deploy)
- **Production**: Manual approval required via GitHub Actions

---

## 📊 **Monitoring & Observability**

### **Deployment Monitoring**
- **GitHub Actions**: Real-time deployment logs
- **Container Health**: Docker health checks every 30s
- **Application Health**: `/api/health` endpoint monitoring
- **Resource Usage**: Server CPU/memory monitoring

### **Key Metrics**
- **Deployment Time**: ~5-7 minutes total
- **Downtime**: ~1 second (traffic switch)
- **Success Rate**: Track in GitHub Actions history
- **Rollback Time**: ~5-7 minutes (same as deployment)

### **Log Locations**
- **GitHub Actions**: Full deployment logs with timestamps
- **Container Logs**: `docker logs liberation-platform-production-green`
- **Application Logs**: Inside container at `/var/log/`
- **Server Logs**: `/var/log/syslog`, `/var/log/docker.log`

---

## 🤖 **For AI Agents: Critical Instructions**

### **Deployment Decision Matrix**
```
IF: Emergency production issue
THEN: Use GitHub Actions rollback (previous commit)

IF: Regular feature deploy
THEN: Merge to main → auto staging → test → manual production

IF: Security vulnerability 
THEN: Wait for Dependabot PR → auto staging → verify → merge

IF: Hotfix needed
THEN: Create PR → merge to main → manual production deploy

IF: Multiple environment deploy needed
THEN: Use blue-green workflow for each environment separately
```

### **Validation Steps (Always Execute)**
1. Verify GitHub Actions workflow exists: `deploy-blue-green.yml`
2. Confirm required secrets are configured in repo settings
3. Check branch protection rules are active on main
4. Test staging deployment before production
5. Monitor health checks during deployment
6. Verify rollback capability after successful deploy

### **Error Handling**
- **Failed health check**: Automatic rollback to previous container
- **Build failure**: Deployment stops, no changes to production
- **SSH connection failure**: Check server status, retry with exponential backoff
- **Container startup failure**: Check resource usage, verify image integrity

---

## 📞 **Support & Troubleshooting**

### **Common Issues**

**Issue**: "ssh-private-key argument is empty"
**Solution**: Verify `HETZNER_SSH_KEY` secret exists in GitHub repo settings

**Issue**: "Health check failed"
**Solution**: Check container logs, verify application starts correctly

**Issue**: "Port already in use"
**Solution**: Blue-green deployment handles this automatically

**Issue**: "Docker build failed"
**Solution**: Check Dockerfile syntax, verify base image availability

### **Debugging Commands**
```bash
# Check deployment status
gh workflow list --repo thegreenfieldoverride/liberation-platform

# View recent workflow runs
gh run list --repo thegreenfieldoverride/liberation-platform

# Get specific run details
gh run view [RUN_ID] --repo thegreenfieldoverride/liberation-platform
```

---

## 📝 **Change Log**

- **2024-10**: Initial GitHub Flow implementation
- **2024-10**: Added blue-green zero-downtime deployment
- **2024-10**: Integrated CI/CD pipeline with PR testing
- **2024-10**: Added Dependabot for automated dependency management

---

**This document provides complete deployment instructions for human developers and AI agents. All procedures are automated through GitHub Actions for consistency and reliability.**