import Connection from '../connection/connection';

export default class HistoryController {
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error('connection parameter of type "Connection" is required');
    }
    this.connection = connection;
  }

  getHistory(id) {
    if (typeof id !== 'string') {
      return Promise.reject(new Error('id parameter of type "string" is required'));
    }
    return this.connection.get('/containers/history/' + id)
      .then(data => data.map(entry => ({
        id: entry.id,
        fillLevel: entry.fillLevel,
        timeStamp: entry.timeStamp
      })));
  }
}
