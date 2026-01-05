# Backend Free Access Implementation Summary

## ✅ Implementation Complete

The backend has been updated to provide free access to users with `registration_number` (students) or `staff_id` (staff). Visitors (users without these IDs) need subscriptions.

## 📍 All Edit Locations

### 1. **User Model - Free Access Property** ⭐ PRIMARY LOGIC
**File:** `backend/accounts/models.py`  
**Method:** `User.has_free_access` property (lines ~87-95)

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

**To Edit:** Change the condition `bool(self.registration_number or self.staff_id)` if you need different criteria.

---

### 2. **Subscription API View - Free Access Response** ⭐ PRIMARY LOGIC
**File:** `backend/subscriptions/views.py`  
**Method:** `MySubscriptionView.retrieve` (lines ~108-132)

```python
def retrieve(self, request, *args, **kwargs):
    """
    Override retrieve to handle free access users who don't have a subscription record.
    """
    user = request.user
    
    # If user has free access, return a virtual subscription response
    if user.has_free_access:
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
            'is_valid': True,  # ⭐ This makes frontend treat them as subscribed
            'created_at': user.created_at.isoformat() if user.created_at else None
        })
    
    # For visitors, use the default behavior
    return super().retrieve(request, *args, **kwargs)
```

**To Edit:** Modify the virtual subscription response structure if needed.

---

### 3. **Subscription Serializer - Validation** 
**File:** `backend/subscriptions/serializers.py`  
**Method:** `UserSubscriptionSerializer.get_is_valid` (lines ~18-35)

```python
def get_is_valid(self, obj):
    """
    Determine if subscription is valid.
    Users with registration_number or staff_id get free access (always valid).
    Other users need an active paid subscription.
    """
    # Handle None case (free access users)
    if obj is None:
        return True
    
    # Check if user has free access
    if obj.user.has_free_access:
        return True
    
    # For visitors, check if they have an active paid subscription
    from django.utils import timezone
    return obj.status == 'ACTIVE' and obj.end_date and obj.end_date > timezone.now()
```

**To Edit:** Modify validation logic if needed.

---

### 4. **Registration Number Format Validation** ⭐ FORMAT VALIDATION
**File:** `backend/accounts/serializers.py`  
**Method:** `UserRegistrationSerializer.validate_registration_number` (lines ~46-60)

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
        pattern = r'^\d{2}/[A-Z]{3}/BU/R/\d{4}$'  # ⭐ EDIT THIS PATTERN
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Invalid Registration Number format. Expected format: YY/DEPT/BU/R/XXXX (e.g., 22/BCC/BU/R/0000)"
            )
        if User.objects.filter(registration_number=value).exists():
            raise serializers.ValidationError("Registration number already in use.")
    return value
```

**To Edit:** Change regex pattern `r'^\d{2}/[A-Z]{3}/BU/R/\d{4}$'` to match your format.

---

### 5. **Staff ID Format Validation** ⭐ FORMAT VALIDATION
**File:** `backend/accounts/serializers.py`  
**Method:** `UserRegistrationSerializer.validate_staff_id` (lines ~58-72)

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
        pattern = r'^STF/BU/\d{3}$'  # ⭐ EDIT THIS PATTERN
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Invalid Staff ID format. Expected format: STF/BU/XXX (e.g., STF/BU/000)"
            )
        if User.objects.filter(staff_id=value).exists():
            raise serializers.ValidationError("Staff ID already in use.")
    return value
```

**To Edit:** Change regex pattern `r'^STF/BU/\d{3}$'` to match your format.

---

## 🔄 How It Works

### Registration Flow:
1. User registers with email + registration_number OR staff_id
2. Format validation happens in serializer
3. If valid, user is created with appropriate role
4. User record now has `registration_number` or `staff_id` field populated

### Subscription Check Flow:
1. Frontend calls `GET /api/subscriptions/me/`
2. Backend `MySubscriptionView.retrieve` checks `user.has_free_access`
3. **If free access:**
   - Returns virtual subscription with `is_valid: true`
   - Frontend sees user as subscribed → No paywall
4. **If visitor:**
   - Checks for actual paid subscription
   - Returns subscription if active, or None
   - Frontend shows paywall if no subscription

### Free Access Logic:
- ✅ **Has Free Access:** User has `registration_number` OR `staff_id`
- ❌ **Needs Subscription:** User has neither (visitor)

---

## 📝 Format Specifications

### Student Registration Number
- **Format:** `YY/DEPT/BU/R/XXXX`
- **Example:** `22/BCC/BU/R/0000`
- **Pattern:** `^\d{2}/[A-Z]{3}/BU/R/\d{4}$`
- **Components:**
  - `YY` = 2 digits (year)
  - `DEPT` = 3 uppercase letters (department code)
  - `BU` = Fixed "BU" (Bugema University)
  - `R` = Fixed "R" (Registration)
  - `XXXX` = 4 digits (student number)

### Staff ID
- **Format:** `STF/BU/XXX`
- **Example:** `STF/BU/000`
- **Pattern:** `^STF/BU/\d{3}$`
- **Components:**
  - `STF` = Fixed "STF" (Staff)
  - `BU` = Fixed "BU" (Bugema University)
  - `XXX` = 3 digits (staff number)

---

## 🧪 Testing

### Test Student Registration:
```bash
POST /api/accounts/register/
{
  "email": "student@example.com",
  "name": "John Student",
  "password": "password123",
  "password_confirm": "password123",
  "registration_number": "22/BCC/BU/R/0000"
}
```
**Expected:** User created with `role=STUDENT`, gets free access

### Test Staff Registration:
```bash
POST /api/accounts/register/
{
  "email": "staff@example.com",
  "name": "Jane Staff",
  "password": "password123",
  "password_confirm": "password123",
  "staff_id": "STF/BU/000"
}
```
**Expected:** User created with `role=STAFF`, gets free access

### Test Visitor Registration:
```bash
POST /api/accounts/register/
{
  "email": "visitor@example.com",
  "name": "Bob Visitor",
  "password": "password123",
  "password_confirm": "password123"
}
```
**Expected:** User created with `role=SUBSCRIBER`, needs subscription

### Test Subscription Endpoint:
```bash
GET /api/subscriptions/me/
Authorization: Bearer <token>
```
**Expected Response for Student/Staff:**
```json
{
  "id": null,
  "plan_name": "Free Access",
  "plan_duration": "LIFETIME",
  "is_valid": true,
  "status": "ACTIVE",
  "payment_method": "FREE"
}
```

**Expected Response for Visitor (no subscription):**
```json
null
```

---

## ⚠️ Important Notes

1. **All users use email to sign in** - The registration_number and staff_id are only used to determine free access, not for login
2. **Free access is determined by presence of ID** - If a user has `registration_number` OR `staff_id` in their record, they get free access
3. **Format validation is strict** - Only the exact formats specified will be accepted
4. **Backend is source of truth** - Frontend checks are for UX only, backend determines actual access

---

## 🔧 Quick Edit Guide

| What to Change | File | Method/Property | What to Edit |
|---------------|------|----------------|--------------|
| Free access criteria | `backend/accounts/models.py` | `has_free_access` | Change `bool(self.registration_number or self.staff_id)` |
| Free access API response | `backend/subscriptions/views.py` | `retrieve` | Modify Response dictionary |
| Registration number format | `backend/accounts/serializers.py` | `validate_registration_number` | Change regex pattern |
| Staff ID format | `backend/accounts/serializers.py` | `validate_staff_id` | Change regex pattern |

---

## 📚 Related Documentation

- See `FREE_ACCESS_LOGIC_DOCUMENTATION.md` for detailed explanation
- See `REGISTRATION_ID_FORMAT.md` for format details

