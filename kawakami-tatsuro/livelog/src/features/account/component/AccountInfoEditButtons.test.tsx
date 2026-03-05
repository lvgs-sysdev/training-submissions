import { fireEvent, render, screen } from "@testing-library/react"
import { AccountInfoEditButtons } from "./AccountInfoEditButtons"

describe('AccountInfoEditButtonsコンポーネントのテストコード', () => {
  test('ボタンがクリックされたらpropsとして渡された関数が呼び出されること', () => {
    const onEditButtonClickMock = vi.fn()
    render(<AccountInfoEditButtons onEditButtonClick={onEditButtonClickMock} />)

    const editButton = screen.getByRole('button')

    expect(editButton).toHaveTextContent('Edit')

    fireEvent.click(editButton)

    expect(onEditButtonClickMock).toHaveBeenCalled
  })
})
