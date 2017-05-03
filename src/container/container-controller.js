import Connection from '../connection/connection';

export default class ContainerController {
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error('connection parameter of type "Connection" is required');
    }
    this.connection = connection;
  }

  getContainer(id) {
    if (typeof id !== 'string') {
      return Promise.reject(new Error('id parameter of type "string" is required'));
    }
    return this.connection.get('/containers/container/' + id)
      .then(data => ({
        id: data.id,
        fillLevel: data.fillLevel,
        latitude: data.latitude,
        longitude: data.longitude,
        lastUpdated: data.lastUpdated
      }));
  }

  getContainers() {
    const result = [];
    return this.connection.get('/containers/container')
      .then(data => data.map(datum => {
        result.push({
          id: datum.id,
          fillLevel: datum.fillLevel,
          latitude: datum.latitude,
          longitude: datum.longitude,
          lastUpdated: datum.lastUpdated
        });
      }))
      .then(() => result);
  }
}
