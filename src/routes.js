const express = require('express');
const routes = express.Router()

const views = __dirname + '/views/'

const Profile = {
  data: {
    name: 'Zanin',
    avatar: 'https://github.com/ZaninDe.png',
    'monthly-budget': 3000,
    'days-per-week': 5,
    'hours-per-day': 5,
    'vacation-per-year': 4,
    'value-hour': 75
  },

  controllers: {
    index(req, res) {
      return res.render(views + '/profile', { profile: Profile.data })
    },

    update(req, res) {
      //req.body para pegar os dados
      const data = req.body

      //definir quantas semanas tem no ano: 52
      const weeksPerYear = 52

      //remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mes
      const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12

      //total de horas trabalhadas na semana
      const weekTotalHours = data['hours-per-day'] * data['days-per-week']

      //horas trabalhadas no mes
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

      //qual será o valor da minha hora?
     const valueHour = data['monthly-budget'] / monthlyTotalHours
      Profile.data = {
        ...Profile.data,
        ...req.body,
        'value-hour': valueHour
      }

      return res.redirect('/profile')
    },
  }
}

const Job = {
  data: [
    {
    id: 1,
    name: 'Pizzaria Gabriel',
    'daily-hours': 2,
    'total-hours': 1,
    createdAt: Date.now(),
    budget: 4000,
    remaining: 5,
    status: 'progress'
  },
  {
    id: 2,
    name: 'OneTwo Project',
    'daily-hours': 3,
    'total-hours': 50,
    createdAt: Date.now(),
    budget: 4500,
    remaining: 6,
    status: 'done'
  }
  ],
  controllers: {
    index(req, res) {
     
        //ajustes no job
          const updatedJobs = Job.data.map((job) => {
        
            const remaining = Job.services.remainingDays(job)
        
            const status = remaining <= 0 ? 'done' : 'progress'
        
            return {
              ...job,
              remaining,
              status,
              budget: Profile.data['value-hour'] * job['total-hours']
            }
          })
          return res.render(views + 'index', { jobs: updatedJobs })
    
    },

    save(req, res) {
      const lastId = Job.data[Job.data.length - 1]?.id || 1;

      Job.data.push(
        {
          id: lastId + 1,
          name: req.body.name,
          'daily-hours': req.body['daily-hours'],
          'total-hours': req.body['total-hours'],
          createdAt: Date.now()
        }
      )
      return res.redirect('/')
    },

    create(req, res) {
      return res.render(views + 'job')
    },

    show(req, res) {
      const jobId = req.params.id

      


      return res.render(views + '/job-edit', { job })
    },
  },

  services: {
    remainingDays(job) {
      const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed()
    
        const createdDate = new Date(job.createdAt)
        const dueDay = createdDate.getDate() + Number(remainingDays)
        const dueDateInMs = createdDate.setDate(dueDay)
    
        const timeDiffInMs = dueDateInMs - Date.now()
    
        const dayInMs = 1000 * 60 * 60 * 24
        const dayDiff = Math.floor(timeDiffInMs / dayInMs)
    
        return dayDiff
    }
  }
}


routes.get('/', Job.controllers.index)

routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)

routes.get('/job/:id', Job.controllers.show)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes;