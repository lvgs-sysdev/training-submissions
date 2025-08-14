# Page snapshot

```yaml
- main:
  - link "titleImage Black Box":
    - /url: /
    - img "titleImage"
    - heading "Black Box" [level=1]
  - heading "ログイン" [level=2]
  - paragraph
  - paragraph: © こぴーらいと
  - heading "Login" [level=2]
  - list:
    - listitem:
      - text: User ID
      - textbox: thankyou_rabit
    - listitem:
      - text: Password
      - textbox: Arigatou
  - paragraph: ユーザーIDまたはパスワードが正しくありません。
  - button "login"
  - separator
  - paragraph:
    - text: If you don't have an account, click
    - link "here.":
      - /url: /register
```