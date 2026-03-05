import { AccountInfo } from "../types"
import { render, screen } from '@testing-library/react'
import { AccountInfoDisplay } from "./AccountInfoDisplay"

describe('AccountInfoDisplayコンポーネントのテストコード', () => {
  test('propsとして渡されたアカウントの情報を表示すること', () => {
    const mockAccountInfo: AccountInfo = {
      id: 1,
      user_name: 'Test User',
      email: 'test@test.com',
      pic_path: '/test.jpg',
      created_at: new Date('2026-01-01'),
      updated_at: new Date('2026-01-01')
    }

    render(<AccountInfoDisplay account={mockAccountInfo} />)
    
    expect(screen.getByText('User Name:')).toBeInTheDocument()
    expect(screen.getByText(mockAccountInfo.user_name)).toBeInTheDocument()

    expect(screen.getByText('Email:')).toBeInTheDocument()
    expect(screen.getByText(mockAccountInfo.email)).toBeInTheDocument()
  })
})
