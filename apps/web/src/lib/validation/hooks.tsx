/**
 * Feirinha Express - Validation Hooks
 * React hooks for form validation with Zod
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { ZodSchema, ZodError, ZodIssue } from 'zod'

interface ValidationState<T> {
  data: T
  errors: Record<string, string>
  isValid: boolean
  isDirty: boolean
}

interface UseValidationOptions<T> {
  schema: ZodSchema<T>
  initialData: T
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

interface UseValidationReturn<T> {
  data: T
  errors: Record<string, string>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  setField: (name: string, value: unknown) => void
  validateField: (name: string) => boolean
  validateAll: () => boolean
  reset: () => void
  submit: (onValid: (data: T) => void) => void
  getError: (field: string) => string | undefined
  clearError: (field: string) => void
  clearAllErrors: () => void
}

export function useValidation<T extends Record<string, unknown>>({
  schema,
  initialData,
  validateOnChange = false,
  validateOnBlur = false,
}: UseValidationOptions<T>): UseValidationReturn<T> {
  const [state, setState] = useState<ValidationState<T>>({
    data: initialData,
    errors: {},
    isValid: false,
    isDirty: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Convert ZodError to errors object
  const formatErrors = useCallback((zodError: ZodError): Record<string, string> => {
    const errors: Record<string, string> = {}
    zodError.issues.forEach((issue: ZodIssue) => {
      const path = issue.path.join('.')
      if (!errors[path]) {
        errors[path] = issue.message
      }
    })
    return errors
  }, [])

  // Validate a single field
  const validateField = useCallback((name: string): boolean => {
    try {
      // Create partial schema for single field validation
      const fieldValue = state.data[name as keyof T]
      const result = schema.safeParse(state.data)

      if (!result.success) {
        const fieldErrors = formatErrors(result.error)
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: fieldErrors[name] || '' },
          isValid: result.success,
        }))
        return result.success
      }

      setState(prev => {
        const newErrors = { ...prev.errors }
        delete newErrors[name]
        return { ...prev, errors: newErrors }
      })
      return true
    } catch {
      return false
    }
  }, [schema, state.data, formatErrors])

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const result = schema.safeParse(state.data)
    const errors = result.success ? {} : formatErrors(result.error)

    setState(prev => ({
      ...prev,
      errors,
      isValid: result.success,
      isDirty: true,
    }))

    return result.success
  }, [schema, state.data, formatErrors])

  // Set a field value
  const setField = useCallback((name: string, value: unknown) => {
    setState(prev => {
      const newData = { ...prev.data, [name]: value }
      const newErrors = { ...prev.errors }
      delete newErrors[name]

      return {
        ...prev,
        data: newData as T,
        errors: newErrors,
        isDirty: true,
      }
    })

    // Validate on change if enabled
    if (validateOnChange) {
      // Defer validation to next tick
      setTimeout(() => validateField(name), 0)
    }
  }, [validateOnChange, validateField])

  // Get error for a field
  const getError = useCallback((field: string): string | undefined => {
    return state.errors[field]
  }, [state.errors])

  // Clear error for a field
  const clearError = useCallback((field: string) => {
    setState(prev => {
      const newErrors = { ...prev.errors }
      delete newErrors[field]
      return { ...prev, errors: newErrors }
    })
  }, [])

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: {} }))
  }, [])

  // Reset to initial state
  const reset = useCallback(() => {
    setState({
      data: initialData,
      errors: {},
      isValid: false,
      isDirty: false,
    })
  }, [initialData])

  // Submit handler
  const submit = useCallback((onValid: (data: T) => void) => {
    setIsSubmitting(true)

    const result = schema.safeParse(state.data)

    if (result.success) {
      onValid(result.data)
    } else {
      const errors = formatErrors(result.error)
      setState(prev => ({
        ...prev,
        errors,
        isValid: false,
        isDirty: true,
      }))
    }

    setIsSubmitting(false)
  }, [schema, state.data, formatErrors])

  return {
    data: state.data,
    errors: state.errors,
    isValid: state.isValid,
    isDirty: state.isDirty,
    isSubmitting,
    setField,
    validateField,
    validateAll,
    reset,
    submit,
    getError,
    clearError,
    clearAllErrors,
  }
}

// ==================== FORM COMPONENTS ====================

interface ValidatedFieldProps {
  name: string
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function ValidatedField({ name, label, error, required, children }: ValidatedFieldProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-brand-ink">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  )
}

// ==================== VALIDATED INPUT ====================

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  error?: string
  formatValue?: (value: string) => string
}

export function ValidatedInput({
  name,
  label,
  error,
  formatValue,
  onChange,
  className,
  ...props
}: ValidatedInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (formatValue) {
      value = formatValue(value)
      e.target.value = value
    }
    onChange?.(e)
  }

  return (
    <ValidatedField name={name} label={label} error={error} required={props.required}>
      <input
        id={name}
        name={name}
        onChange={handleChange}
        className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-brand-line focus:border-brand-red focus:ring-red-200'
        } ${className || ''}`}
        {...props}
      />
    </ValidatedField>
  )
}

// ==================== VALIDATED TEXTAREA ====================

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  error?: string
}

export function ValidatedTextarea({
  name,
  label,
  error,
  className,
  ...props
}: ValidatedTextareaProps) {
  return (
    <ValidatedField name={name} label={label} error={error} required={props.required}>
      <textarea
        id={name}
        name={name}
        onChange={(e) => {
          // Auto-resize
          e.target.style.height = 'auto'
          e.target.style.height = e.target.scrollHeight + 'px'
        }}
        className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 resize-none ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-brand-line focus:border-brand-red focus:ring-red-200'
        } ${className || ''}`}
        {...props}
      />
    </ValidatedField>
  )
}

// ==================== PASSWORD STRENGTH ====================

export function usePasswordStrength(password: string) {
  return useMemo(() => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    if (checks.length) strength++
    if (checks.lowercase && checks.uppercase) strength++
    if (checks.number) strength++
    if (checks.special) strength++

    return {
      strength,
      maxStrength: 4,
      percentage: (strength / 4) * 100,
      checks,
      label: strength === 0 ? 'Muito fraca' : strength === 1 ? 'Fraca' : strength === 2 ? 'Regular' : strength === 3 ? 'Forte' : 'Muito forte',
      color: strength <= 1 ? 'red' : strength === 2 ? 'yellow' : strength === 3 ? 'blue' : 'green',
    }
  }, [password])
}

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthProps) {
  const { strength, maxStrength, checks } = usePasswordStrength(password)

  if (!password) return null

  const strengthColors: Record<number, string> = {
    0: 'bg-red-500',
    1: 'bg-red-500',
    2: 'bg-yellow-500',
    3: 'bg-blue-500',
    4: 'bg-green-500',
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength ? strengthColors[strength] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { key: 'lowercase', label: 'a-z' },
          { key: 'uppercase', label: 'A-Z' },
          { key: 'number', label: '0-9' },
          { key: 'special', label: '!@#$' },
        ].map(check => (
          <span
            key={check.key}
            className={checks[check.key as keyof typeof checks] ? 'text-green-600' : 'text-gray-400'}
          >
            {check.label}
          </span>
        ))}
      </div>
    </div>
  )
}
