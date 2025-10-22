// article.htmlのスクリプト部分
(function () {
  function build() {
    // safe fetch for header and footer with minimal error handling
    const headerEl = document.getElementById('header');
    const footerEl = document.getElementById('footer');

    const headerPromise = fetch('_header.html')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch header: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(html => { if (headerEl) headerEl.innerHTML = html; })
      .catch(err => { console.error(err); if (headerEl) headerEl.innerHTML = '<!-- header failed to load -->'; });

    const footerPromise = fetch('_footer.html')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch footer: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(html => { if (footerEl) footerEl.innerHTML = html; })
      .catch(err => { console.error(err); if (footerEl) footerEl.innerHTML = '<!-- footer failed to load -->'; });

    // sample profile data (can be replaced with real data)
    const profileData = {
      avatarUrl: 'src/profile.jpg',
      name: 'Karen Smith',
      date: '19 Feb 2022',
      sns: [
        { platform: 'twitter', url: 'https://twitter.com/your' },
        { platform: 'instagram', url: 'https://instagram.com/your' },
        { platform: 'linkedin', url: 'https://linkedin.com/your' }
      ]
    };

    // when both attempts finish (success or failure), render the profile
    Promise.allSettled([headerPromise, footerPromise]).finally(() => {
      const profileContainer = document.getElementById('profileWrapper') || document.querySelector('.profile-wrapper');
      renderProfile(profileContainer, profileData);
    });

		const newArticles = [
      { image: 'src/image-0.png', genre: 'Travel', date: '19 Feb 2022', body: '記事タイトル記事タイトル記事タイトル記事タイトル', url: '/article1' },
      { image: 'src/image-1.png', genre: 'Culinary', date: '25 Apr 2022', body: 'Enjoying the sunset on Padar island together', url: '/article2' },
      { image: 'src/image-2.png', genre: 'Travel', date: '29 Apr 2022', body: 'The lush green surroundings of the campgrounds create a..', url: '/article3' }
    ];

		const newArticleList = document.getElementById('newArticleList');
    if (newArticleList) {
      newArticleList.innerHTML = '';
      const frag = document.createDocumentFragment();
      newArticles.slice(0, 3).forEach(article => {
        const link = document.createElement('a');
        link.href = article.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'new-article-link';

        const section = document.createElement('div');
        section.className = 'new-article-card';

        const imgBox = document.createElement('div');
        imgBox.className = 'new-card-img-box';
        const img = document.createElement('img');
        img.className = 'new-card-img';
        img.src = article.image;
        img.alt = '';
        img.width = 265; img.height = 165;
        imgBox.appendChild(img);

        const meta = document.createElement('div');
        meta.className = 'meta-row';
        const genre = document.createElement('span'); genre.className = 'genre'; genre.textContent = article.genre;
        const sep = document.createElement('span'); sep.className = 'meta-separator';
        const date = document.createElement('span'); date.className = 'date'; date.textContent = article.date;
        meta.appendChild(genre); meta.appendChild(sep); meta.appendChild(date);

        const body = document.createElement('div'); body.className = 'body'; body.textContent = article.body;

        section.appendChild(imgBox);
        section.appendChild(meta);
        section.appendChild(body);

        link.appendChild(section);
        frag.appendChild(link);
      });
      newArticleList.appendChild(frag);
    }

    // 関連記事
    const articles = [
      { image: 'src/image-0.png', genre: 'Travel', date: '19 Feb 2022', title: "記事タイトル記事タイトル記事タイトル記事タイトル", body: '本文の一部を表示本文の一部を表示本文の..', url: '/article1' },
      { image: 'src/image-1.png', genre: 'Culinary', date: '25 Apr 2022', title: "The taste of Bang Embul's soto betawi", body: 'Each region has its own specialty food..', url: '/article2' }
    ];

    const articleListGrid = document.getElementById('articleListGrid');
    if (articleListGrid) {
      articleListGrid.innerHTML = '';
      const frag = document.createDocumentFragment();
      articles.slice(0, 2).forEach(article => {
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

    // populate posted profiles (clone template 5 times)
    const postedList = document.getElementById('postedList');
    const postedTpl = document.getElementById('postedProfileTpl');
    if (postedList && postedTpl) {
      const sample = [
        { img: 'src/profile-img.png', name: 'Andrea Wise' },
        { img: 'src/profile-1.png', name: 'Karen Smith' },
        { img: 'src/profile-2.png', name: 'Samantha William' },
        { img: 'src/profile-3.png', name: 'Renata Hope' },
        { img: 'src/profile-4.png', name: 'Angela Saunder' }
      ];
      const frag2 = document.createDocumentFragment();
      sample.slice(0,5).forEach(item => {
        const clone = postedTpl.content.cloneNode(true);
        const li = clone.querySelector('.posted-profile');
        if (li) {
          const img = li.querySelector('img.posted-profile-img');
          const name = li.querySelector('.posted-profile-name');
          if (img) { img.src = item.img; img.alt = `${item.name}のプロフィール`; }
          if (name) name.textContent = item.name;
        }
        frag2.appendChild(clone);
      });
      postedList.appendChild(frag2);
    }
  }



  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  function renderProfile(container, data) {
    if (!container) return console.error('profile container not found');

    // create avatar node (image or initials)
    const avatar = document.createElement('div');
    avatar.className = 'profile-avatar';
    if (data.avatarUrl) {
      const img = document.createElement('img');
      img.src = data.avatarUrl;
      img.alt = data.name ? `${data.name}のアイコン` : 'プロフィール画像';
      img.onerror = () => { img.style.display = 'none'; avatar.textContent = initialsFromName(data.name); };
      avatar.appendChild(img);
    } else {
      avatar.textContent = initialsFromName(data.name);
    }

    // meta
    const meta = document.createElement('div');
    meta.className = 'profile-meta';

    const nameRow = document.createElement('div');
    nameRow.className = 'profile-name-row';

    const nameEl = document.createElement('div');
    nameEl.className = 'profile-name';
    nameEl.textContent = data.name || '匿名';
    nameRow.appendChild(nameEl);

    const dateEl = document.createElement('div');
    dateEl.className = 'profile-date';
    dateEl.textContent = data.date || '';
    nameRow.appendChild(dateEl);

    meta.appendChild(nameRow);

    // SNS and copy button container
    const snsRow = document.createElement('div');
    snsRow.className = 'profile-sns';

    // create placeholder for SNS icons
    let copyBtn = null;
    if (Array.isArray(data.sns) && data.sns.length) {
      data.sns.forEach(item => {
        if (!item || !item.url) return;
        const a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', item.platform || 'social');
        a.title = item.platform || item.url;
        const pf = (item.platform || '').toLowerCase();
        if (pf === 'twitter') {
          a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.633 7.99698C19.646 8.17198 19.646 8.34598 19.646 8.51998C19.646 13.845 15.593 19.981 8.186 19.981C5.904 19.981 3.784 19.32 2 18.172C2.324 18.209 2.636 18.222 2.973 18.222C4.78599 18.2264 6.54765 17.6201 7.974 16.501C7.13342 16.4858 6.31858 16.2084 5.64324 15.7077C4.9679 15.207 4.46578 14.5079 4.207 13.708C4.456 13.745 4.706 13.77 4.968 13.77C5.329 13.77 5.692 13.72 6.029 13.633C5.11676 13.4488 4.29647 12.9543 3.70762 12.2337C3.11876 11.513 2.79769 10.6106 2.799 9.67998V9.62998C3.336 9.92898 3.959 10.116 4.619 10.141C4.06609 9.77357 3.61272 9.27501 3.29934 8.68977C2.98596 8.10454 2.82231 7.45084 2.823 6.78698C2.823 6.03898 3.022 5.35298 3.371 4.75498C4.38314 6 5.6455 7.01854 7.07634 7.74464C8.50717 8.47074 10.0746 8.8882 11.677 8.96998C11.615 8.66998 11.577 8.35898 11.577 8.04698C11.5767 7.51794 11.6807 6.99404 11.8831 6.50522C12.0854 6.0164 12.3821 5.57226 12.7562 5.19817C13.1303 4.82408 13.5744 4.52739 14.0632 4.32506C14.5521 4.12273 15.076 4.01872 15.605 4.01898C16.765 4.01898 17.812 4.50498 18.548 5.29098C19.4498 5.1166 20.3145 4.7874 21.104 4.31798C20.8034 5.2488 20.1738 6.03809 19.333 6.53798C20.1328 6.44676 20.9144 6.23643 21.652 5.91398C21.1011 6.71708 20.4185 7.42133 19.633 7.99698Z" fill="#121212"/></svg>`;
        } else if (pf === 'instagram') {
          a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M20.9471 8.30502C20.937 7.54764 20.7952 6.79779 20.5281 6.08902C20.2964 5.49117 19.9426 4.94822 19.4892 4.49485C19.0359 4.04148 18.4929 3.68767 17.8951 3.45602C17.1954 3.19338 16.4562 3.05136 15.7091 3.03602C14.7471 2.99302 14.4421 2.98102 12.0001 2.98102C9.55807 2.98102 9.24507 2.98102 8.29007 3.03602C7.54323 3.05147 6.80442 3.19349 6.10507 3.45602C5.50713 3.68751 4.96409 4.04126 4.5107 4.49465C4.05732 4.94804 3.70356 5.49108 3.47207 6.08902C3.2089 6.78815 3.06719 7.52713 3.05307 8.27402C3.01007 9.23702 2.99707 9.54202 2.99707 11.984C2.99707 14.426 2.99707 14.738 3.05307 15.694C3.06807 16.442 3.20907 17.18 3.47207 17.881C3.70395 18.4788 4.05797 19.0216 4.51151 19.4748C4.96505 19.928 5.50813 20.2816 6.10607 20.513C6.8035 20.7862 7.54244 20.9384 8.29107 20.963C9.25407 21.006 9.55907 21.019 12.0011 21.019C14.4431 21.019 14.7561 21.019 15.7111 20.963C16.4582 20.9483 17.1974 20.8066 17.8971 20.544C18.4948 20.3121 19.0376 19.9582 19.4909 19.5049C19.9442 19.0515 20.2982 18.5087 20.5301 17.911C20.7931 17.211 20.9341 16.473 20.9491 15.724C20.9921 14.762 21.0051 14.457 21.0051 12.014C21.0031 9.57202 21.0031 9.26202 20.9471 8.30502ZM11.9941 16.602C9.44007 16.602 7.37107 14.533 7.37107 11.979C7.37107 9.42502 9.44007 7.35602 11.9941 7.35602C13.2202 7.35602 14.396 7.84308 15.263 8.71006C16.13 9.57704 16.6171 10.7529 16.6171 11.979C16.6171 13.2051 16.13 14.381 15.263 15.248C14.396 16.115 13.2202 16.602 11.9941 16.602ZM16.8011 8.26302C16.6595 8.26315 16.5192 8.23536 16.3884 8.18123C16.2575 8.1271 16.1386 8.0477 16.0385 7.94757C15.9384 7.84745 15.859 7.72855 15.8049 7.59771C15.7507 7.46686 15.7229 7.32662 15.7231 7.18502C15.7231 7.04352 15.7509 6.90341 15.8051 6.77268C15.8592 6.64195 15.9386 6.52317 16.0387 6.42311C16.1387 6.32306 16.2575 6.24369 16.3882 6.18954C16.519 6.13539 16.6591 6.10752 16.8006 6.10752C16.9421 6.10752 17.0822 6.13539 17.2129 6.18954C17.3436 6.24369 17.4624 6.32306 17.5625 6.42311C17.6625 6.52317 17.7419 6.64195 17.7961 6.77268C17.8502 6.90341 17.8781 7.04352 17.8781 7.18502C17.8781 7.78102 17.3961 8.26302 16.8011 8.26302Z" fill="#A8A8A8"/> <path d="M11.9942 14.982C13.6527 14.982 14.9972 13.6375 14.9972 11.979C14.9972 10.3205 13.6527 8.97601 11.9942 8.97601C10.3357 8.97601 8.99121 10.3205 8.99121 11.979C8.99121 13.6375 10.3357 14.982 11.9942 14.982Z" fill="#A8A8A8"/></svg>`;
        } else if (pf === 'linkedin') {
          a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V17C0 17.2652 0.105357 17.5196 0.292893 17.7071C0.48043 17.8946 0.734784 18 1 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0ZM5.339 15.337H2.667V6.747H5.339V15.337ZM4.003 5.574C3.59244 5.574 3.1987 5.41091 2.9084 5.1206C2.61809 4.8303 2.455 4.43655 2.455 4.026C2.455 3.61544 2.61809 3.22171 2.9084 2.9314C3.1987 2.64109 3.59244 2.478 4.003 2.478C4.41356 2.478 4.80729 2.64109 5.0976 2.9314C5.38791 3.22171 5.551 3.61544 5.551 4.026C5.551 4.43655 5.38791 4.8303 5.0976 5.1206C4.80729 5.41091 4.41356 5.574 4.003 5.574ZM15.338 15.337H12.669V11.16C12.669 10.164 12.651 8.883 11.281 8.883C9.891 8.883 9.68 9.969 9.68 11.09V15.338H7.013V6.748H9.573V7.922H9.61C9.965 7.247 10.837 6.535 12.134 6.535C14.838 6.535 15.337 8.313 15.337 10.627L15.338 15.337Z" fill="#A8A8A8"/></svg>`;
        } else {
          a.textContent = (item.platform || '').slice(0,1).toUpperCase() || 'S';
        }
        snsRow.appendChild(a);
      });
      // copy button (placed to the right of SNS icons)
      copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-link';
      copyBtn.setAttribute('aria-label', 'Copy page link');
      copyBtn.title = 'Copy page link';
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4.22172 19.778C4.68559 20.2426 5.23669 20.6109 5.84334 20.8618C6.44999 21.1127 7.10023 21.2412 7.75672 21.24C8.41335 21.2412 9.06374 21.1126 9.67054 20.8617C10.2774 20.6108 10.8286 20.2425 11.2927 19.778L14.1207 16.949L12.7067 15.535L9.87872 18.364C9.31519 18.925 8.55239 19.24 7.75722 19.24C6.96205 19.24 6.19925 18.925 5.63572 18.364C5.07422 17.8008 4.75892 17.0379 4.75892 16.2425C4.75892 15.4472 5.07422 14.6843 5.63572 14.121L8.46472 11.293L7.05072 9.87902L4.22172 12.707C3.28552 13.6455 2.75977 14.9169 2.75977 16.2425C2.75977 17.5681 3.28552 18.8396 4.22172 19.778ZM19.7777 11.293C20.7134 10.3543 21.2388 9.08294 21.2388 7.75752C21.2388 6.43211 20.7134 5.16074 19.7777 4.22202C18.8393 3.28583 17.5678 2.76007 16.2422 2.76007C14.9166 2.76007 13.6452 3.28583 12.7067 4.22202L9.87872 7.05102L11.2927 8.46502L14.1207 5.63602C14.6842 5.07501 15.447 4.76005 16.2422 4.76005C17.0374 4.76005 17.8002 5.07501 18.3637 5.63602C18.9252 6.19929 19.2405 6.96219 19.2405 7.75752C19.2405 8.55286 18.9252 9.31575 18.3637 9.87902L15.5347 12.707L16.9487 14.121L19.7777 11.293Z" fill="#A8A8A8"/>
          <path d="M8.46383 16.95L7.04883 15.536L15.5358 7.04999L16.9498 8.46499L8.46383 16.95Z" fill="#A8A8A8"/>
        </svg>`;
      copyBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => showTempFeedback(copyBtn, 'Copied')).catch(() => showTempFeedback(copyBtn, 'Failed'));
        } else {
          const ta = document.createElement('textarea');
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); showTempFeedback(copyBtn, 'Copied'); } catch (e) { showTempFeedback(copyBtn, 'Failed'); }
          ta.remove();
        }
      });
      snsRow.appendChild(copyBtn);
    } else {
      // no sns, still add copy button to the row
      copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-link';
      copyBtn.setAttribute('aria-label', 'Copy page link');
      copyBtn.title = 'Copy page link';
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.22172 19.778C4.68559 20.2426 5.23669 20.6109 5.84334 20.8618C6.44999 21.1127 7.10023 21.2412 7.75672 21.24C8.41335 21.2412 9.06374 21.1126 9.67054 20.8617C10.2774 20.6108 10.8286 20.2425 11.2927 19.778L14.1207 16.949L12.7067 15.535L9.87872 18.364C9.31519 18.925 8.55239 19.24 7.75722 19.24C6.96205 19.24 6.19925 18.925 5.63572 18.364C5.07422 17.8008 4.75892 17.0379 4.75892 16.2425C4.75892 15.4472 5.07422 14.6843 5.63572 14.121L8.46472 11.293L7.05072 9.87902L4.22172 12.707C3.28552 13.6455 2.75977 14.9169 2.75977 16.2425C2.75977 17.5681 3.28552 18.8396 4.22172 19.778ZM19.7777 11.293C20.7134 10.3543 21.2388 9.08294 21.2388 7.75752C21.2388 6.43211 20.7134 5.16074 19.7777 4.22202C18.8393 3.28583 17.5678 2.76007 16.2422 2.76007C14.9166 2.76007 13.6452 3.28583 12.7067 4.22202L9.87872 7.05102L11.2927 8.46502L14.1207 5.63602C14.6842 5.07501 15.447 4.76005 16.2422 4.76005C17.0374 4.76005 17.8002 5.07501 18.3637 5.63602C18.9252 6.19929 19.2405 6.96219 19.2405 7.75752C19.2405 8.55286 18.9252 9.31575 18.3637 9.87902L15.5347 12.707L16.9487 14.121L19.7777 11.293Z" fill="#A8A8A8"/><path d="M8.46383 16.95L7.04883 15.536L15.5358 7.04999L16.9498 8.46499L8.46383 16.95Z" fill="#A8A8A8"/></svg>`;
      copyBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => showTempFeedback(copyBtn, 'Copied')).catch(() => showTempFeedback(copyBtn, 'Failed'));
        } else {
          const ta = document.createElement('textarea');
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); showTempFeedback(copyBtn, 'Copied'); } catch (e) { showTempFeedback(copyBtn, 'Failed'); }
          ta.remove();
        }
      });
      snsRow.appendChild(copyBtn);
    }

  meta.appendChild(snsRow);

    // assemble
    container.innerHTML = '';
    container.appendChild(avatar);
    container.appendChild(meta);
  }

  // helper: get initials from name
  function initialsFromName(name) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  }
  
  // helper to show temporary feedback on a button
  function showTempFeedback(btn, text) {
    const prev = btn.innerHTML;
    btn.textContent = text;
    setTimeout(() => { btn.innerHTML = prev; }, 1200);
  }
})();
