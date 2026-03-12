document.getElementById('loginForm').addEventListener('submit',async (event) =>{
    //1.フォームの標準動作（画面動作）を止める
    event.preventDefault();

    //2.フォームの中身をオブジェクトにまとめる
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    //3.fetchでサーバに送信
    try {
        const response = await fetch('/login',{
            method:'POST',
            headers:{
                'Content-type': 'application/json' //JSONで送ると宣言
            },
            body: JSON.stringify(data) //オブジェクトをJSON文字列に変換
        });

        //4.結果の処理
        if(response.ok){
            alert('ログイン成功！');
        }else{
            alert('エラーが発生しました');
        }
    } catch (error) {
        console.error('通信失敗', error);
    }
});
