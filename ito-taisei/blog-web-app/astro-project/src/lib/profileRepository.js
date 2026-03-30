export async function getPostedData() {
  // TODO: 本来はDBから投稿者リストを取得する
  const authors = [
    { img: '/src/profile-img.png', name: 'Andrea Wise' },
    { img: '/src/profile-1.png', name: 'Karen Smith' },
    { img: '/src/profile-2.png', name: 'Samantha William' },
    { img: '/src/profile-3.png', name: 'Renata Hope' },
    { img: '/src/profile-4.png', name: 'Angela Saunder' }
  ];
  return authors;
}

export async function getProfileData(article) {
  // TODO: 本来はDBから記事の著者情報を取得する
  const profile = {
    avatarUrl: '/src/profile.jpg',
    name: 'Karen Smith',
    date: article.date, // articleDataから日付を流用
    sns: [
      { platform: 'twitter', url: 'https://twitter.com/your' },
      { platform: 'instagram', url: 'https://instagram.com/your' },
      { platform: 'linkedin', url: 'https://linkedin.com/your' }
    ]
  };
  return profile;
}
