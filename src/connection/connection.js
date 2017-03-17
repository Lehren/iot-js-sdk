export default class Connection {
  constructor(options) {
    this.url = options.API_URL;
    this.apiKey = options.API_KEY;
  }

  get(endpoint) {
    const headers = new Headers();
    headers.append('API_KEY', this.apiKey);
    const options = {
      method: 'GET',
      headers
    };

    return fetch(this.url + endpoint, options)
      .then(this.handleResponse);
  }

  post(data, endpoint) {
    const headers = new Headers();
    headers.append('API_KEY', this.apiKey);
    const options = {
      method: 'POST',
      body: data,
      headers
    };

    return fetch(this.url + endpoint, options)
      .then(this.handleResponse);
  }

  handleResponse(response) {
    return response.json();
  }
}
