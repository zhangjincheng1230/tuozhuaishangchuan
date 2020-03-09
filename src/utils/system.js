import uuidv1 from 'uuid/v1'
var system = {
  getClientId: function () {
    let clientId = localStorage.getItem('client_id')
    if (!clientId) {
      localStorage.setItem('client_id', uuidv1())
    }
    return localStorage.getItem('client_id')
  }
}
export default system
