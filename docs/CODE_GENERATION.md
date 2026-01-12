# Code Generation Algorithm

## Overview

The system generates short alphanumeric codes to create unique short URLs. This document specifies the algorithm, collision handling, and uniqueness guarantees.

---

## Algorithm Specification

### Character Set

**Allowed Characters:**

- Lowercase letters: `a-z` (26 characters)
- Uppercase letters: `A-Z` (26 characters)
- Digits: `0-9` (10 characters)

**Total:** 62 possible characters

**Excluded Characters:**

- Special characters (to avoid URL encoding issues)
- Ambiguous characters (0, O, I, l) - **Note:** Currently included, but could be excluded in future

---

## Generation Process

### Step 1: Generate Random String

1. Generate a random string of length `CODE_LENGTH` (default: 6)
2. Each character is randomly selected from the 62-character set
3. Use cryptographically secure random number generator

**Example:**

- Length: 6
- Generated: `aB3xY9`

### Step 2: Check Uniqueness

1. Query database to check if code already exists
2. If code exists, go to Step 3 (retry)
3. If code doesn't exist, proceed to Step 4 (save)

### Step 3: Collision Handling

**Retry Strategy:**

- Maximum retry attempts: 3
- If collision occurs, generate a new random code
- Repeat Step 1 and Step 2
- If all retries fail, throw error (very unlikely)

**Probability Calculation:**

- With 6 characters and 62 possible characters: 62^6 = 56,800,235,584 combinations
- Collision probability is extremely low for reasonable URL counts
- Even with 1 million URLs, collision probability is negligible

### Step 4: Save to Database

1. Insert code and original URL into database
2. Database unique constraint ensures no race conditions
3. If database constraint violation occurs, treat as collision and retry

---

## Implementation Details

### Random Generation

**Method:**

- Use Node.js `crypto.randomBytes()` for cryptographically secure randomness
- Convert bytes to alphanumeric characters
- Ensure uniform distribution across character set

**Pseudocode:**

```
function generateCode(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    code += chars[randomIndex];
  }
  return code;
}
```

### Uniqueness Check

**Database Query:**

```sql
SELECT COUNT(*) FROM urls WHERE code = $1;
```

**Optimization:**

- Use database unique index for fast lookups
- Unique constraint prevents duplicates at database level

### Retry Logic

**Maximum Attempts:** 3

**Flow:**

1. Generate code
2. Check uniqueness
3. If exists, retry (up to 3 times)
4. If all retries fail, throw `InternalServerError`

**Error Handling:**

- Log collision attempts for monitoring
- After 3 failures, return 500 error (extremely rare)

---

## Configuration

### CODE_LENGTH

**Default:** 6 characters

**Trade-offs:**

- **Shorter (4-5):** More collisions, less user-friendly URLs
- **Longer (7-10):** Fewer collisions, longer URLs

**Recommendation:** 6 characters provides good balance

### Collision Probability

**Formula:**

```
P(collision) ≈ n² / (2 × m)
```

Where:

- `n` = number of URLs
- `m` = number of possible codes (62^length)

**Examples:**

- 1,000 URLs with length 6: ~0.000009% collision probability
- 1,000,000 URLs with length 6: ~0.88% collision probability
- 10,000,000 URLs with length 6: ~88% collision probability

**Note:** With retry logic, even collisions are handled gracefully.

---

## Edge Cases

### Database Constraint Violation

**Scenario:** Two requests generate the same code simultaneously

**Handling:**

1. Database unique constraint prevents duplicate insert
2. Catch constraint violation error
3. Treat as collision and retry
4. Generate new code and attempt insert again

### Maximum Retries Exceeded

**Scenario:** 3 consecutive collisions (extremely rare)

**Handling:**

1. Log error with details
2. Return 500 Internal Server Error
3. Include request ID for debugging

**Mitigation:**

- Increase `CODE_LENGTH` if collisions become frequent
- Consider alternative algorithms (base62 encoding of sequential IDs)

---

## Future Considerations (Not Now)

### Alternative Algorithms

1. **Sequential ID + Base62 Encoding:**

   - Use auto-incrementing database ID
   - Encode ID to base62
   - Guarantees uniqueness, no collisions
   - Trade-off: Predictable codes (security concern)

2. **Hash-based:**

   - Hash original URL
   - Use first N characters
   - Trade-off: Same URL = same code (may be desired)

3. **Custom Characters:**
   - Exclude ambiguous characters (0, O, I, l)
   - Reduces character set but improves readability

**Current Approach:** Random generation is simplest and sufficient for learning purposes.

---

## Validation Rules

- Code must be exactly `CODE_LENGTH` characters
- Code must contain only alphanumeric characters (a-z, A-Z, 0-9)
- Code must be unique in database
- Code cannot be empty or null

---

## Testing Considerations

- Test collision handling (mock database to return existing code)
- Test retry logic (verify maximum attempts)
- Test database constraint violations
- Test with different `CODE_LENGTH` values
- Verify uniform character distribution
