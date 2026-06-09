'use client'

import { useState, useCallback, InputHTMLAttributes, ReactNode } from 'react'
import { z, ZodSchema } from 'zod'

interface ValidatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  error?: string
  success?: boolean
  hint?: string
  icon?: ReactNode
  onChange?: (value: string, isValid: boolean) => void
  validation?: ZodSchema
}

export function ValidatedInput({
  label,
  error,
  success,
  hint,
  icon,
  onChange,
  validation,
  className = '',
  ...props
}: ValidatedInputProps) {
  const [internalError, setInternalError] = useState<string>()
  const [touched, setTouched] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const showError = error || (touched && internalError)
  const showSuccess = success ?? (touched && !internalError && props.value && isValid)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (validation) {
        const result = validation.safeParse(value)
        if (!result.success) {
          setInternalError(result.error.errors[0]?.message)
          setIsValid(false)
          onChange?.(value, false)
        } else {
          setInternalError(undefined)
          setIsValid(true)
          onChange?.(value, true)
        }
      } else {
        onChange?.(value, true)
      }
    },
    [validation, onChange]
  )

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-bold text-brand-ink">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
            {icon}
          </div>
        )}

        <input
          {...props}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          className={`
            w-full px-4 ${icon ? 'pl-10' : ''} py-3
            bg-white border-2 rounded-xl
            text-brand-ink text-sm font-medium
            transition-all duration-200
            focus:outline-none focus:ring-0
            ${showError
              ? 'border-red-400 bg-red-50 focus:border-red-500'
              : showSuccess
                ? 'border-emerald-400 bg-emerald-50 focus:border-emerald-500'
                : 'border-brand-line focus:border-brand-red focus:bg-white'
            }
            ${props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          `}
        />

        {showSuccess && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-xl">
            ✓
          </div>
        )}
      </div>

      {showError && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 animate-fade-in">
          <span>⚠</span> {showError}
        </p>
      )}
      {hint && !showError && (
        <p className="text-xs text-brand-muted">{hint}</p>
      )}
    </div>
  )
}

/**
 * Validador de schema Zod no nível de form
 */
export function useFormValidation<T extends z.ZodSchema>(
  schema: T
): {
  errors: Record<string, string>
  validate: (data: unknown) => boolean
  setFieldError: (field: string, message: string) => void
  clearErrors: () => void
} {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = useCallback(
    (data: unknown): boolean => {
      const result = schema.safeParse(data)
      if (!result.success) {
        const newErrors: Record<string, string> = {}
        result.error.errors.forEach((err) => {
          const path = err.path.join('.')
          if (!newErrors[path]) {
            newErrors[path] = err.message
          }
        })
        setErrors(newErrors)
        return false
      }
      setErrors({})
      return true
    },
    [schema]
  )

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  const clearErrors = useCallback(() => setErrors({}), [])

  return { errors, validate, setFieldError, clearErrors }
}