import { useSession } from 'next-auth/react'

export const useGetProprietario = () => {
  const { data, status } = useSession()

  const isLoading = status === 'loading'
  const profileComplete = data?.user.profileComplete ?? false
  const userCompleteProfile = !isLoading && profileComplete
  const dataUser = data?.user ?? null
  return {
    userCompleteProfile,
    dataUser,
    isLoading,
  }
}
