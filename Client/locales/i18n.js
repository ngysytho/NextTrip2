import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            login: 'Login Account',
            logout: 'Logout',
            hello: 'Hello, {{name}}',
            version: 'Version {{ver}}',
        },
    },
    vi: {
        translation: {
            login: 'Đăng nhập tài khoản',
            logout: 'Đăng xuất',
            hello: 'Xin chào, {{name}}',
            version: 'Phiên bản {{ver}}',
        },
    },
    zh: {
        translation: {
            login: '登录账户',
            logout: '退出登录',
            hello: '你好, {{name}}',
            version: '版本 {{ver}}',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'vi', // mặc định tiếng Việt
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
