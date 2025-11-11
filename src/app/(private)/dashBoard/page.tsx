import { CardOverall } from '@/components/Dashboard/CardOverall'
import { RegistrationButton } from '@/components/Dashboard/RegistrationButton'
import { TableContract } from '@/components/Dashboard/TableContract'

export default function DashBoard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <div className="mt-4">
        <CardOverall />
      </div>
      <div className="mt-4">
        <RegistrationButton />
      </div>
      <div className="mt-4">
        <TableContract />
      </div>
    </div>
  )
}
