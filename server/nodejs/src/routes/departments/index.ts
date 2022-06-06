import { Router } from 'express'
import { ash, ParamsRequired } from '@Backend/helpers'
import { Department, Flags } from '@Backend/entity'
import { EFlags, ICreateDepartmentDTO } from '/project/shared'
import * as core from 'express-serve-static-core'
import { GenericError } from '@Backend/Error'

const router = Router()

router.route('/')
  .post(ash(async(
    req: core.Request<{},{},ICreateDepartmentDTO>,
    res,
    next
    ) => {
      const { departName, departCode } = req.body
      ParamsRequired({ departName, departCode })
      const existedDepartment = await Department.findOneBy({ departName })
      if(existedDepartment)
        throw new GenericError(`Department with name ${departName} already existed`)
      
      const newDepartment = new Department()
      newDepartment.departCode = departCode
      newDepartment.departName = departName
      newDepartment.departState = await Flags.findOneByOrFail({ flagId: EFlags.activated })
      
      await newDepartment.save()

      res.json(newDepartment)
  }))
  .get(ash(async(req,res,next) => {
    Department.find().then(departs => {
      res.json(departs)
    })
  }))

router.route('/:departId')
  .get(ash(async(req,res,next) => {
    const { departId } = req.params
    const department = await Department.findOneByOrFail({ departId })

    res.json(department)
  }))

  .put(ash(async(
    req,
    res,
    next) => {
    const { departId } = req.params
    const { departName, departCode } = req.body
    // check role if allow to update
    const department = await Department.findOneByOrFail({ departId }) 

    department.departCode = departCode
    department.departName = departName
    await department.save()

    res.json(department)

  }))

  .delete(ash(async(req,res,next) => {
    const { departId } = req.params
    const department = await Department.findOneByOrFail({ departId })
    await department.remove()
    res.json({})
  }))

export default router