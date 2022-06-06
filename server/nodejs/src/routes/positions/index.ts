import { ash, ParamsRequired } from '@Backend/helpers'
import { UserPosition, Department, Account, User, Flags } from '@Backend/entity'
import { Router } from 'express'
import { EFlags, ICreatePositionDTO } from '/project/shared'
import * as core from 'express-serve-static-core'
import { GenericError } from '@Backend/Error'

const router = Router()

router.route("/:posId")
  .get(ash(async(req,res,next) => {
    const { posId } = req.params
    const position = await UserPosition.findOneByOrFail({ posId })

    res.json(position)
  }))

  .put(ash(async(
    req,
    res,
    next) => {
    const { posId } = req.params
    const { posName, posCode } = req.body

    // check role if allow to update
    const position = await UserPosition.findOneByOrFail({ posId }) 

    position.posCode = posCode
    position.posName = posName
    await position.save()

    res.json(position)

  }))

router.route("/")
  .get(ash(async(req,res,next) => {
    UserPosition.find()
      .then(data => res.json(data))
  }))
  
  .post(ash(async(
    req: core.Request<{},{}, ICreatePositionDTO>,
    res,
    next) => {
      const { posCode, posName } = req.body
      ParamsRequired({ posCode, posName })
      const existedPosition = await UserPosition.findOneBy({ posName })
      if(existedPosition) 
        throw new GenericError(`Position with name ${posName} already existed`)
      const userPosition = new UserPosition()
      userPosition.posCode = posCode
      userPosition.posName = posName
      await userPosition.save()

      res.json(userPosition)
  }))

export default router