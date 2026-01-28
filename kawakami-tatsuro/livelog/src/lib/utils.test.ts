import { formatDateForInput } from "./utils"

describe('formatDateForInput関数のテスト', () => {
  test('Dateオブジェクトを入力するとYYYY-MM-DD形式の文字列を返却すること', () => {
    const inputsAndOutputs = new Map([
      [new Date('2025-12-31'), '2025-12-31'], // 年の変わり目、月の最後
      [new Date('2026-01-01'), '2026-01-01'], // 年の初め、月の初め
      [new Date('2024-02-29'), '2024-02-29']  // 閏年
    ])

    inputsAndOutputs.forEach((output, input) => {
      const formattedDate = formatDateForInput(input)
      expect(formattedDate).toBe(output)
    })
  })

  test('string形式の日付を入力するとYYYY-MM-DD形式の文字列を返却すること', () => {
    const inputsAndOutputs = new Map([
      // 日本時間 2025-12-31 00:00:00 をシリアライズした文字列
      ['2025-12-30T15:00:00.000Z', '2025-12-31'], 

      // 日本時間 2026-01-01 00:00:00 をシリアライズした文字列
      ['2025-12-31T15:00:00.000Z', '2026-01-01'], 

      // 日本時間 2024-02-29 00:00:00 をシリアライズした文字列
      ['2024-02-28T15:00:00.000Z', '2024-02-29']
    ])

    inputsAndOutputs.forEach((output, input) => {
      const formattedDate = formatDateForInput(input)
      expect(formattedDate).toBe(output)
    })
  })

  test('undefinedを入力すると空文字列を返却すること', () => {
    const result = formatDateForInput(undefined)
    expect(result).toBe('')
  })

  test('nullを入力すると空文字列を返却すること', () => {
    const result = formatDateForInput(null)
    expect(result).toBe('')
  })
})
