const token = localStorage.getItem("token");

if (!token) {
    location.href = "admin-login.html";
}

const adminFetch = (url, options = {}) => {

    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
    };

    return fetch(url, options);

};