import Connection from '../connection/connection';

export default class UsergroupController {
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error('connection parameter of type "Connection" is required');
    }
    this.connection = connection;
  }

  postUsergroup(containerId, email) {
    if (typeof containerId !== 'string') {
      return Promise.reject(new Error('containerId parameter of type "string" is required'));
    }
    if (typeof email !== 'string') {
      return Promise.reject(new Error('email parameter of type "string" is required'));
    }
    const data =
      {
        id: containerId,
        email
      };
    return this.connection.post(data, '/containers/usergroup');
  }
}
