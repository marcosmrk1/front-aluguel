'use client'
import { CardOverall } from '@/components/Dashboard/CardOverall'
import { RegistrationButton } from '@/components/Dashboard/RegistrationButton'
import { TableContract } from '@/components/Dashboard/TableContract'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const DashBoardContainer = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const loginSuccess = searchParams.get('login') === 'true'

    if (loginSuccess) {
      router.replace('/dashBoard')

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toast.success('Bem-vindo ao Dashboard!')
        })
      })
    }
  }, [searchParams, router])

  return (
    <>
      <div className="mt-4">
        <CardOverall />
      </div>
      <div className="mt-4">
        <RegistrationButton />
      </div>
      <div className="mt-4">
        <TableContract />
      </div>
    </>
  )
}
export { DashBoardContainer }
