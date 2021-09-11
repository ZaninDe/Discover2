const Job = require('../model/Job')
const Profile = require('../model/Profile')
const JobUtils = require('../utils/JobUtils')

module.exports = {
  index(req, res) {

    const jobs = Job.get()
    const profile = Profile.get()

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    // total de horas por dia de cada Job em progresso
    let jobTotalHours = 0

    //ajustes no job
    const updatedJobs = jobs.map((job) => {

      const remaining = JobUtils.remainingDays(job)

      const status = remaining <= 0 ? 'done' : 'progress'

      //somando a quantidade de stauts
      statusCount[status] += 1


      // total de horas por dia de cada Job em progresso
      jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours


      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile['value-hour'])
      }
    })

    // horas livres é igual a quantidade de horas diárias de trabalho setada no perfil
    // menos a soma diária dos projetos em andamento
    const freeHours = profile['hours-per-day'] - jobTotalHours

    return res.render('index', { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })

  }
}
