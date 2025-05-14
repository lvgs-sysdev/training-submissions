// const getPath = location.pathname;
const splitPath = location.pathname.split('/');
const profileOwner = splitPath[splitPath.length - 1];

const othersProfileEndpoint = 'http://127.0.0.1:3001/others-profile';

const getJson = () => {
    fetch(othersProfileEndpoint)
    .then(response => response.json())
    .then(seeProfile => {
        for (const getProfile of seeProfile.othersProfileData) {
            if (getProfile.user_id === profileOwner) {
                const ownerUsername = document.getElementById('ownerUsername');
                const ownerImage = document.getElementById('ownerImage');
                const ownerBio = document.getElementById('ownerBio');

                ownerImage.src = `.${getProfile.profile_icon}`;

                ownerUsername.textContent = getProfile.username;
                if (getProfile.user_bio == null) {
                    ownerBio.textContent = 'このユーザはまだ自己紹介がありません';
                } else {
                    ownerBio.textContent = getProfile.user_bio;
                }
            }
        }
    });
}

getJson();