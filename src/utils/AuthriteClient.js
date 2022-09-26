import { Authrite } from 'authrite-js'
// Singleton class for managing a single AuthriteClient instance
class AuthriteClient {
  constructor () {
    if (!AuthriteClient.instance) {
      AuthriteClient.instance = new Authrite()
    }
    return AuthriteClient.instance
  }
}

export default AuthriteClient
