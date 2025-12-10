# Closure Schedule - UI Quick Reference

## 🎨 Design System

### Colors

- **Primary (Blue)**: `#3B82F6` - Custom availability mode
- **Danger (Red)**: `#EF4444` - Complete closure mode
- **Success (Green)**: `#10B981` - Available services
- **Warning (Yellow)**: `#F59E0B` - Today's date
- **Gray Scale**: `#F3F4F6` to `#1F2937` - UI elements

### Spacing

- **Cards**: `p-6` (1.5rem padding)
- **Gaps**: `gap-4` or `gap-6` between elements
- **Margins**: `mb-6` for section spacing

### Border Radius

- **Small**: `rounded-lg` (0.5rem)
- **Medium**: `rounded-md` (0.75rem)
- **Circles**: `rounded-full`

### Shadows

- **Small**: `shadow-sm`
- **Medium**: `shadow-md`
- **Large**: `shadow-lg`

## 📱 Component Breakdown

### Step 1: Mode Selection

```
┌─────────────────────────────────────┐
│   Choose Your Action               │
├─────────────────────────────────────┤
│ ┌───────────┐    ┌───────────┐    │
│ │  🔒       │    │  🔓       │    │
│ │ Complete  │    │  Custom   │    │
│ │ Closure   │    │Availability│    │
│ └───────────┘    └───────────┘    │
└─────────────────────────────────────┘
```

### Step 2: Date Selection

```
┌─────────────────────────────────────┐
│   Select Dates                     │
├─────────────────────────────────────┤
│   📅 Calendar                      │
│   ┌─────────────────────────┐     │
│   │  S  M  T  W  T  F  S   │     │
│   │     1  2  3  4  5  6   │     │
│   │  7  8  9 10 11 12 13   │     │
│   │ ...                     │     │
│   └─────────────────────────┘     │
│                                    │
│   Selected: [Jan 15] [Jan 20]     │
└─────────────────────────────────────┘
```

### Step 3: Service Configuration

```
┌─────────────────────────────────────┐
│   Configure Services               │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐   │
│ │ ✓ Oil Change    [ON] ●──    │   │
│ └─────────────────────────────┘   │
│ ┌─────────────────────────────┐   │
│ │ ✗ Tire Rotation [OFF] ──●   │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🎭 State Variations

### Loading State

- Spinning loader with message
- Gradient background
- Centered layout

### Empty State

- Icon in colored circle
- Bold heading
- Descriptive text
- Call-to-action button

### Success State

- Green checkmark
- Confirmation message
- Summary information

### Error State

- Red alert icon
- Error description
- Retry option

### Locked State (Services)

- Lock icon
- Grayed out toggles
- Warning message
- Explanation text

## 🎬 Animations

### Entrance

```css
fadeIn: 0.3s ease-out
- Opacity: 0 → 1
- Transform: translateY(10px) → translateY(0)
```

### Hover

```css
scale: 0.2s ease
- Transform: scale(1) → scale(1.05)
- Shadow: shadow-sm → shadow-md
```

### Selected

```css
background: linear-gradient(135deg, #3B82F6, #2563EB)
box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3)
transform: scale(1.05)
```

## 📊 Progress Indicators

```
Step 1     Step 2     Step 3
  ●────────○────────○     (Current: 1)
  ●────────●────────○     (Current: 2)
  ●────────●────────●     (Current: 3)

● = Completed (Blue, with checkmark)
○ = Pending (Gray)
```

## 🔘 Interactive Elements

### Primary Button

- Background: Blue gradient
- Hover: Darker blue
- Disabled: Gray
- Icon + Text

### Secondary Button

- Border: Gray
- Hover: Light gray background
- Text: Dark gray

### Toggle Switch

- ON: Green background, right position
- OFF: Red background, left position
- Animated transition

### Calendar Tile

- Default: White
- Hover: Light blue
- Selected: Blue gradient + shadow
- Today: Yellow background
- Disabled: Gray text

## 💡 Best Practices Applied

✅ **Progressive Disclosure**: One step at a time  
✅ **Visual Hierarchy**: Size, color, spacing guide the eye  
✅ **Feedback**: Every action has visual response  
✅ **Consistency**: Matches booking page patterns  
✅ **Accessibility**: Large targets, clear states  
✅ **Mobile First**: Responsive grid layouts  
✅ **Performance**: Optimized re-renders

## 🛠️ Usage Tips

1. **Mode Selection**: Click entire card to select
2. **Date Picking**: Click calendar dates to toggle selection
3. **Service Toggle**: Click switch or entire card
4. **Navigation**: Use buttons or click progress steps
5. **Remove Date**: Hover badge and click X icon

## 🎯 User Flow Summary

**Complete Closure:**

1. Select closure mode → 2. Pick dates → 3. Review → 4. Confirm

**Custom Availability:**

1. Select custom mode → 2. Pick dates → 3. Toggle services → 4. Confirm

Both flows provide:

- Clear progress indication
- Ability to go back
- Summary of selections
- Validation at each step
- Success/error feedback
