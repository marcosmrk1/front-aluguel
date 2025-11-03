const maskCpf = (cpf: string): string => {
  const cleanedCpf = cpf.replace(/\D/g, '')
  const match = cleanedCpf.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
  }
  return cpf
}

export { maskCpf }
