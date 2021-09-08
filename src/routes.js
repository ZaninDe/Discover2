const express = require('express');
const routes = express.Router()

const views = __dirname + '/views/'

const profile = {
  name: 'Zanin',
  avatar: 'https://github.com/ZaninDe.png',
  'monthly-budget': 3000,
  'days-per-week': 5,
  'hours-per-day': 5,
  'vacation-per-year': 4
}

routes.get('/', (req, res) => res.render(views + '/index.ejs'))
routes.get('/job', (req, res) => res.render(views + '/job.ejs'))
routes.get('/job/edit', (req, res) => res.render(views + '/job-edit.ejs'))
routes.get('/profile', (req, res) => res.render(views + '/profile.ejs', { profile }))

module.exports = routes;