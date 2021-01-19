export function getURL(path) {
    return `http://localhost:3000/${path}`;
}
//add more helpers if need be...
export function getData(link, token, vm) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.open("GET", link, true);
        http.setRequestHeader("content-type", "application/json");
        http.setRequestHeader("accept", "application/json");
        http.setRequestHeader("Access-Control-Allow-Origin", "*");
        if (token) http.setRequestHeader("Authorization", token);
        http.onreadystatechange = () => _handleResponse(http, vm, resolve, reject);
        http.send();
    });
}

export function postData(link, data, token, vm) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.open("POST", link, true);
        http.setRequestHeader("content-type", "application/json");
        http.setRequestHeader("accept", "application/json");
        http.setRequestHeader("Access-Control-Allow-Origin", "*");
        if (token) http.setRequestHeader("Authorization", token);
        http.onreadystatechange = () => _handleResponse(http, vm, resolve, reject);
        http.send(JSON.stringify(data));
    });
}

function _handleResponse(http, vm, resolve, reject) {
    if (http.readyState === 4) {
        if(vm.handleHTTPError(http)) {
            if(http.responseText){
                return resolve(JSON.parse(http.responseText));
            } else {
                return resolve(true);
            }
        
        } else {
            return reject(http);
        }
    }
}

