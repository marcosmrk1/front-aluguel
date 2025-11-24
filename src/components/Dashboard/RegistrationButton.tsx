'use client'

import { EyeIcon, HomeIcon, PersonStanding } from 'lucide-react'

const RegistrationButton = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <button className="flex flex-col items-center justify-center rounded-2xl bg-blue-600 text-white p-6 shadow-lg hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">
          {' '}
          <HomeIcon />
        </div>
        <h2 className="text-lg font-semibold">Cadastrar Imóvel</h2>
        <p className="text-sm opacity-90">Adicione um novo imóvel ao seu portfólio</p>
      </button>

      <button className="flex flex-col items-center justify-center rounded-2xl bg-emerald-700 text-white p-6 shadow-lg hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">
          {' '}
          <PersonStanding />
        </div>
        <h2 className="text-lg font-semibold">Cadastrar Inquilino</h2>
        <p className="text-sm opacity-90">Registre um novo inquilino</p>
      </button>

      <button className="flex flex-col items-center justify-center rounded-2xl bg-purple-600 text-white p-6 shadow-lg hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">
          {' '}
          <EyeIcon />
        </div>
        <h2 className="text-lg font-semibold">Ver Contratos</h2>
        <p className="text-sm opacity-90">Visualize todos os contratos</p>
      </button>
    </div>
  )
}
export { RegistrationButton }
