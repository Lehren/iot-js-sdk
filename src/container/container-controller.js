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
    return this.connection.get('/containers/' + id)
      .then(data => ({
        id: data.id,
        fillLevel: data.fillLevel,
        latitude: data.latitude,
        longitude: data.longitude,
        lastUpdated: data.lastUpdated
      }));
  }

  getContainersNearMe(latitude, longitude) {
    const result = [];
    return this.connection.get('/containers/nearme/' + latitude + '/' + longitude)
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
