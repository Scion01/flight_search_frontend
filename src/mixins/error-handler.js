export default {
    methods: {
      handleHTTPError(http) {
        if (http.status < 400) return true;
        if (http.status < 500) {
          console.log(`Probably an auth issue, status code: ${http.status}`);
        } else if (http.status < 600) {
            console.log(`Probably a server error, status code: ${http.status}`);
        }
        return false;
      }
    }
}