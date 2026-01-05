# Free Access Logic Documentation

## Overview
This document explains where and how the free access logic works in the backend. Users with `registration_number` (students) or `staff_id` (staff) get free access to all resources. Visitors (users without these IDs) need to pay for subscriptions.

## Key Locations

### 1. User Model - Free Access Property
**File:** `backend/accounts/models.py`  
**Location:** `User.has_free_access` property (around line 87-95)

```python
@property
def has_free_access(self):
    """
    Check if user has free access based on having registration_number or staff_id.
    Users with registration_number (students) or staff_id (staff) get free access.
    Visitors (no registration_number or staff_id) need subscriptions.
    
    LOCATION: backend/accounts/models.py - User.has_free_access property
    EDIT HERE: Modify this logic if you need to change free access criteria
    """
    return bool(self.registration_number or self.staff_id)
```

**What it does:**  
- Returns `True` if user has either `registration_number` OR `staff_id`
- Returns `False` if user has neither (visitor)

**To edit:** Change the condition in this property if you need different free access criteria.

---

### 2. Subscription Serializer - Validation Logic
**File:** `backend/subscriptions/serializers.py`  
**Location:** `UserSubscriptionSerializer.get_is_valid` method (around line 18-35)

```python
def get_is_valid(self, obj):
    """
    Determine if subscription is valid.
    Users with registration_number or staff_id get free access (always valid).
    Other users need an active paid subscription.
    
    LOCATION: backend/subscriptions/serializers.py - UserSubscriptionSerializer.get_is_valid
    EDIT HERE: Modify this logic if you need to change how free access is determined
    """
    # Handle None case (free access users)
    if obj is None:
        return True
    
    # Check if user has free access (has registration_number or staff_id)
    if obj.user.has_free_access:
        return True
    
    # For visitors, check if they have an active paid subscription
    from django.utils import timezone
    return obj.status == 'ACTIVE' and obj.end_date and obj.end_date > timezone.now()
```

**What it does:**  
- Returns `True` for users with free access (has registration_number or staff_id)
- Returns `True` for visitors with active paid subscriptions
- Returns `False` for visitors without active subscriptions

**To edit:** Modify the validation logic here if you need different subscription validation rules.

---

### 3. Subscription API View - Free Access Handling
**File:** `backend/subscriptions/views.py`  
**Location:** `MySubscriptionView.retrieve` method (around line 66-110)

```python
def retrieve(self, request, *args, **kwargs):
    """
    Override retrieve to handle free access users who don't have a subscription record.
    """
    user = request.user
    
    # If user has free access, return a virtual subscription response
    if user.has_free_access:
        from rest_framework.response import Response
        return Response({
            'id': None,
            'plan': None,
            'plan_name': 'Free Access',
            'plan_duration': 'LIFETIME',
            'start_date': user.created_at.isoformat() if user.created_at else None,
            'end_date': None,
            'status': 'ACTIVE',
            'amount_paid': '0.00',
            'payment_method': 'FREE',
            'is_valid': True,
            'created_at': user.created_at.isoformat() if user.created_at else None
        })
    
    # For visitors, use the default behavior
    return super().retrieve(request, *args, **kwargs)
```

**What it does:**  
- Checks if user has free access using `user.has_free_access`
- Returns a virtual subscription object for free access users (so frontend treats them as subscribed)
- Returns actual subscription for visitors

**To edit:** Modify the virtual subscription response structure if needed.

---

### 4. Registration Number Format Validation
**File:** `backend/accounts/serializers.py`  
**Location:** `UserRegistrationSerializer.validate_registration_number` method (around line 46-60)

**Format:** `YY/DEPT/BU/R/XXXX` (e.g., `22/BCC/BU/R/0000`)

```python
def validate_registration_number(self, value):
    """
    Validate Student Registration Number format.
    Format: YY/DEPT/BU/R/XXXX (e.g., 22/BCC/BU/R/0000)
    
    LOCATION: backend/accounts/serializers.py - UserRegistrationSerializer.validate_registration_number
    EDIT HERE: Modify the regex pattern if you need to change the format
    """
    import re
    if value:
        # Format: 22/BCC/BU/R/0000
        pattern = r'^\d{2}/[A-Z]{3}/BU/R/\d{4}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Invalid Registration Number format. Expected format: YY/DEPT/BU/R/XXXX (e.g., 22/BCC/BU/R/0000)"
            )
        if User.objects.filter(registration_number=value).exists():
            raise serializers.ValidationError("Registration number already in use.")
    return value
```

**To edit:** Change the regex pattern `r'^\d{2}/[A-Z]{3}/BU/R/\d{4}$'` if you need a different format.

---

### 5. Staff ID Format Validation
**File:** `backend/accounts/serializers.py`  
**Location:** `UserRegistrationSerializer.validate_staff_id` method (around line 58-72)

**Format:** `STF/BU/XXX` (e.g., `STF/BU/000`)

```python
def validate_staff_id(self, value):
    """
    Validate Staff ID format.
    Format: STF/BU/XXX (e.g., STF/BU/000)
    
    LOCATION: backend/accounts/serializers.py - UserRegistrationSerializer.validate_staff_id
    EDIT HERE: Modify the regex pattern if you need to change the format
    """
    import re
    if value:
        # Format: STF/BU/000
        pattern = r'^STF/BU/\d{3}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Invalid Staff ID format. Expected format: STF/BU/XXX (e.g., STF/BU/000)"
            )
        if User.objects.filter(staff_id=value).exists():
            raise serializers.ValidationError("Staff ID already in use.")
    return value
```

**To edit:** Change the regex pattern `r'^STF/BU/\d{3}$'` if you need a different format.

---

## How It Works

### Registration Flow:
1. User registers with email + registration_number OR staff_id
2. Format validation happens in `UserRegistrationSerializer.validate_registration_number` or `validate_staff_id`
3. If valid format, user is created with `role=STUDENT` (if has registration_number) or `role=STAFF` (if has staff_id)
4. If no ID provided, user is created with `role=SUBSCRIBER` (visitor)

### Subscription Check Flow:
1. Frontend calls `/api/subscriptions/me/` endpoint
2. Backend `MySubscriptionView.retrieve` checks `user.has_free_access`
3. If `has_free_access = True`:
   - Returns virtual subscription with `is_valid: true`
   - Frontend sees user as having valid subscription
   - No paywall shown
4. If `has_free_access = False`:
   - Checks for actual paid subscription
   - Returns subscription if active, or None if no subscription
   - Frontend shows paywall if no valid subscription

### Free Access Determination:
- **Has Free Access:** User has `registration_number` OR `staff_id` in their record
- **Needs Subscription:** User has neither `registration_number` nor `staff_id` (visitor)

---

## Summary of Edit Locations

| What to Edit | File | Location | Line Range |
|-------------|------|----------|------------|
| Free access criteria | `backend/accounts/models.py` | `User.has_free_access` property | ~87-95 |
| Subscription validation | `backend/subscriptions/serializers.py` | `get_is_valid` method | ~18-35 |
| Free access API response | `backend/subscriptions/views.py` | `MySubscriptionView.retrieve` | ~66-110 |
| Registration number format | `backend/accounts/serializers.py` | `validate_registration_number` | ~46-60 |
| Staff ID format | `backend/accounts/serializers.py` | `validate_staff_id` | ~58-72 |

---

## Testing

To test the free access logic:

1. **Create a student user:**
   - Registration number: `22/BCC/BU/R/0000`
   - Should have free access

2. **Create a staff user:**
   - Staff ID: `STF/BU/000`
   - Should have free access

3. **Create a visitor:**
   - No registration_number or staff_id
   - Should need subscription

4. **Check subscription endpoint:**
   - Call `GET /api/subscriptions/me/` for each user type
   - Students/Staff should get `is_valid: true` with `plan_name: 'Free Access'`
   - Visitors should get `is_valid: false` or no subscription

