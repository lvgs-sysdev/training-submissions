// top.htmlのスクリプト部分
(function () {
  function build() {
    // fetch header
    fetch('_header.html')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch header: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(html => { const el = document.getElementById('header'); if (el) el.innerHTML = html; })
      .catch(err => {
        console.error(err);
        const el = document.getElementById('header');
        if (el) el.innerHTML = '<!-- header failed to load -->';
      });

    // 一覧（新着）
    const articles = [
      { image: 'src/image-0.png', genre: 'Travel', date: '19 Feb 2022', title: "記事タイトル記事タイトル記事タイトル記事タイトル", body: '本文の一部を表示本文の一部を表示本文の..', url: '/article1' },
      { image: 'src/image-1.png', genre: 'Culinary', date: '25 Apr 2022', title: "The taste of Bang Embul's soto betawi", body: 'Each region has its own specialty food..', url: '/article2' },
      { image: 'src/image-2.png', genre: 'Travel', date: '29 Apr 2022', title: "Seeing the beauty of Bali, which has many statues in temples ", body: 'Talking about Bali is never boring to tell..', url: '/article3' },
      { image: 'src/image-3.png', genre: 'Culinary', date: '02 May 2022', title: "Delicious and cheap Semarang street food", body: "There's a lot of street food in Semarang..", url: '/article4' },
      { image: 'src/image-4.png', genre: 'Travel', date: '05 Jun 2022', title: "Karang bebai beach Lampung for summer vacation", body: 'Talking about Bali is never boring to tell..', url: '/article5' },
      { image: 'src/image-5.png', genre: 'Travel', date: '13 Jun 2022', title: "The upside-down mystical forest in Banyuwangi", body: 'This place is most often used as a photo..', url: '/article6' }
    ];

    const articleListGrid = document.getElementById('articleListGrid');
    if (articleListGrid) {
      articleListGrid.innerHTML = '';
      const frag = document.createDocumentFragment();
      articles.slice(0, 6).forEach(article => {
        const link = document.createElement('a');
        link.href = article.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'article-link';

        const section = document.createElement('div');
        section.className = 'article-card';

        const imgBox = document.createElement('div');
        imgBox.className = 'card-img-box';
        const img = document.createElement('img');
        img.className = 'card-img';
        img.src = article.image;
        img.alt = '';
        img.width = 360; img.height = 240;
        imgBox.appendChild(img);

        const meta = document.createElement('div');
        meta.className = 'meta-row';
        const genre = document.createElement('span'); genre.className = 'genre'; genre.textContent = article.genre;
        const sep = document.createElement('span'); sep.className = 'meta-separator';
        const date = document.createElement('span'); date.className = 'date'; date.textContent = article.date;
        meta.appendChild(genre); meta.appendChild(sep); meta.appendChild(date);

        const title = document.createElement('div'); title.className = 'title'; title.textContent = article.title;
        const body = document.createElement('div'); body.className = 'body'; body.textContent = article.body;

        section.appendChild(imgBox);
        section.appendChild(meta);
        section.appendChild(title);
        section.appendChild(body);

        link.appendChild(section);
        frag.appendChild(link);
      });
      articleListGrid.appendChild(frag);
    }

    // 人気記事
    const popularArticles = [
      { title: "記事タイトル記事タイトル記事タイトル記事タイトル", url: '#popular1' },
      { title: "Cheap Padang specialty food restaurant", url: '#popular2' },
      { title: "Mountain hiking in central Java", url: '#popular3' }
    ];

    const populararticleList = document.getElementById('populararticleList');
    if (populararticleList) {
      populararticleList.innerHTML = '';
      const frag = document.createDocumentFragment();
      popularArticles.slice(0, 3).forEach((article, idx, arr) => {
        const link = document.createElement('a');
        link.href = article.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'popular-link';

        const section = document.createElement('div');
        section.className = 'popular-section';
        const title = document.createElement('div');
        title.className = 'popular-article-title';
        title.textContent = article.title;
        section.appendChild(title);

        link.appendChild(section);
        frag.appendChild(link);

        if (idx < arr.length - 1) {
          const sep = document.createElement('div');
          sep.className = 'popular-separator';
          frag.appendChild(sep);
        }
      });
      populararticleList.appendChild(frag);
    }

    // footer
    fetch('_footer.html')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch footer: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(html => { const el = document.getElementById('footer'); if (el) el.innerHTML = html; })
      .catch(err => {
        console.error(err);
        const el = document.getElementById('footer');
        if (el) el.innerHTML = '<!-- footer failed to load -->';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
