
import { Router } from 'express'
import { ash, ParamsRequired } from '@Backend/helpers'
import { Category, Item } from '@Backend/entity'
import { IItemCreateDTO } from '/project/shared'
import * as core from 'express-serve-static-core'

const router = Router()

router.route('/:itemId')
  .get(ash(async(req,res,next) => {
    const { itemId } = req.params

    const item = await Item.findOneBy({ itemId })

    res.json(item)
  }))

router.route('/')
  .get(ash(async(req,res,next) => {
    const items = await Item.find()
    res.json(items)
  
  }))

  .post(ash(async(
    req: core.Request<{ }, { },IItemCreateDTO, {}>,
    res,
    next) => {
    
    const { categoryId, serialOrImei } = req.body
    ParamsRequired({ categoryId, serialOrImei })
    
    const category = await Category.findOneByOrFail({ categoryId })
    const newItem = new Item()
    newItem.category = category
    newItem.serialOrImei = serialOrImei
    await newItem.save()

    res.json(newItem)
    
  }))


export default router