class ReqresApi {
  constructor(apiContext) {
    this.apiContext = apiContext;
  }

  async getUsers(pageNumber) {
    return this.apiContext.get('/api/users', {
      params: { page: pageNumber },
    });
  }

  async createUser(user) {
    return this.apiContext.post('/api/users', { data: user });
  }

  async replaceUser(userId, user) {
    return this.apiContext.put(`/api/users/${userId}`, { data: user });
  }

  async updateUser(userId, user) {
    return this.apiContext.patch(`/api/users/${userId}`, { data: user });
  }

  async deleteUser(userId) {
    return this.apiContext.delete(`/api/users/${userId}`);
  }
}

module.exports = { ReqresApi };
