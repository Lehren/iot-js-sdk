import Connection from '../src/connection/connection';
import UsergroupHandler from '../src/usergroup/usergroup-controller';

describe('Container', () => {
  it('should not construct with invalid values', () => {
    [0, '1', {}, [], true, false, null, undefined].map(v => {
      expect(() => {
        new UsergroupHandler(v);
      }).toThrowError('connection parameter of type "Connection" is required');
    });
  });

  it('should construct with a connection object', () => {
    const conn = new Connection('url');
    const containerHandler = new UsergroupHandler(conn);
    expect(containerHandler.connection).toEqual(conn);
  });

  it('should not post with invalid containerId', done => {
    const conn = new Connection('url');
    const controller = new UsergroupHandler(conn);
    [0, {}, [], true, false, null, undefined].map(v => {
      controller.postUsergroup(v)
        .then(fail)
        .catch(error => {
          expect(error.message).toEqual('containerId parameter of type "string" is required');
        })
        .then(done);
    });
  });

  it('should not post with invalid email', done => {
    const conn = new Connection('url');
    const controller = new UsergroupHandler(conn);
    [0, {}, [], true, false, null, undefined].map(v => {
      controller.postUsergroup('1', v)
        .then(fail)
        .catch(error => {
          expect(error.message).toEqual('email parameter of type "string" is required');
        })
        .then(done);
    });
  });

  it('should post through API', done => {
    const conn = new Connection('url');
    const controller = new UsergroupHandler(conn);
    const expected = {email: 'email@email.com'};
    const fakeResponse = new Response(JSON.stringify({}), {
      status: 201,
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));

    controller.postUsergroup('1', 'email@email.com')
      .then(() => {
        const request = window.fetch.calls.mostRecent().args;
        expect(request[1].method).toBe('POST');
        expect(request[1].body).toEqual(expected);
      })
      .catch(error => {
        fail('No error should be thrown : ' + error);
      }).then(done);
  });
});
