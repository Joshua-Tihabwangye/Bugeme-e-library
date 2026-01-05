# Registration and Staff ID Number Format Logic

## Location in Codebase

The logic for determining registration number and staff ID number formats is located in:

### Frontend
**File:** `frontend/src/app/pages/RegisterPage.tsx`

**Key Sections:**
1. **Schema Validation (Lines 12-36):**
   - Registration number field: `registration_number` (optional string)
   - Staff ID field: `staff_id` (optional string)
   - Validation ensures that:
     - If account type is 'STUDENT', `registration_number` is required
     - If account type is 'STAFF', `staff_id` is required

2. **Form Field (Lines 129-146):**
   - Dynamic field that changes based on `accountType`:
     - For STUDENT: Shows "Registration Number" input
     - For STAFF: Shows "Staff ID Number" input
   - Placeholder examples:
     - Student: `'e.g. 19/KG/283'`
     - Staff: `'e.g. STF-001'`

3. **Form Submission (Lines 73-78):**
   - Clears unused ID field before submission
   - If STUDENT: sets `staff_id = ''`
   - If STAFF: sets `registration_number = ''`

### Backend Validation
The actual format validation should be implemented in the backend API endpoint that handles registration.

**Expected Backend Location:**
- `backend/accounts/views.py` - Registration endpoint
- `backend/accounts/serializers.py` - User registration serializer

## Current Format Examples

Based on the placeholder values in the frontend:

### Student Registration Number Format
- Example: `19/KG/283`
- Pattern appears to be: `YY/DEPT/ID` or similar
- Where:
  - `19` = Year (possibly 2019 or year code)
  - `KG` = Department code
  - `283` = Student ID number

### Staff ID Format
- Example: `STF-001`
- Pattern appears to be: `PREFIX-NUMBER`
- Where:
  - `STF` = Staff prefix
  - `001` = Sequential staff number

## Where to Add Format Validation

To implement proper format validation, you should:

1. **Frontend (Optional - for better UX):**
   - Add regex pattern validation in `RegisterPage.tsx` schema
   - Update placeholder to show exact format expected

2. **Backend (Required - for security):**
   - Add validation in the registration serializer
   - Example location: `backend/accounts/serializers.py`
   - Add regex or custom validation method to check format

## Example Backend Validation (Python/Django)

```python
# In backend/accounts/serializers.py

import re
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    # ... other fields ...
    
    def validate_registration_number(self, value):
        # Example: 19/KG/283 format
        pattern = r'^\d{2}/[A-Z]{2}/\d{3,}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Registration number must be in format: YY/DEPT/ID (e.g., 19/KG/283)"
            )
        return value
    
    def validate_staff_id(self, value):
        # Example: STF-001 format
        pattern = r'^STF-\d{3,}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Staff ID must be in format: STF-XXX (e.g., STF-001)"
            )
        return value
```

## Notes

- The current implementation only checks if the field is present, not the format
- Format validation should be added to the backend for security
- Frontend validation improves user experience but should not be relied upon for security

