import { Input } from '@/components/ui/input'
import { FormikProps } from 'formik'
import { PersonStanding } from 'lucide-react'
import React from 'react'
interface InputGenericProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formik: FormikProps<any>
  name: string
  mask?: (value: string) => string
  icon?: React.ReactNode
}

const baseStyle =
  'block w-full pl-10 pr-3 py-3 border rounded-xl   placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200'
const errorStyle = 'text-red-500 text-xs block mt-1 min-h-3'
const InputDefault = ({ formik, name, mask, icon, ...rest }: InputGenericProps) => {
  const errorInput = formik.errors[name] ? (formik.errors[name] as string) : null
  const existingMask = mask ? mask(formik.values[name]) : formik.values[name]
  return (
    <div className="w-full">
      <label htmlFor="email" className="block text-sm font-medium mb-1">
        {rest.id}
      </label>
      <div className="relative">
        {icon && (
          <div className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2 ">{icon}</div>
        )}
        <Input
          name={name}
          id={rest.id}
          type={rest.type}
          placeholder={rest.placeholder}
          className={baseStyle}
          onChange={formik.handleChange}
          value={existingMask}
          {...rest}
        />
      </div>

      <span className={errorStyle}>{errorInput}</span>
    </div>
  )
}

export default InputDefault
