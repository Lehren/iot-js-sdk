import Connection from '../src/connection/connection';
import FillLevelHandler from '../src/fill-level/fill-level-controller';

describe('FillLevel', () => {
  it('should not construct with invalid values', () => {
    [0, '1', {}, [], true, false, null, undefined].map(v => {
      expect(() => {
        new FillLevelHandler(v);
      }).toThrowError('connection parameter of type "Connection" is required');
    });
  });

  it('should construct with a connection object', () => {
    const conn = new Connection('url');
    const fillHandler = new FillLevelHandler(conn);
    expect(fillHandler.connection).toEqual(conn);
  });

  it('should not get the fill level if an invalid value is given', done => {
    const conn = new Connection('url');
    const fillHandler = new FillLevelHandler(conn);
    [0, {}, [], true, false, null, undefined].map(v => {
      fillHandler.getFillLevel(v)
        .then(fail)
        .catch(error => {
          expect(error.message).toEqual('id parameter of type "string" is required');
        })
        .then(done);
    });
  });

  it('should get the fill level of one container', done => {
    const conn = new Connection('url');
    const fillHandler = new FillLevelHandler(conn);
    const content = {
      id: '1',
      fillLevel: '50'
    };
    const fakeResponse = new Response(JSON.stringify(content), {
      status: 200,
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
    spyOn(conn, 'get').and.callThrough();
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(fakeResponse));

    fillHandler.getFillLevel('1')
      .then(result => {
        expect(result).toEqual(content);
        expect(conn.get).toHaveBeenCalledTimes(1);
        expect(conn.get).toHaveBeenCalledWith('/containers/filllevel/1');
      })
      .catch(fail)
      .then(done);
  });
});
