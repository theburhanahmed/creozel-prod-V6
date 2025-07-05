interface ValidationRule {
  field: string
  required: boolean
  type: "string" | "number" | "boolean" | "object" | "array"
  min?: number
  max?: number
  pattern?: RegExp
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateRequest(data: any, rules: ValidationRule[]): ValidationResult {
  const errors: string[] = []

  for (const rule of rules) {
    const value = data[rule.field]

    // Check required fields
    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push(`${rule.field} is required`)
      continue
    }

    // Skip validation if field is not required and empty
    if (!rule.required && (value === undefined || value === null || value === "")) {
      continue
    }

    // Type validation
    if (rule.type === "string" && typeof value !== "string") {
      errors.push(`${rule.field} must be a string`)
      continue
    }

    if (rule.type === "number" && typeof value !== "number") {
      errors.push(`${rule.field} must be a number`)
      continue
    }

    if (rule.type === "boolean" && typeof value !== "boolean") {
      errors.push(`${rule.field} must be a boolean`)
      continue
    }

    if (rule.type === "object" && typeof value !== "object") {
      errors.push(`${rule.field} must be an object`)
      continue
    }

    if (rule.type === "array" && !Array.isArray(value)) {
      errors.push(`${rule.field} must be an array`)
      continue
    }

    // Length/range validation
    if (rule.min !== undefined) {
      if (rule.type === "string" && value.length < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min} characters`)
      }
      if (rule.type === "number" && value < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min}`)
      }
    }

    if (rule.max !== undefined) {
      if (rule.type === "string" && value.length > rule.max) {
        errors.push(`${rule.field} must be at most ${rule.max} characters`)
      }
      if (rule.type === "number" && value > rule.max) {
        errors.push(`${rule.field} must be at most ${rule.max}`)
      }
    }

    // Pattern validation
    if (rule.pattern && rule.type === "string" && !rule.pattern.test(value)) {
      errors.push(`${rule.field} format is invalid`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
