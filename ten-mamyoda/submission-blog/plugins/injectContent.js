const fs = require('fs/promises');
const path = require('path');
const fp = require('fastify-plugin');

const DEFAULT_PROFILE_IMAGE_PATH = '/public/image/user-1.png';

async function injectContentPlugin(fastify, opts) {
    async function injectContent(filePath, session, dataToInject = {}) {
        let loginBoxContent = '';

        // @LOGIN_BOX@ の内容を生成
        if (session && session.authenticated) {
            const userName = session.userName || session.userID;
            loginBoxContent = `
                <div id="login-box">
                    <form action="/logout" method="post" style="display: inline-block;">
                        <button type="submit" class="button1">Logout</button>
                    </form>
                    <a href="/profile">
                        <span class="button2">${userName}</span>
                    </a>
                </div>
            `;
        } else {
            loginBoxContent = `
                <div id="login-box">
                    <a href="/login">
                        <span class="button1">Login</span>
                    </a>
                    <a href="/register">
                        <span class="button2">GetStarted</span>
                    </a>
                </div>
            `;
        }

        let htmlContent = await fs.readFile(filePath, 'utf8');

        // @LOGIN_BOX@ の置換
        htmlContent = htmlContent.replace(/@LOGIN_BOX@/g, loginBoxContent);

        // dataToInject オブジェクト内の全てのキーをプレースホルダーとして置換
        for (const key in dataToInject) {
            if (Object.prototype.hasOwnProperty.call(dataToInject, key)) {
                const placeholder = `@${key.toUpperCase()}@`;
                let value = dataToInject[key];

                // 値が undefined や null の場合は空文字列に変換
                if (value === undefined || value === null) {
                    value = '';
                }

                const finalValue = String(value);

                htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), finalValue);
            }
        }

        if (htmlContent.includes('@USER_IMG_SRC@')) {
            htmlContent = htmlContent.replace(/@USER_IMG_SRC@/g, DEFAULT_PROFILE_IMAGE_PATH);
        }

        // @ARTICLES_LIST@ が dataToInject に含まれていなければ、空文字列に置換
        if (htmlContent.includes('@ARTICLES_LIST@')) {
            htmlContent = htmlContent.replace(/@ARTICLES_LIST@/g, '');
        }

        return htmlContent;
    }

    fastify.decorate('injectContent', injectContent);
};

module.exports = fp(injectContentPlugin, {
    name: 'injectContent'
});