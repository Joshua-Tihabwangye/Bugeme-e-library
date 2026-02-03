"""
Django settings for elibrary project.
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

from urllib.parse import urlparse, parse_qsl

import cloudinary

# Initialize logger
logger = logging.getLogger(__name__)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Explicitly load .env from the same directory as settings.py (elibrary/.env)
load_dotenv(Path(__file__).resolve().parent / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-me')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# ALLOWED_HOSTS configuration for production
RENDER_EXTERNAL_HOSTNAME = os.getenv('RENDER_EXTERNAL_HOSTNAME')
VERCEL_URL = os.getenv('VERCEL_URL')

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS = [RENDER_EXTERNAL_HOSTNAME, 'localhost', '127.0.0.1']
elif VERCEL_URL:
    ALLOWED_HOSTS = [VERCEL_URL, 'bugema-e-library.vercel.app', '.vercel.app', 'localhost', '127.0.0.1']
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'bugema-e-library.vercel.app']

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.postgres', 
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    'django_ratelimit',
    'django_filters',
    'cloudinary',
    'cloudinary_storage',
]

LOCAL_APPS = [
    'accounts',
    'catalog',
    'analytics',
    'reading',
    'subscriptions',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

AUTH_USER_MODEL = 'accounts.User'

AUTHENTICATION_BACKENDS = [
    'accounts.backends.EmailOrIdBackend',
    'django.contrib.auth.backends.ModelBackend',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'analytics.middleware.AnalyticsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]
MIDDLEWARE += [
    "accounts.middleware.last_seen.UpdateLastSeenMiddleware",
]


ROOT_URLCONF = 'elibrary.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database Configuration
# Use environment variable if available, otherwise use the default Neon DB connection
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    'postgresql://neondb_owner:npg_H5wszTpZiW3a@ep-morning-union-ahzk3wvm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
)

DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        ssl_require=True,
        conn_health_checks=True,
    )
}

# Override connection lifetime: close after every request (good for serverless/local dev)
DATABASES["default"]["CONN_MAX_AGE"] = 0



# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authentication.SingleSessionJWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
}

# CACHE Configuration - Use Redis if available, fallback to local memory cache
# IMPORTANT: This must be defined BEFORE JWT config because JWT blacklist needs Redis
REDIS_URL = os.getenv('REDIS_URL', '')
REDIS_AVAILABLE = False

# Try to connect to Redis if URL is provided
if REDIS_URL:
    try:
        import redis
        import logging
        logger = logging.getLogger(__name__)
        
        # Test connection with timeout - handle both redis:// and rediss:// (SSL)
        # Note: rediss:// requires ssl_cert_reqs=None for some providers
        r = redis.from_url(
            REDIS_URL,
            socket_connect_timeout=5,
            socket_timeout=5,
            decode_responses=False,
            ssl_cert_reqs=None  # Allow self-signed certificates for cloud Redis
        )
        r.ping()
        REDIS_AVAILABLE = True
        
        # Redis is working - use it
        CACHES = {
            "default": {
                "BACKEND": "django.core.cache.backends.redis.RedisCache",
                "LOCATION": REDIS_URL,
                "KEY_PREFIX": "elibrary",
                "TIMEOUT": 300,
                "OPTIONS": {
                    "SOCKET_CONNECT_TIMEOUT": 5,
                    "SOCKET_TIMEOUT": 5,
                }
            }
        }
        RATELIMIT_USE_CACHE = "default"
        RATELIMIT_ENABLE = True
        logger.info("✅ Redis cache configured successfully")
        
    except ImportError:
        REDIS_AVAILABLE = False
        import logging
        logger = logging.getLogger(__name__)
        logger.error("❌ Redis package not installed. Install with: pip install redis")
        
    except Exception as e:
        REDIS_AVAILABLE = False
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f"⚠️ Redis connection failed: {type(e).__name__}: {str(e)}")
        logger.warning("⚠️ Using LocMemCache fallback. JWT blacklist will be disabled.")
        logger.warning("⚠️ App will work but without caching. Fix REDIS_URL for production.")

# Fallback to LocMemCache if Redis not available
if not REDIS_AVAILABLE:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "unique-snowflake",
            "TIMEOUT": 300,
        }
    }
    RATELIMIT_ENABLE = False
    SILENCED_SYSTEM_CHECKS = ['django_ratelimit.E003', 'django_ratelimit.W001']

# JWT Configuration
from datetime import timedelta
# Determine if we can use JWT blacklist (requires Redis)
# Only enable blacklist if Redis is available AND working, otherwise tokens won't be properly invalidated
# IMPORTANT: Disable blacklist if Redis fails to prevent 500 errors on token refresh
_use_blacklist = REDIS_AVAILABLE

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=12),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': _use_blacklist,  # Only if Redis is available and working
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# CORS Configuration
# Automatically include production and development URLs

CORS_ALLOWED_ORIGINS_STR = os.getenv(
    'CORS_ALLOWED_ORIGINS', 
    'https://bugema-e-library.vercel.app,http://localhost:5173,http://localhost:5174,http://localhost:3000'
)
# Strip trailing slashes to avoid mismatches
CORS_ALLOWED_ORIGINS = [origin.strip().rstrip('/') for origin in CORS_ALLOWED_ORIGINS_STR.split(',') if origin.strip()]

# Ensure the main production frontend is always allowed
if 'https://bugema-e-library.vercel.app' not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append('https://bugema-e-library.vercel.app')

# Also allow any Vercel preview deployments (regex matches Origin header, so no path)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https://.*\.vercel\.app$',
]

CORS_ALLOW_CREDENTIALS = True

# CSRF Configuration
CSRF_TRUSTED_ORIGINS_STR = os.getenv(
    'CSRF_TRUSTED_ORIGINS',
    'https://bugema-e-library.vercel.app'
)
CSRF_TRUSTED_ORIGINS = [origin.strip().rstrip('/') for origin in CSRF_TRUSTED_ORIGINS_STR.split(',') if origin.strip()]

# Spectacular (OpenAPI) Configuration
SPECTACULAR_SETTINGS = {
    'TITLE': 'E-Library API',
    'DESCRIPTION': 'A comprehensive e-library management system',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
   
    'SECURITY': [{'bearerAuth': []}],
    'SECURITY_SCHEMES': {
        'bearerAuth': {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
        }
    },
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'elibrary.log',
        },
    },
    'loggers': {
        'elibrary': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

<<<<<<<<< Temporary merge branch 1
# CACHE Configuration - Use Redis from cloud service (like NEON DB and Cloudinary)
# For production: Use cloud Redis (Upstash, Redis Cloud, Railway, etc.)
# For local dev: Can use localhost Redis or LocMemCache fallback
REDIS_URL = os.getenv('REDIS_URL', '')

# In development, allow localhost Redis if REDIS_URL not set
if not REDIS_URL and DEBUG:
    REDIS_URL = 'redis://127.0.0.1:6379/1'

# Try to use Redis if available
if REDIS_URL:
    try:
        import redis
        # Test connection with proper timeout
        # Handle both redis:// and rediss:// (SSL) URLs
        r = redis.from_url(
            REDIS_URL, 
            socket_connect_timeout=3,
            socket_timeout=3,
            decode_responses=False  # Keep binary for compatibility
        )
        r.ping()
        
        # Redis is available - use it for caching
        CACHES = {
            "default": {
                "BACKEND": "django.core.cache.backends.redis.RedisCache",
                "LOCATION": REDIS_URL,
                "KEY_PREFIX": "elibrary",
                "TIMEOUT": 300,  # 5 minutes default
                "OPTIONS": {
                    "SOCKET_CONNECT_TIMEOUT": 3,
                    "SOCKET_TIMEOUT": 3,
                    "CONNECTION_POOL_KWARGS": {
                        "max_connections": 50,
                        "retry_on_timeout": True,
                    }
                }
            }
        }
        # Enable rate limiting with Redis
        RATELIMIT_USE_CACHE = "default"
        RATELIMIT_ENABLE = True
        logger.info(f"✅ Redis cache configured successfully from REDIS_URL")
    except ImportError:
        logger.error("Redis package not installed. Install with: pip install redis")
        # Fallback to LocMemCache
        CACHES = {
            "default": {
                "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
                "LOCATION": "unique-snowflake",
                "TIMEOUT": 300,
            }
        }
        RATELIMIT_ENABLE = False
        SILENCED_SYSTEM_CHECKS = ['django_ratelimit.E003', 'django_ratelimit.W001']
    except (redis.ConnectionError, redis.TimeoutError, Exception) as e:
        # Fallback for when Redis is not available
        logger.warning(f"⚠️ Redis connection failed: {e}. Using LocMemCache fallback.")
        logger.warning("⚠️ Note: LocMemCache is not shared across workers. Set REDIS_URL for production.")
        CACHES = {
            "default": {
                "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
                "LOCATION": "unique-snowflake",
                "TIMEOUT": 300,
            }
        }
        # Disable rate limiting in development (requires shared cache)
        RATELIMIT_ENABLE = False
        # Silence django-ratelimit checks in development
        SILENCED_SYSTEM_CHECKS = ['django_ratelimit.E003', 'django_ratelimit.W001']
else:
    # No Redis URL provided - use LocMemCache (development only)
    logger.warning("REDIS_URL not set. Using LocMemCache (not suitable for production with multiple workers).")
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "unique-snowflake",
            "TIMEOUT": 300,
        }
    }
    RATELIMIT_ENABLE = False
    SILENCED_SYSTEM_CHECKS = ['django_ratelimit.E003', 'django_ratelimit.W001']

=========
>>>>>>>>> Temporary merge branch 2

# Cloudinary credentials (load from environment or secret manager)
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'e-bugema'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '784176254118466'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'wCG7qPZViEo8q1tVJDpi89mM5Us'),
    secure=True
)

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME', 'e-bugema'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY', '784176254118466'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET', 'wCG7qPZViEo8q1tVJDpi89mM5Us'),
    'RESOURCE_TYPE': 'raw',
    'USE_FILENAME': True,
    'UNIQUE_FILENAME': False, 
}

MEDIA_URL = "/media/"

# Email Configuration
# Set these in your .env file or environment variables
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'Bugema E-Library <noreply@bugema.ac.ug>')
