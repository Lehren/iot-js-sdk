import Connection from '../src/connection/connection';
import HistoryHandler from '../src/history/history-controller';

describe('History', () => {
  it('should not construct with invalid values', () => {
    [0, '1', {}, [], true, false, null, undefined].map(v => {
      expect(() => {
        new HistoryHandler(v);
      }).toThrowError('connection parameter of type "Connection" is required');
    });
  });

  it('should construct with a connection object', () => {
    const conn = new Connection('url');
    const historyHandler = new HistoryHandler(conn);
    expect(historyHandler.connection).toEqual(conn);
  });

  it('should not get the history if an invalid id is given', done => {
    const conn = new Connection('url');
    const historyHandler = new HistoryHandler(conn);
    [0, {}, [], true, false, null, undefined].map(v => {
      historyHandler.getHistory(v)
        .then(fail)
        .catch(error => {
          expect(error.message).toEqual('id parameter of type "string" is required');
        })
        .then(done);
    });
  });

  it('should get the history of one container', done => {
    const conn = new Connection('url');
    const historyHandler = new HistoryHandler(conn);
    const content = [
      {
        fillLevel: 0,
        id: 'prototype_container1',
        timeStamp: '2017-06-02T15:27:06.986564+02:00'
      },
      {
        fillLevel: 86,
        id: 'prototype_container1',
        timeStamp: '2017-06-02T15:29:26.0147622+02:00'
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

    historyHandler.getHistory('prototype_container1')
      .then(result => {
        expect(result).toEqual(content);
        expect(conn.get).toHaveBeenCalledTimes(1);
        expect(conn.get).toHaveBeenCalledWith('/containers/history/prototype_container1');
      })
      .catch(fail)
      .then(done);
  });
});
