# Debugging 500 Error on Token Refresh

## 🔍 Understanding the Errors

### What You're Seeing:
1. **401 Errors**: These are **NORMAL** - initial requests without tokens fail, then the interceptor refreshes and retries
2. **200 OK**: When you click the error, you see a successful response - this means the retry worked!
3. **500 Error on `/api/auth/refresh/`**: This is the **REAL PROBLEM**

### Why 401 Errors Appear:
- Frontend makes API calls on page load
- If no token or expired token → 401 error
- Axios interceptor catches 401 → tries to refresh token
- If refresh succeeds → retries original request → 200 OK ✅
- If refresh fails (500) → error persists ❌

## 🚨 The 500 Error Issue

The 500 error on `/api/auth/refresh/` suggests:

1. **Redis connection might be failing at runtime** (even though it passed at startup)
2. **JWT blacklist operation is failing** when trying to blacklist the old token
3. **Token serializer might be encountering an error**

## 🔧 How to Debug

### Step 1: Check Render Logs

Go to **Render Dashboard** → Your service → **Logs** tab

Look for:
- `✅ Redis cache configured successfully` - Redis is working
- `⚠️ Redis connection failed` - Redis not working
- `Token refresh error:` - This will show the actual error causing the 500

### Step 2: Check the Actual Error

The error handling I added will log the exact error. Look for lines like:
```
Token refresh error: [actual error message here]
```

Common errors:
- `ConnectionError` - Redis connection failed
- `TimeoutError` - Redis timeout
- `AttributeError` - Missing blacklist app
- `CacheError` - Cache backend issue

### Step 3: Verify Redis is Actually Working

Even if Redis connection test passes at startup, it might fail at runtime. Check:

1. **Upstash Dashboard**:
   - Go to [console.upstash.com](https://console.upstash.com)
   - Check if database is **Active**
   - Check **Metrics** - are commands being executed?
   - Check **Logs** - any connection errors?

2. **Redis URL Format**:
   - Should be: `rediss://default:password@host:port`
   - No quotes, no spaces
   - Verify in Render → Environment → `REDIS_URL`

## 🛠️ Quick Fixes

### Fix 1: Temporarily Disable Blacklist

If Redis is causing issues, temporarily disable blacklist:

In `settings.py`, change:
```python
'BLACKLIST_AFTER_ROTATION': False,  # Temporarily disable
```

This will make token refresh work, but tokens won't be invalidated on logout.

### Fix 2: Check Redis Connection String

Make sure your `REDIS_URL` in Render is exactly:
```
rediss://default:AbI6AAIncDI3N2MyOWFkMGVlNDA0NjBlYjk2NTdiYTk0YmVmZDRlZnAyNDU2MjY@dashing-tick-45626.upstash.io:6379
```

**Common mistakes:**
- ❌ Has quotes: `"rediss://..."`
- ❌ Has prefix: `REDIS_URL=rediss://...`
- ❌ Has spaces
- ✅ Correct: Just the connection string

### Fix 3: Test Redis Connection Manually

You can test if Redis is accessible from Render:

1. Go to Render → Your service → **Shell** (if available)
2. Or add a test endpoint temporarily:

```python
# In backend/accounts/views.py (temporary)
@api_view(['GET'])
@permission_classes([AllowAny])
def test_redis(request):
    from django.core.cache import cache
    try:
        cache.set('test', 'value', 60)
        value = cache.get('test')
        return Response({'status': 'Redis working', 'value': value})
    except Exception as e:
        return Response({'status': 'Redis failed', 'error': str(e)}, status=500)
```

## 📊 Expected Behavior

### If Everything Works:
- ✅ Initial 401 errors (normal)
- ✅ Token refresh succeeds (200 OK)
- ✅ Retry succeeds (200 OK)
- ✅ No 500 errors

### If Redis Fails:
- ⚠️ Initial 401 errors (normal)
- ❌ Token refresh fails (500 error)
- ❌ Retry fails (401 error)
- ❌ App doesn't work

## 🎯 Next Steps

1. **Check Render Logs** - Find the actual error message
2. **Share the error** - The log will show what's failing
3. **Verify Redis URL** - Make sure it's correct in Render
4. **Test Redis** - Check if it's actually accessible

## 💡 Most Likely Causes

Based on the symptoms:

1. **Redis connection string is wrong** - Check Render environment variables
2. **Redis is not accessible from Render** - Network/firewall issue
3. **Redis connection times out** - Increase timeout or check network
4. **Blacklist operation fails** - Redis might be read-only or have permission issues

**Share the error message from Render logs and I can help fix it!**
