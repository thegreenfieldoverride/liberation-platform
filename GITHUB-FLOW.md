# 🚀 Greenfield Override - GitHub Flow Deployment

## 📋 **How It Works**

We use **GitHub Flow** - one main branch with manual environment releases via GitHub Actions.

### **Automatic Deployments**
- ✅ **Push to `main`** → Auto deploys to **staging** environment
- ✅ Staging runs on port **3001** at `staging.greenfieldoverride.com`

### **Manual Production Releases** 
- 🔧 **GitHub Actions UI** → Choose environment + git ref → Deploy!
- ✅ Production runs on port **3000** at `greenfieldoverride.com`

---

## 🎯 **Deployment Workflow**

### **Daily Development**
```bash
# Work on main branch
git checkout main
git pull origin main

# Make your changes
git add .
git commit -m "Add new feature"
git push origin main

# ✅ Automatically deploys to staging!
```

### **Production Releases**
1. Go to **GitHub** → **Actions** tab
2. Click **"🚀 Liberation Platform Deploy"** workflow
3. Click **"Run workflow"** button
4. Choose:
   - **Environment**: `production`
   - **Git ref**: `main` (or specific commit/tag)
5. Click **"Run workflow"**
6. ✅ **Done!** Production is updated

---

## 🌍 **Environment URLs**

| Environment | URL | Port | Auto Deploy |
|-------------|-----|------|-------------|
| **Staging** | https://staging.greenfieldoverride.com | 3001 | ✅ On push to main |
| **Production** | https://greenfieldoverride.com | 3000 | 🔧 Manual via GitHub UI |

---

## 🔧 **Advanced Usage**

### **Deploy Specific Commit to Production**
1. Find commit SHA you want to deploy
2. GitHub Actions → Run workflow
3. Set **Git ref** to commit SHA (e.g., `a1b2c3d`)
4. Choose **Environment**: `production`

### **Emergency Rollback**
1. GitHub Actions → Run workflow  
2. Set **Git ref** to previous working commit
3. Choose **Environment**: `production`
4. Deploy instantly!

### **Feature Testing on Staging**
```bash
# Deploy feature branch to staging for testing
git push origin feature-branch
```
Then manually deploy the feature branch to staging via GitHub Actions.

---

## 🎉 **Benefits**

✅ **Simple**: One branch to manage (`main`)  
✅ **Safe**: Manual production control  
✅ **Fast**: Auto staging for quick feedback  
✅ **Flexible**: Deploy any commit to any environment  
✅ **Visible**: GitHub UI shows all deployments  
✅ **Auditable**: Track who deployed what when  

---

## 🗑️ **Old Workflow (Deprecated)**

~~The old production branch workflow is no longer needed:~~
```bash
# ❌ Old way (don't do this anymore)
git checkout production
git merge main
git push origin production
```

**Now just use the GitHub Actions UI for production deploys!** 🎉

---

## 🆘 **Troubleshooting**

### **Staging Deploy Failed**
- Check GitHub Actions logs
- Probably a build/test failure
- Fix on main branch and push again

### **Production Deploy Failed**  
- Check GitHub Actions logs in the failed workflow run
- Can retry the same workflow run
- Or run a new deployment with a different git ref

### **Want to Deploy Hotfix**
1. Make fix on main branch
2. Push to main (deploys to staging)
3. Test on staging
4. Manual deploy main to production via GitHub Actions

**Need help?** Check the Actions tab for detailed logs of any deployment.