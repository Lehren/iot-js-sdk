import Connection from '../src/connection/connection';
import ContainerHandler from '../src/container/container-controller';

describe('Container', () => {
  it('should not construct with invalid values', () => {
    [0, '1', {}, [], true, false, null, undefined].map(v => {
      expect(() => {
        new ContainerHandler(v);
      }).toThrowError('connection parameter of type "Connection" is required');
    });
  });

  it('should construct with a connection object', () => {
    const conn = new Connection('url');
    const containerHandler = new ContainerHandler(conn);
    expect(containerHandler.connection).toEqual(conn);
  });

  it('should not get a container if an invalid value is given', done => {
    const conn = new Connection('url');
    const containerHandler = new ContainerHandler(conn);
    [0, {}, [], true, false, null, undefined].map(v => {
      containerHandler.getContainer(v)
        .then(fail)
        .catch(error => {
          expect(error.message).toEqual('id parameter of type "string" is required');
        })
        .then(done);
    });
  });

  it('should get one container', done => {
    const conn = new Connection('url');
    const containerHandler = new ContainerHandler(conn);
    const content = {
      id: '1',
      fillLevel: '50',
      latitude: '32.4375838',
      longitude: '53.353452',
      lastUpdated: '2017-05-03T09:41:23+00:00'
    };
    const fakeResponse = new Response(JSON.stringify(content), {
      status: 200,
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
    spyOn(conn, 'get').and.callThrough();
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));

    containerHandler.getContainer('1')
      .then(result => {
        expect(result).toEqual(content);
        expect(conn.get).toHaveBeenCalledTimes(1);
        expect(conn.get).toHaveBeenCalledWith('/containers/1');
      })
      .catch(fail)
      .then(done);
  });

  it('should get multiple containers near me', done => {
    const conn = new Connection('url');
    const containerHandler = new ContainerHandler(conn);
    const content =
      [
        {
          id: '1',
          fillLevel: '50',
          latitude: '32.4375838',
          longitude: '53.353452',
          lastUpdated: '2017-05-03T09:41:23+00:00'
        },
        {
          id: '2',
          fillLevel: '34',
          latitude: '87.453423',
          longitude: '21.346552',
          lastUpdated: '2017-05-03T09:41:23+00:00'
        }
      ];

    const fakeResponse = new Response(JSON.stringify(content), {
      status: 200,
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
    spyOn(conn, 'get').and.callThrough();
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));

    containerHandler.getContainersNearMe('32,235462', '43,564322')
      .then(result => {
        expect(result).toEqual(content);
        expect(conn.get).toHaveBeenCalledTimes(1);
        expect(conn.get).toHaveBeenCalledWith('/containers/nearme/32,235462/43,564322');
      })
      .catch(fail)
      .then(done);
  });

  it('should not post with invalid containerId', done => {
    const conn = new Connection('url');
    const controller = new ContainerHandler(conn);
    [0, {}, [], true, false, null, undefined].map(v => {
      controller.subscribeToContainer(v)
        .then(fail)
        .catch(error => {
          expect(error.message).toEqual('containerId parameter of type "string" is required');
        })
        .then(done);
    });
  });

  it('should not post with invalid email', done => {
    const conn = new Connection('url');
    const controller = new ContainerHandler(conn);
    [0, {}, [], true, false, null, undefined].map(v => {
      controller.subscribeToContainer('1', v)
        .then(fail)
        .catch(error => {
          expect(error.message).toEqual('email parameter of type "string" is required');
        })
        .then(done);
    });
  });

  it('should post through API', done => {
    const conn = new Connection('url');
    const controller = new ContainerHandler(conn);
    const expected =
      {
        id: '1',
        email: 'email@email.com'
      };
    const fakeResponse = new Response(JSON.stringify({}), {
      status: 201,
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));

    controller.subscribeToContainer('1', 'email@email.com')
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
