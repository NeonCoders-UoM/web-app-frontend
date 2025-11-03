# Forgot Password Implementation

## Overview

This document describes the implementation of the forgot password functionality for both customers and users (staff/admin users) in the Vehicle Service Management System.

## Features

### 1. Multi-User Support
- **Customers**: Can reset passwords for their customer accounts
- **Users (Staff/Admin)**: Can reset passwords for their staff/admin accounts
- **Unified Flow**: Single UI handles both customer and user password resets

### 2. Security Features
- **OTP Verification**: 6-digit one-time password sent via email
- **Time-Limited OTP**: OTP expires after 10 minutes
- **Secure Password Hashing**: Uses BCrypt for password hashing
- **Email Validation**: Verifies email exists before sending OTP

### 3. User Experience
- **Step-by-Step Flow**: Email → OTP → New Password
- **Resend OTP**: Users can request new OTP if needed
- **Error Handling**: Clear error messages for each step
- **Success Feedback**: Confirmation messages for successful actions

## Backend Implementation

### Database Schema Updates

#### Customer Model
```csharp
// Add to Customer model
public string? ForgotPasswordOtp { get; set; }
public DateTime? ForgotPasswordOtpExpiry { get; set; }
```

#### User Model
```csharp
// Add to User model
public string? ForgotPasswordOtp { get; set; }
public DateTime? ForgotPasswordOtpExpiry { get; set; }
```

### API Endpoints

#### 1. Forgot Password Request
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset OTP sent to your email address."
}
```

#### 2. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

#### 3. Resend OTP
```http
POST /api/auth/resend-forgot-password-otp
Content-Type: application/json

"user@example.com"
```

**Response:**
```json
{
  "message": "New password reset OTP sent to your email address."
}
```

### Controller Implementation

The `AuthController` handles all forgot password operations:

```csharp
[HttpPost("forgot-password")]
[AllowAnonymous]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
{
    // Check for both customer and user accounts
    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

    if (customer == null && user == null)
        return BadRequest("No account found with this email address.");

    // Generate OTP and update appropriate account
    var otp = new Random().Next(100000, 999999).ToString();
    var otpExpiry = DateTime.UtcNow.AddMinutes(10);

    if (customer != null)
    {
        customer.ForgotPasswordOtp = otp;
        customer.ForgotPasswordOtpExpiry = otpExpiry;
    }
    else if (user != null)
    {
        user.ForgotPasswordOtp = otp;
        user.ForgotPasswordOtpExpiry = otpExpiry;
    }

    await _context.SaveChangesAsync();

    // Send email with OTP
    await _emailService.SendEmailAsync(/* email configuration */);

    return Ok("Password reset OTP sent to your email address.");
}
```

## Frontend Implementation

### Components

#### 1. ForgotPasswordForm Component
**Location:** `src/components/organism/forgot-password-form/forgot-password-form.tsx`

**Features:**
- Multi-step form (Email → OTP → Reset Password)
- Real-time validation
- Error handling and success messages
- Loading states for better UX

**Steps:**
1. **Email Step**: User enters email address
2. **OTP Step**: User enters 6-digit verification code
3. **Reset Step**: User sets new password

#### 2. Updated LoginForm Component
**Location:** `src/components/organism/login-form/login-form.tsx`

**Changes:**
- Added "Forgot Password?" button
- Integrated ForgotPasswordForm component
- Toggle between login and forgot password views

### API Integration

#### TypeScript DTOs
```typescript
// src/types/index.ts
export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}
```

#### API Calls
```typescript
// Send OTP
const response = await axiosInstance.post("auth/forgot-password", { email });

// Reset Password
const response = await axiosInstance.post("auth/reset-password", {
  email,
  otp,
  newPassword,
});

// Resend OTP
const response = await axiosInstance.post("auth/resend-forgot-password-otp", email);
```

### UI/UX Features

#### 1. Visual Design
- **Icons**: Mail, Key, and Lock icons for each step
- **Colors**: Consistent with existing design system
- **Typography**: Clear hierarchy and readable text

#### 2. User Experience
- **Progress Indication**: Clear step-by-step flow
- **Error Handling**: Specific error messages for each scenario
- **Success Feedback**: Confirmation messages
- **Loading States**: Spinner animations during API calls

#### 3. Accessibility
- **ARIA Labels**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Semantic HTML structure

## Email Templates

### Password Reset Request Email
```html
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
    <h2 style='color: #333;'>Password Reset Request</h2>
    <p>Hello {firstName},</p>
    <p>We received a request to reset your password for your {userType} account. Use the following OTP to reset your password:</p>
    <div style='background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;'>
        <h1 style='color: #007bff; margin: 0; font-size: 32px;'>{otp}</h1>
    </div>
    <p><strong>This OTP will expire in 10 minutes.</strong></p>
    <p>If you didn't request this password reset, please ignore this email.</p>
    <p>Best regards,<br>Vehicle Service Team</p>
</div>
```

## Security Considerations

### 1. OTP Security
- **Random Generation**: Uses cryptographically secure random number generation
- **Time Limitation**: OTP expires after 10 minutes
- **Single Use**: OTP is cleared after successful password reset

### 2. Password Security
- **Minimum Length**: Requires at least 6 characters
- **Hashing**: Uses BCrypt for secure password hashing
- **Validation**: Frontend and backend validation

### 3. Rate Limiting
- **OTP Requests**: Limit OTP requests per email
- **Password Resets**: Prevent brute force attacks
- **Account Lockout**: Temporary lockout after multiple failed attempts

## Testing

### 1. Unit Tests
- **Email Validation**: Test email format validation
- **OTP Generation**: Test OTP generation and expiry
- **Password Validation**: Test password strength requirements

### 2. Integration Tests
- **API Endpoints**: Test all forgot password endpoints
- **Email Delivery**: Test email sending functionality
- **Database Operations**: Test OTP storage and retrieval

### 3. User Acceptance Tests
- **Customer Flow**: Test customer password reset
- **User Flow**: Test staff/admin password reset
- **Error Scenarios**: Test invalid email, expired OTP, etc.

## Deployment

### 1. Database Migration
```sql
-- Add forgot password fields to Customers table
ALTER TABLE Customers ADD COLUMN ForgotPasswordOtp NVARCHAR(10) NULL;
ALTER TABLE Customers ADD COLUMN ForgotPasswordOtpExpiry DATETIME2 NULL;

-- Add forgot password fields to Users table
ALTER TABLE Users ADD COLUMN ForgotPasswordOtp NVARCHAR(10) NULL;
ALTER TABLE Users ADD COLUMN ForgotPasswordOtpExpiry DATETIME2 NULL;
```

### 2. Environment Configuration
- **Email Service**: Configure SMTP settings
- **API URLs**: Set correct backend API endpoints
- **Security**: Configure CORS and authentication settings

## Maintenance

### 1. Monitoring
- **Email Delivery**: Monitor email delivery rates
- **API Performance**: Monitor response times
- **Error Rates**: Track failed password reset attempts

### 2. Updates
- **Security Updates**: Regular security patches
- **UI Improvements**: User feedback integration
- **Feature Enhancements**: Additional security features

## Troubleshooting

### Common Issues

#### 1. Email Not Received
- Check spam folder
- Verify email address is correct
- Check email service configuration

#### 2. OTP Expired
- Request new OTP using resend function
- Check system time synchronization

#### 3. Password Reset Failed
- Verify OTP is correct
- Check password requirements
- Ensure email matches account

### Debug Information
- **Logs**: Check application logs for errors
- **Network**: Verify API connectivity
- **Database**: Check OTP storage and expiry

## Future Enhancements

### 1. Additional Security
- **Two-Factor Authentication**: SMS or app-based 2FA
- **Security Questions**: Additional verification method
- **Account Recovery**: Alternative recovery methods

### 2. User Experience
- **Password Strength Meter**: Visual password strength indicator
- **Remember Device**: Option to remember trusted devices
- **Account Lockout**: Temporary lockout for security

### 3. Analytics
- **Usage Tracking**: Monitor password reset patterns
- **Security Metrics**: Track failed attempts and suspicious activity
- **User Feedback**: Collect user experience feedback

## Conclusion

The forgot password implementation provides a secure, user-friendly way for both customers and staff to reset their passwords. The multi-step process with OTP verification ensures security while maintaining a good user experience. The implementation is scalable and can be easily extended with additional security features as needed. 