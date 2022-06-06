import { ParamsRequired, ash } from '@Backend/helpers'
import { Category } from '@Backend/entity'
import * as core from 'express-serve-static-core'
import { ICategoryCreateDTO } from '/project/shared'
import { GenericError } from '@Backend/Error'

import { Router } from 'express'

const router = Router()

router.route('/')
  .post(ash(async(
    req: core.Request<{},{},ICategoryCreateDTO>,
    res,
    next) => {
      const { categoryName, description, brand } = req.body
      
      ParamsRequired({ categoryName, brand })

      const existedCategory = await Category.findOneBy({ categoryName })
      if(existedCategory){
        throw new GenericError(`Category with name ${categoryName} already existed`)
      }

      const newCategory = new Category()
      newCategory.brand = brand
      newCategory.categoryName = categoryName
      newCategory.description = description

      await newCategory.save()
      res.json(newCategory)

  }))

export default router