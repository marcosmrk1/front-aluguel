import { title } from 'process'

const data = [
  {
    title: 'Total de Imóveis',
    value: '100',
    icon: '🏠',
  },

  {
    title: 'Total de contratos(ativo)',
    value: '30',
    icon: '👤',
  },
  {
    title: 'Receita total',
    value: 'R$ 10.000,00',
    icon: '💰',
  },
]

const CardOverall = () => {
  return (
    <div className="grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6   ">
      {data.map((item, index) => (
        <div key={index} className="p-4 rounded-lg shadow-md flex items-center bg-white">
          <div className="text-3xl mr-5">{item.icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
export { CardOverall }
