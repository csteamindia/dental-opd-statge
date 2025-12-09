const cookieHelper = {
    setCookie: (name, value, h = 1, days = 1, path = '/', domain, secure = true, sameSite = 'Strict') => {
        let expires = '';
        const date = new Date();
        date.setTime(date.getTime() + ((h * days) * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    
        const domainString = domain ? `; domain=${domain}` : '';
        const secureString = secure ? '; Secure' : '';
        const sameSiteString = sameSite ? `; SameSite=${sameSite}` : '';
    
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${domainString}${secureString}${sameSiteString}`;
    },

    getCookie: (name) => {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    },

    deleteCookie: (name, path = '/', domain) => {
        const domainString = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=-99999999; path=${path}${domainString}`;
    }
};

export default cookieHelper;
