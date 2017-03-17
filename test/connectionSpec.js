import Connection from '../src/connection/connection';

describe('Connection', () => {
  it('should construct with a valid value', () => {
    const options = {
      API_URL: 'url'
    };
    const conn = new Connection(options);
    expect(conn.url).toBe('url');
  });

  it('it should get the correct url', done => {
    const content = {
      signature: 'sfcgywesgf3g8'
    };
    const fakeResponse = new Response(JSON.stringify(content), {
      status: 201,
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));
    const url = '127.0.0.1';
    const options = {
      API_URL: url,
      API_KEY: 'apikey'
    };
    const endpoint = '/containers';
    const conn = new Connection(options);
    conn.get(endpoint)
      .then(result => {
        const request = window.fetch.calls.mostRecent().args;
        expect(request[0]).toBe(url + endpoint);
        expect(request[1].method).toBe('GET');
        expect(request[1].headers.get('API_KEY')).toEqual('apikey');
        expect(result).toEqual(content);
      })
      .catch(fail)
      .then(done);
  });

  it('should post to the correct url', done => {
    const content = {
      signature: 'sfcgywesgf3g8'
    };
    const fakeResponse = new Response(JSON.stringify(content), {
      status: 201,
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
    const postData = {
      signature: 'POST86753wqaserdfgyu7t'
    };
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));
    const url = '127.0.0.1';
    const options = {
      API_URL: url,
      API_KEY: 'apikey'
    };
    const endpoint = '/containers';
    const conn = new Connection(options);
    conn.post(postData, endpoint)
      .then(result => {
        const request = window.fetch.calls.mostRecent().args;
        expect(request[0]).toBe(url + endpoint);
        expect(request[1].method).toBe('POST');
        expect(request[1].body).toBe(postData);
        expect(request[1].headers.get('API_KEY')).toEqual('apikey');
        expect(result).toEqual(content);
      })
      .catch(fail)
      .then(done);
  });
});
