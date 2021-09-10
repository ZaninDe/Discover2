let data = [
  {
    id: 1,
    name: 'Pizzaria Gabriel',
    'daily-hours': 2,
    'total-hours': 1,
    createdAt: Date.now(),
    remaining: 5,
    status: 'progress'
  },
  {
    id: 2,
    name: 'OneTwo Project',
    'daily-hours': 3,
    'total-hours': 50,
    createdAt: Date.now(),
    remaining: 6,
    status: 'done'
  }
];

module.exports = {
  get() {
    return data
  },

  update(newJob) {
    data = newJob
  },

  delete(id) {
    data = data.filter(job => Number(job.id) !== Number(id))
  }
}