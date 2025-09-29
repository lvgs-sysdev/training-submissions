document.addEventListener('DOMContentLoaded', async () => {
    const containers = document.querySelectorAll('.card-review');

    try {
        const response = await fetch('/article');
        const articles = await response.json();

        const imagePaths = [
            "/assets/images/travel-1.png",
            "/assets/images/image.png",
            "/assets/images/image2.png",
            "/assets/images/image19.jpg",
            "/assets/images/image14.jpg",
            "/assets/images/image3.png"
        ];

        const categories = [
            "Travel",
            "Culinary",
            "Travel",
            "Culinary",
            "Travel",
            "Travel"
        ];

        articles.forEach((article, index) => {
            const container = containers[index];

            const imagePath = imagePaths[index % imagePaths.length];
            const category = categories[index % categories.length];

            if (container) {
                const articleLink = `/detail.html?id=${article.id}`;

                const date = new Date(article.updated_at);
                const day = date.getDate();
                const month = date.toLocaleString('en-US', { month: 'short' });
                const year = date.getFullYear();
                const formattedDate = `${day} ${month} ${year}`;

                container.innerHTML = ` 
                <div class="card-review-image">
                    <img src="${imagePath}" alt="記事の写真">
                </div>
                <div class="category-date-wrapper">
                <p class="article-category">${category}</p>
                <span class="article-date">
                    ${formattedDate}
                </span>
                </div>
                <p class="graphic-design"><a href="${articleLink}">${article.article_title}</a></p>
                <p class="paragraph">${article.content.substring(0, 50)}...</p>
                `;
                }
        });

        } catch (error) {
        console.error('記事の取得中にエラーが発生しました:', error);
        containers.forEach(container => {
            if(container) {
                container.textContent = '記事の読み込みに失敗しました';
            }
        });
    }
});