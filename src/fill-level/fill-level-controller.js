import Connection from '../connection/connection';

export default class FillLevelController {
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error('connection parameter of type "Connection" is required');
    }
    this.connection = connection;
  }

  getFillLevel(id) {
    if (typeof id !== 'string') {
      return Promise.reject(new Error('id parameter of type "string" is required'));
    }
    return this.connection.get('/containers/filllevel/' + id)
      .then(data => ({
        id: data.id,
        fillLevel: data.fillLevel
      }));
  }
}
