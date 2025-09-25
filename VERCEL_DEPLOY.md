# 🚀 Deploy Scholarship Scraper to Vercel

## ⚡ One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPranavAchar01%2Fscholarship_scraper&env=COLLEGE_SCORECARD_API_KEY,NEXTAUTH_SECRET&project-name=scholarship-scraper&repository-name=scholarship_scraper)

## 🛠️ Manual Setup (5 minutes)

### Step 1: Deploy to Vercel

```bash
# Option A: Use the deploy script
npm run deploy:vercel

# Option B: Manual deployment
vercel --prod
```

### Step 2: Set Environment Variables

Go to your Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Required |
|----------|--------|----------|
| `COLLEGE_SCORECARD_API_KEY` | `SjxW5jlL9yKa38NVvt6Ea12BWOeKfECsM4l7dntW` | ✅ Yes |
| `NEXTAUTH_SECRET` | Generate random string | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `VERCEL` | `1` | ✅ Yes |

### Step 3: Test Your Deployment

1. Visit your Vercel URL
2. Fill out the scholarship form
3. Submit and verify results appear
4. Check that College Scorecard data loads

## 🎯 What You Get

✅ **Working College Scorecard Integration** - Real institutional data  
✅ **8+ Mock Scholarships** - Comprehensive test data  
✅ **AI-Powered Matching** - Optimized for Vercel  
✅ **Mobile Responsive Design** - Works on all devices  
✅ **Anonymous Usage** - No registration required  
✅ **Fast Performance** - Optimized for speed  
✅ **Automatic HTTPS** - Secure by default  
✅ **Global CDN** - Fast worldwide access  

## 🔧 Environment Variables Explained

### Required Variables

**COLLEGE_SCORECARD_API_KEY**
- **Value**: `SjxW5jlL9yKa38NVvt6Ea12BWOeKfECsM4l7dntW`
- **Purpose**: Access real college and university data
- **Impact**: Enables authentic scholarship matching

**NEXTAUTH_SECRET**
- **Value**: Generate a secure random string (32+ characters)
- **Purpose**: Security for session handling
- **Generate**: `openssl rand -base64 32`

**NODE_ENV**
- **Value**: `production`
- **Purpose**: Optimizes app for production use

**VERCEL**
- **Value**: `1`
- **Purpose**: Enables Vercel-specific optimizations

## 📱 Testing Your Deployment

### Quick Test

1. **Homepage**: Visit your Vercel URL
2. **Form**: Fill out academic info, demographics, skills
3. **Search**: Submit form and wait for results
4. **Results**: Should show 8+ scholarships with match scores

### API Test

```bash
curl -X POST https://your-app.vercel.app/api/scholarships/search \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": {
      "academic": {
        "gpa": 3.7,
        "gradeLevel": "undergraduate",
        "fieldOfStudy": "Computer Science",
        "graduationYear": 2026,
        "academicAchievements": []
      },
      "demographics": {
        "state": "California",
        "country": "United States"
      },
      "skills": ["JavaScript", "Python"],
      "interests": ["AI", "Technology"],
      "financialNeed": {
        "hasFinancialAid": true
      }
    }
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "scholarship": {
          "name": "STEM Innovation Grant",
          "provider": "Technology Education Council",
          "awardAmount": {
            "min": 2500,
            "max": 10000,
            "type": "renewable"
          }
        },
        "matchScore": 87,
        "reasons": ["Field of study matches", "GPA meets requirements"],
        "urgency": "medium"
      }
    ],
    "processing": {
      "totalProcessed": 11,
      "processingTime": 1245,
      "modelUsed": "vercel-optimized"
    }
  }
}
```

## 🚨 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
vercel --prod --force

# Check build logs
vercel logs
```

### API Not Working

1. **Check Environment Variables**: Ensure all required vars are set
2. **Check Function Logs**: View in Vercel Dashboard
3. **Test API Key**: Verify College Scorecard key is working
4. **Check Rate Limits**: API may be rate limited

### Slow Performance

- **Cold Starts**: First request may be slow (normal)
- **Caching**: Subsequent requests should be faster
- **Timeouts**: Functions timeout at 30s (also normal)

### No Results Showing

- **Check Console**: Look for JavaScript errors
- **Test API**: Use curl command above
- **Verify Data**: Ensure form data is valid

## 🔄 Adding More APIs Later

1. Get API keys for additional services
2. Update environment variables in Vercel
3. Modify `src/lib/api-clients.ts`
4. Redeploy automatically

## 📊 Monitoring

- **Vercel Analytics**: Enable in dashboard
- **Function Logs**: Real-time monitoring
- **Performance**: Core Web Vitals tracking
- **Usage**: API call volume and timing

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Modify logo and favicon in `public/`
- Edit text in `src/pages/index.tsx`

### Features
- Add more scholarship sources
- Customize matching algorithm
- Add user analytics
- Implement email notifications

## 🔒 Security

- **HTTPS**: Automatically enabled
- **Rate Limiting**: Built-in protection
- **Input Validation**: Comprehensive validation
- **No Data Storage**: Anonymous by design

## 📈 Performance

- **First Load**: ~2-3 seconds
- **API Response**: ~1-3 seconds
- **Cache Hits**: ~300ms
- **Global CDN**: Fast worldwide

---

## 🎉 Success!

Your scholarship matching platform is now live and helping students find educational opportunities!

**Share your app:**
- Send to students and educators
- Post on social media
- Submit to scholarship directories
- Add to your portfolio

**Next steps:**
- Monitor usage and feedback
- Add more scholarship sources
- Improve matching algorithms
- Scale based on demand

---

**Need help?** 
- 📖 Check the main [README.md](README.md)
- 🐛 [Open an issue](https://github.com/PranavAchar01/scholarship_scraper/issues)
- 💬 [Discussions](https://github.com/PranavAchar01/scholarship_scraper/discussions)