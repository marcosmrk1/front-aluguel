const basicStyle =
  'w-full flex items-center justify-center px-4 py-3 border rounded-xl shadow-lg text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200'

const colorStyle =
  'border-transparent bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:ring-amber-500 transform hover:scale-[1.02] active:scale-[0.98]'

interface ButtonGenericProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const ButtonGeneric = ({ children, ...rest }: ButtonGenericProps) => {
  return (
    <button {...rest} type="submit" className={basicStyle + colorStyle}>
      {children}
    </button>
  )
}

export default ButtonGeneric
