import { Router } from 'express'
import { ash } from '@Backend/helpers'
import { UserModel } from '@Backend/models'
import { IAuthedUser } from '/project/shared'

const router = Router()

router.route('/:id')
  .get(ash<{ id: number }, IAuthedUser>(async(req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    const user = await UserModel.getUserByID(req.params.id)
    const authedUser : IAuthedUser = {
      jwt: token,
      user: user.toJSON()
    }
    res.json(authedUser)
  }))

export default router