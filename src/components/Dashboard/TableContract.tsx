'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

const contratos = [
  {
    id: 1,
    inquilino: {
      nome: 'Marcos Paulo',
    },
    imovel: {
      descricao: 'Apartamento 2 quartos no Centro',
    },
    aluguel: {
      valor: 1800.0,
      vencimento: '2025-12-10',
      status: 'ativo',
    },
  },
  {
    id: 2,
    inquilino: {
      nome: 'João Silva',
    },
    imovel: {
      descricao: 'Casa térrea com garagem no bairro Primavera',
    },
    aluguel: {
      valor: 1200.0,
      vencimento: '2025-11-20',
      status: 'atrasado',
    },
  },
  {
    id: 3,
    inquilino: {
      nome: 'Ana Souza',
    },
    imovel: {
      descricao: 'Kitnet próxima à universidade',
    },
    aluguel: {
      valor: 950.0,
      vencimento: '2025-11-30',
      status: 'ativo',
    },
  },
]

const columns: GridColDef[] = [
  {
    field: 'inquilino',
    headerName: 'Inquilino',
    width: 180,
    valueGetter: (value, row) => row.inquilino.nome,
  },
  {
    field: 'imovel',
    headerName: 'Imóvel',
    width: 300,
    valueGetter: (value, row) => row.imovel.descricao,
  },
  {
    field: 'valor',
    headerName: 'Valor',
    width: 130,
    valueGetter: (value, row) => row.aluguel.valor,
    valueFormatter: (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    },
  },
  {
    field: 'vencimento',
    headerName: 'Vencimento',
    width: 130,
    valueGetter: (value, row) => row.aluguel.vencimento,
    valueFormatter: (value) => {
      return new Date(value).toLocaleDateString('pt-BR')
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    valueGetter: (value, row) => row.aluguel.status,
    cellClassName: (params) => {
      if (params.value === 'atrasado') {
        return 'status-atrasado'
      }
      if (params.value === 'ativo') {
        return 'status-ativo'
      }
      return ''
    },
  },
]

const TableContract = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
        },
      }),
    [isDark],
  )

  return (
    <ThemeProvider theme={muiTheme}>
      <div style={{ height: 400, width: '100%' }}>
        <h1 className="text-2xl font-bold mb-4">Contratos de Aluguel</h1>

        <DataGrid
          rows={contratos}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{
            '& .status-atrasado': {
              backgroundColor: isDark ? 'oklch(0.704 0.191 22.216 / 20%)' : '#ffebee',
              color: isDark ? 'oklch(0.704 0.191 22.216)' : '#c62828',
              fontWeight: 'bold',
            },
            '& .status-ativo': {
              backgroundColor: isDark ? 'oklch(0.696 0.17 162.48 / 20%)' : '#e8f5e9',
              color: isDark ? 'oklch(0.696 0.17 162.48)' : '#2e7d32',
              fontWeight: 'bold',
            },
          }}
        />
      </div>
    </ThemeProvider>
  )
}

export { TableContract }
