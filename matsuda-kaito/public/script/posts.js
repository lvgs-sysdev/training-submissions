const getJson = () => {
    fetch('http://127.0.0.1:3001/allPosts')
    .then(response => response.json())
    .then(posts => {
        for (const post of posts.allPosts) {
        const ul = document.querySelector('.all-posts');
        const li = document.createElement('li');
        li.className = 'z-post';
        const profilePhoto = document.createElement('div');
        profilePhoto.className = 'profile-photo';
        const img = document.createElement('img');
        img.src = post.profile_icon;
        const userAndContent = document.createElement('div');
        userAndContent.className = 'user-and-content';
        const postInfo = document.createElement('div');
        postInfo.className = 'post-info';
        const userInfo = document.createElement('div')
        userInfo.className = 'user-info';
        const username = document.createElement('a');
        username.className = 'user-name';
        const userId = document.createElement('a');
        userId.className = 'user-id';
        const postedDate = document.createElement('div')
        postedDate.className = 'posted-date';
        const dateFont = document.createElement('span');
        dateFont.className = 'date';
        const postedContent = document.createElement('div');
        postedContent.className = 'posted-content';
        li.appendChild(profilePhoto);
        li.appendChild(userAndContent);
        profilePhoto.appendChild(img);
        userAndContent.appendChild(postInfo);
        userAndContent.appendChild(postedContent);
        postInfo.appendChild(userInfo);
        userInfo.appendChild(username);
        userInfo.appendChild(userId);
        postInfo.appendChild(postedDate);
        postedDate.appendChild(dateFont);
        username.href = `/others/${post.user_id}`;
        username.textContent = post.username;
        userId.href = `/others/${post.user_id}`;
        userId.textContent = post.user_id;
        const year = post.posted_date.slice(0,4) + '年';
        const month = post.posted_date.slice(5,7) + '月';
        const day = post.posted_date.slice(8,10) + '日';
        dateFont.textContent = year + month + day;
        postedContent.textContent = post.tsueeet_content;
        
        ul.appendChild(li);
        }
    });
}

getJson();