import { Router } from 'express'
import { User, Department, UserPosition, Account, Flags } from '@Backend/entity'
import { ash, ParamsRequired, IsDateUnix} from '@Backend/helpers'
import { UserSerivces } from '@Backend/Services'
import { GenericError } from '@Backend/Error'
import { IAuthedUser, ICreateUserDTO, EFlags } from '/project/shared'
import * as core from 'express-serve-static-core'

const router = Router()

router.route('/:id')
  .get(ash<{ id: string }, IAuthedUser>(async(req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    const user = await UserSerivces.getUserById(req.params.id)
    res.json({user})
  }))

router.route('/')
  .get(ash(async(req,res,next) => {
    User.find()
      .then(users => res.json(users))
  }))
  
  .post(ash(async(
    req:core.Request<{},{},ICreateUserDTO>,
    res,
    next) => {
      const { userName, departId, posId, employeeId, birthday, inDate } = req.body
      ParamsRequired({ userName, departId, employeeId, posId, birthday, inDate })
      IsDateUnix(birthday)
      IsDateUnix(inDate)

      const [existedUser, department, position] = await Promise.all([
        User.findOneBy({ employeeId }),
        Department.findOneByOrFail({ departId: departId.departId }),
        UserPosition.findOneByOrFail({ posId: posId.posId })
      ])

      if(existedUser) 
        throw new GenericError(`User with employeeId ${employeeId} already existed`)

      const newUser = new User()
      const newAccount = new Account()
      newAccount.displayName = userName
      newAccount.accountType = "user"
      newAccount.accountState = await Flags.findOneByOrFail({ flagId: EFlags.activated })
      await newAccount.save()
      newUser.account = newAccount
      newUser.birthday = birthday.toString()
      newUser.inDate = inDate.toString()
      newUser.department = department
      newUser.position = position
      newUser.employeeId = employeeId
      newUser.userName = userName
      await newUser.save()

      res.json(newUser)
  }))

export default router