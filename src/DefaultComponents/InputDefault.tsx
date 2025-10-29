import { Input } from '@/components/ui/input'
import { FormikProps } from 'formik'
import React from 'react'
interface InputGenericProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formik: FormikProps<any>
  name: string
}

const baseStyle =
  'block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200'
const borderStyle = 'border-gray-200 focus:ring-amber-500 focus:border-transparent'
const errorStyle = 'border-red-500 focus:ring-red-500 focus:border-red-500'
const InputDefault = ({ formik, name, ...rest }: InputGenericProps) => {
  const errorInput = formik.errors[name] ? (formik.errors[name] as string) : null

  return (
    <>
      <div>
        <Input
          className={baseStyle}
          onChange={formik.handleChange}
          value={formik.values[name] || ''}
          {...rest}
        />
      </div>
      <span className="text-red-500 text-xs block absolute left-0 -bottom-5 min-h-3">
        {errorInput}
      </span>
    </>
  )
}

export default InputDefault
