const fetchPosts = () => {
    fetch('http://127.0.0.1:3001/allPosts')
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        showPosts(result);
    })
    .catch((err) => {
        console.log(err);
    })
}
fetchPosts();

try {
    const response = await fetch('http://127.0.0.1:3001/allPosts');
    if (response) {

    }
} catch (err) {
    
}


const showPosts = (jsonObj) => {
    jsonObj.forEach((post) => {
        const li = document.createElement('li');
        const profilePhoto = document.createElement('div').className('profile-photo');
        const img = document.createElement('img');
        const userAndContent = document.createElement('div').className('user-and-content');
        const postInfo = document.createElement('div').className('post-info');
        const userInfo = document.createElement('div').className('user-info');
        const username = document.createElement('a').className('user-name');
        const userId = document.createElement('a').className('user-id');
        const postedDate = document.createElement('div').className('posted-date');
        const dateFont = document.createElement('span').className('date');
        const postedContent = document.createElement('div').className('posted-content');
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
        username.href = `/profile`;
        userId.href = `/profile/${post.userId}`;
        dateFont.textContent = post.posted_date;
        postedContent.textContent = post.tsueeet_content;
        
        ul.appendChild(li);
    });
}
showPosts();