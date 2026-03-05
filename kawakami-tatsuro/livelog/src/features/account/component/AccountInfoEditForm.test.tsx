import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { AccountInfo } from "../types"
import { AccountInfoEditForm } from "./AccountInfoEditForm"

const action = vi.fn()
const onCancelButtonClick = vi.fn()
const onEditSuccess = vi.fn()

const mockAccountInfo: AccountInfo = {
  id: 1,
  user_name: 'Test User',
  email: 'test@test.com',
  pic_path: '/test.jpg',
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01')
}

vi.spyOn(window, 'alert').mockImplementation(() => {})


describe('AccountInfoEditFormコンポーネントのテストコード', () => {
  describe('Saveボタンの活性・非活性の制御', () => {
    test('初期表示時はSaveボタンが非活性化されていること', () => {
      render(<AccountInfoEditForm
        action={action}
        account={mockAccountInfo}
        onCancelButtonClick={onCancelButtonClick}
        onEditSuccess={onEditSuccess}
        />)

        const saveBtn = screen.getByRole('button', {name: 'Save'})
        
        expect(saveBtn).toBeDisabled()
    })

    test('ユーザー名またはメールアドレスが編集された場合、Saveボタンが活性化されること', async () => {
      const user = userEvent.setup()

      render(<AccountInfoEditForm
        action={action}
        account={mockAccountInfo}
        onCancelButtonClick={onCancelButtonClick}
        onEditSuccess={onEditSuccess}
        />)

        const userNameInput = screen.getByRole('textbox', {name: 'User Name:'})
        const saveBtn = screen.getByRole('button', {name: 'Save'})

        await user.type(userNameInput, 'a') // ユーザー名を編集

        expect(saveBtn).toBeEnabled()
        
        await user.clear(userNameInput)
        await user.type(userNameInput, mockAccountInfo.user_name) // ユーザー名を初期値に戻す

        expect(saveBtn).toBeDisabled()
        
        const emailInput = screen.getByRole('textbox', {name: 'Email:'})

        await user.type(emailInput, 'a')  // メールアドレスを編集

        expect(saveBtn).toBeEnabled()

        await user.clear(emailInput)
        await user.type(emailInput, mockAccountInfo.email) // メールアドレスを初期値に戻す

        expect(saveBtn).toBeDisabled()
    })
  })

  describe('フォーム入力時の振る舞い', () => {
    test('有効なメールアドレスが入力されていない場合、メールアドレスのフィールドがinavlidになること', async () => {
      const user = userEvent.setup()

      render(<AccountInfoEditForm
        action={action}
        account={mockAccountInfo}
        onCancelButtonClick={onCancelButtonClick}
        onEditSuccess={onEditSuccess}
        />)

        const emailInput = screen.getByRole('textbox', {name: 'Email:'})

        expect(emailInput).toBeValid()
        
        await user.clear(emailInput)
        await user.type(emailInput, 'test1@test.') // メールアドレスとして有効ではない文字列を入力

        expect(emailInput).toBeInvalid()
    })
  })

  describe('フォーム送信時の振る舞い', () => {
    test('アカウント情報変更の成功時、成功アラートを表示し、onEditSuccess関数が呼ばれること', async () => {
      const user = userEvent.setup()

      vi.mocked(action).mockResolvedValue({
        success: true,
        status: 200,
        data: null
      })

      render(<AccountInfoEditForm
        action={action}
        account={mockAccountInfo}
        onCancelButtonClick={onCancelButtonClick}
        onEditSuccess={onEditSuccess}
        />)

        const userNameInput = screen.getByRole('textbox', {name: 'User Name:'})
        const saveBtn = screen.getByRole('button', {name: 'Save'})
        
        await user.clear(userNameInput)
        await user.type(userNameInput, 'New Name') // ユーザー名を編集
        await user.click(saveBtn)

        const formData = vi.mocked(action).mock.calls[0][0] // action関数の引数からフォームの入力値を取得
        
        expect(formData.get('userName')).toBe('New Name')

        expect(window.alert).toHaveBeenCalledWith('Account info is updated.')
        expect(onEditSuccess).toHaveBeenCalled()
    })

    test('トークンが切れていた場合、再ログインを求めるアラートを表示すること', async () => {
      const user = userEvent.setup()

      vi.mocked(action).mockResolvedValue({
        success: false,
        status: 401,
        code: 'UNAUTHORIZED'
      })

      render(<AccountInfoEditForm
        action={action}
        account={mockAccountInfo}
        onCancelButtonClick={onCancelButtonClick}
        onEditSuccess={onEditSuccess}
        />)

        const userNameInput = screen.getByRole('textbox', {name: 'User Name:'})
        const saveBtn = screen.getByRole('button', {name: 'Save'})
        
        await user.clear(userNameInput)
        await user.type(userNameInput, 'New Name') // ユーザー名を編集
        await user.click(saveBtn)

        expect(window.alert).toHaveBeenCalledWith('Your session has timed out.\nPlease log in again.')
        expect(onEditSuccess).not.toHaveBeenCalled()
    })

    test('すでに登録されているメールアドレスであった場合、メールアドレスのフィールド下部にエラー文言が表示されること', async () => {
      const user = userEvent.setup()

      vi.mocked(action).mockResolvedValue({
        success: false,
        status: 409,
        code: 'EMAIL_DUPLICATE'
      })

      render(<AccountInfoEditForm
        action={action}
        account={mockAccountInfo}
        onCancelButtonClick={onCancelButtonClick}
        onEditSuccess={onEditSuccess}
        />)

        const emailInput = screen.getByRole('textbox', {name: 'Email:'})
        const saveBtn = screen.getByRole('button', {name: 'Save'})
        
        await user.clear(emailInput)
        await user.type(emailInput, 'test1@test.com') // メールアドレスを編集
        await user.click(saveBtn)

        const alerts = await screen.findAllByRole('alert', {}) 

        expect(alerts[1]).toHaveTextContent(/already in use/)
        expect(onEditSuccess).not.toHaveBeenCalled()
    })

    test('サーバーでエラーが発生した場合、エラーアラートが表示されること', async () => {
      const user = userEvent.setup()

      vi.mocked(action).mockResolvedValue({
        success: false,
        status: 500,
        code: 'INTERNAL_ERROR'
      })

      render(<AccountInfoEditForm
        action={action}
        account={mockAccountInfo}
        onCancelButtonClick={onCancelButtonClick}
        onEditSuccess={onEditSuccess}
        />)

        const emailInput = screen.getByRole('textbox', {name: 'Email:'})
        const saveBtn = screen.getByRole('button', {name: 'Save'})
        
        await user.clear(emailInput)
        await user.type(emailInput, 'test1@test.com') // メールアドレスを編集
        await user.click(saveBtn)

        expect(window.alert).toHaveBeenCalledWith('Something went wrong. Please try again later.')
        expect(onEditSuccess).not.toHaveBeenCalled()
    })
  })
})
