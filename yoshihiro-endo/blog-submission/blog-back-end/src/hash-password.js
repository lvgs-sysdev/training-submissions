import bcrypt from 'bcrypt';
import readline from 'readline/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const password = await rl.question('ハッシュ化するパスワードを入力してください: ');
const saltRounds = 10; // コストファクター
const hash = await bcrypt.hash(password, saltRounds);

console.log('---');
console.log('生成されたハッシュ (これをDBに保存します):');
console.log(hash);
console.log('---');
console.log('以下のSQL文でDBに挿入してください:');
console.log(
`INSERT INTO users (username, password_hash, full_name, photo_url)
VALUES (
    'testuser',
    '${hash}',
    'テスト 太郎',
    'https://example.com/images/default.png'
);`
);

rl.close();