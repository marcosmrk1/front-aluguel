'use client'
import { CardOverall } from '@/components/Dashboard/CardOverall'
import { RegistrationButton } from '@/components/Dashboard/RegistrationButton'
import { TableContract } from '@/components/Dashboard/TableContract'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

const DashBoardContainer = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const hasShownToast = useRef(false)

  useEffect(() => {
    const loginSuccess = searchParams.get('login') === 'true'

    if (loginSuccess && !hasShownToast.current) {
      hasShownToast.current = true
      router.replace('/dashboard', { scroll: false })

      toast.success('Bem-vindo!')
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
