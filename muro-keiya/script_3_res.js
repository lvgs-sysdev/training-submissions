
/*********  右サイドバーの目次作成処理 **********/
const titlesRes = document.querySelectorAll('section h2')
const tableOfContentsListRes = document.getElementById('tableOfContentsListRes')
// titlesResで取得した１項目ずつに対して処理をかける
titlesRes.forEach((el,index) => {
    el.parentNode.id = `contents${index + 1}`
    // 目次に設定するテキストをelから取得する
    const text = el.textContent
    // 子要素のidを作成する
    const li = document.createElement('li')
    const a = document.createElement('a')
    // 目次に設定するテキストを目次のaタグに設定する
    a.textContent = text
    a.href = `#contents${index + 1}`
    // liの子要素にaタグをセットする
    li.appendChild(a)
    // ulタグのid[tableOfConstentsList]の子要素にliタグをセットする
    tableOfContentsListRes.appendChild(li)
}
)

const sectionsRes = document.querySelectorAll('section')
window.addEventListener('scroll',function(){
    sectionsRes.forEach((el,index) => {
        let el_position = el.getBoundingClientRect();
        let targetElements = tableOfContentsListRes.querySelectorAll('li')
        targetElement = targetElements[index];
        targetElement.classList.remove("toc-highlight");
        if (el_position.top < 130 && el_position.bottom > 130) {
            targetElement.classList.add("toc-highlight");
        }
    })
});